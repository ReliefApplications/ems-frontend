import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  Inject,
  OnInit,
  OnDestroy,
  ElementRef,
  inject,
  DestroyRef,
} from '@angular/core';
import { LineChartComponent } from '../../ui/charts/line-chart/line-chart.component';
import { PieDonutChartComponent } from '../../ui/charts/pie-donut-chart/pie-donut-chart.component';
import { BarChartComponent } from '../../ui/charts/bar-chart/bar-chart.component';
import { uniq, get, groupBy, isEqual, cloneDeep } from 'lodash';
import { AggregationService } from '../../../services/aggregation/aggregation.service';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ContextService } from '../../../services/context/context.service';
import { DOCUMENT } from '@angular/common';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { WidgetService } from '../../../services/widget/widget.service';
import { authType } from '../../../models/api-configuration.model';
import { ReferenceDataService } from '../../../services/reference-data/reference-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Default file name for chart exports
 */
const DEFAULT_FILE_NAME = 'chart';

/**
 * Joins context filters and predefined filters
 *
 * @param contextFilters Context filters, stringified JSON
 * @param predefinedFilter Predefined filter coming from the dropdown
 * @returns The joined filters
 */
const joinFilters = (
  contextFilters: CompositeFilterDescriptor,
  predefinedFilter: CompositeFilterDescriptor | null
): CompositeFilterDescriptor => {
  const filter: CompositeFilterDescriptor = {
    logic: 'and',
    filters: [],
  };

  if (contextFilters) {
    filter.filters.push(contextFilters);
  }

  if (predefinedFilter) {
    filter.filters.push(predefinedFilter);
  }

  return filter;
};

/**
 * Chart widget component.
 * Use Chartjs.
 */
@Component({
  selector: 'shared-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent
  extends BaseWidgetComponent
  implements OnInit, OnChanges, OnDestroy
{
  /** Can chart be exported */
  @Input() export = true;
  /** Widget settings */
  @Input() settings: any = null;
  /** Chart component reference */
  @ViewChild('chartWrapper')
  private chartWrapper?:
    | LineChartComponent
    | PieDonutChartComponent
    | BarChartComponent;
  /** Loading indicator */
  public loading = true;
  /** Chart options */
  public options: any = null;
  /** Graphql query */
  private dataQuery: any;
  /** Chart series as behavior subject */
  private series = new BehaviorSubject<any[]>([]);
  /** Chart series as observable */
  public series$ = this.series.asObservable();
  /** Last update time */
  public lastUpdate = '';
  /** Is aggregation broken */
  public hasError = false;
  /** Selected predefined filter */
  public selectedFilter: CompositeFilterDescriptor | null = null;
  /** Aggregation id */
  private aggregationId?: string;
  /** Subject to emit signals for cancelling previous data queries */
  private cancelRefresh$ = new Subject<void>();
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /** @returns Context filters array */
  get contextFilters(): CompositeFilterDescriptor {
    return this.settings.contextFilters
      ? JSON.parse(this.settings.contextFilters)
      : {
          logic: 'and',
          filters: [],
        };
  }

  /** @returns reference data (graphql or rest) query params */
  get queryParams() {
    return this.widgetService.replaceReferenceDataQueryParams(
      this.settings.referenceDataVariableMapping
    );
  }

  /**
   * Get filename from the date and widget title
   *
   * @returns filename
   */
  get fileName(): string {
    const today = new Date();
    const formatDate = `${today.toLocaleString('en-us', {
      month: 'short',
      day: 'numeric',
    })} ${today.getFullYear()}`;
    return `${
      this.settings.title ? this.settings.title : DEFAULT_FILE_NAME
    } ${formatDate}.png`;
  }

  /**
   * Get predefined filters from settings
   *
   * @returns array of filters
   */
  get predefinedFilters(): {
    label: string;
    filter: CompositeFilterDescriptor;
  }[] {
    return this.settings?.filters ?? [];
  }

  /**
   * Chart widget component.
   * Use Chartjs.
   *
   * @param aggregationService Shared aggregation service
   * @param translate Angular translate service
   * @param contextService Shared context service
   * @param {ElementRef} el Current components element ref in the DOM
   * @param document document
   * @param dashboardService Shared dashboard service
   * @param widgetService Shared widget service
   * @param referenceDataService Shared reference data service
   */
  constructor(
    private aggregationService: AggregationService,
    private translate: TranslateService,
    private contextService: ContextService,
    private el: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private dashboardService: DashboardService,
    private widgetService: WidgetService,
    private referenceDataService: ReferenceDataService
  ) {
    super();
  }

  ngOnInit(): void {
    // Listen to dashboard filters changes if it is necessary
    this.contextService.filter$
      .pipe(
        // On working with web components we want to send filter value if this current element is in the DOM
        // Otherwise send value always
        filter(() =>
          this.contextService.shadowDomService.isShadowRoot
            ? this.contextService.shadowDomService.currentHost.contains(
                this.el.nativeElement
              )
            : true
        ),
        debounceTime(500),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ previous, current }) => {
        if (
          this.contextService.filterRegex.test(this.settings.contextFilters) ||
          this.contextService.filterRegex.test(
            this.settings.referenceDataVariableMapping
          )
        ) {
          if (
            this.contextService.shouldRefresh(this.settings, previous, current)
          ) {
            this.series.next([]);
            this.loadChart();
            this.getOptions();
          }
        }
      });
    // Listen to series data changes to know when widget is empty and will be hidden
    if (this.settings.widgetDisplay.hideEmpty) {
      this.series$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.dashboardService.widgetContentRefreshed.next(null);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const previousDatasource = {
      resource: get(changes, 'settings.previousValue.resource'),
      referenceData: get(changes, 'settings.previousValue.referenceData'),
      chart: {
        aggregationId: get(
          changes,
          'settings.previousValue.chart.aggregationId'
        ),
      },
    };
    const currentDatasource = {
      resource: get(changes, 'settings.currentValue.resource'),
      referenceData: get(changes, 'settings.currentValue.referenceData'),
      chart: {
        aggregationId: get(
          changes,
          'settings.currentValue.chart.aggregationId'
        ),
      },
    };

    if (!isEqual(previousDatasource, currentDatasource)) {
      const currentAggregationId = get(
        changes,
        'settings.currentValue.chart.aggregationId'
      );
      this.aggregationId = String(currentAggregationId)
        ? String(currentAggregationId)
        : this.aggregationId;
      this.loadChart();
    }
    this.getOptions();
  }

  ngOnDestroy(): void {
    this.cancelRefresh$.next();
    this.cancelRefresh$.complete();
  }

  /** Loads chart */
  private loadChart(): void {
    this.cancelRefresh$.next();
    if (!(this.settings.resource || this.settings.referenceData)) {
      return;
    }
    this.loading = true;
    const filters = joinFilters(this.contextFilters, this.selectedFilter);

    const defaultLogic = () => {
      this.dataQuery = this.aggregationService.aggregationDataQuery({
        referenceData: this.settings.referenceData,
        resource: this.settings.resource,
        aggregation: this.aggregationId || '',
        mapping: get(this.settings, 'chart.mapping', null),
        contextFilters: filters,
        queryParams: this.queryParams,
        at: this.settings.at
          ? this.contextService.atArgumentValue(this.settings.at)
          : undefined,
      });
      if (this.dataQuery) {
        this.dataQuery
          .pipe(
            takeUntil(this.cancelRefresh$),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(({ errors, data, loading }: any) => {
            if (errors) {
              this.loading = false;
              this.hasError = true;
              this.series.next([]);
            } else {
              this.getData(data);
              this.loading = loading;
            }
          });
      } else {
        this.loading = false;
      }
    };

    if (this.settings.resource || !this.aggregationId) {
      defaultLogic();
    } else if (this.settings.referenceData) {
      // First, load reference data
      this.referenceDataService
        .loadReferenceData(this.settings.referenceData)
        .then((refData) => {
          // Then, if using auth code, directly query external API
          if (
            refData.apiConfiguration?.authType === authType.authorizationCode
          ) {
            this.aggregationService
              .getAggregations({
                referenceData: this.settings.referenceData,
                ids: [this.aggregationId || ''],
              })
              .then(({ edges }) => {
                const aggregationModel = edges[0].node;
                this.referenceDataService
                  .aggregate(refData, aggregationModel, {
                    mapping: get(this.settings, 'chart.mapping', null),
                    queryParams: this.queryParams,
                    contextFilters: filters
                      ? this.contextService.injectContext(filters)
                      : undefined,
                  })
                  .then((aggregationData) => {
                    this.getData({
                      referenceDataAggregation: aggregationData,
                    });
                    this.loading = false;
                  })
                  .catch(() => {
                    this.loading = false;
                    this.hasError = true;
                    this.series.next([]);
                  });
              })
              .catch(() => {
                this.loading = false;
                this.hasError = true;
                this.series.next([]);
              });
          } else {
            // Else, apply default logic
            defaultLogic();
          }
        });
    }
  }

  /**
   * Exports the chart as a png ticket
   */
  public onExport(): void {
    const downloadLink = this.document.createElement('a');
    downloadLink.href = this.chartWrapper?.chart?.toBase64Image() as string;
    downloadLink.download = this.fileName;
    downloadLink.click();
  }

  /**
   * Get chart options from settings
   */
  public getOptions(): void {
    this.options = {
      palette: get(this.settings, 'chart.palette.enabled', false)
        ? get(this.settings, 'chart.palette.value', null)
        : null,
      axes: {
        x: {
          min: get(this.settings, 'chart.axes.x.enableMin')
            ? get(this.settings, 'chart.axes.x.min')
            : null,
          max: get(this.settings, 'chart.axes.x.enableMax')
            ? get(this.settings, 'chart.axes.x.max')
            : null,
          stepSize: get(this.settings, 'chart.axes.x.stepSize')
            ? get(this.settings, 'chart.axes.x.stepSize')
            : null,
        },
        y: {
          min: get(this.settings, 'chart.axes.y.enableMin')
            ? get(this.settings, 'chart.axes.y.min')
            : null,
          max: get(this.settings, 'chart.axes.y.enableMax')
            ? get(this.settings, 'chart.axes.y.max')
            : null,
          stepSize: get(this.settings, 'chart.axes.y.stepSize')
            ? get(this.settings, 'chart.axes.y.stepSize')
            : null,
        },
      },
      grid: {
        x: {
          display: get(this.settings, 'chart.grid.x.display', true),
        },
        y: {
          display: get(this.settings, 'chart.grid.y.display', true),
        },
      },
      labels: {
        showCategory: get(this.settings, 'chart.labels.showCategory', false),
        showValue: get(this.settings, 'chart.labels.showValue', false),
        valueType: get(this.settings, 'chart.labels.valueType', 'value'),
      },
      stack: get(this.settings, 'chart.stack.enable', false)
        ? get(this.settings, 'chart.stack.usePercentage', false)
          ? { type: '100%' }
          : { type: 'normal' }
        : false,
      series: get(this.settings, 'chart.series'),
    };
  }

  /**
   * Load the data, using widget parameters.
   *
   * @param data data to process
   */
  private getData(data: any): void {
    this.hasError = false;
    const today = new Date();
    this.lastUpdate =
      ('0' + today.getHours()).slice(-2) +
      ':' +
      ('0' + today.getMinutes()).slice(-2);

    if (
      ['pie', 'donut', 'radar', 'line', 'bar', 'column', 'polar'].includes(
        this.settings.chart.type
      )
    ) {
      const aggregationData = cloneDeep(
        this.settings.resource
          ? data.recordsAggregation
          : data.referenceDataAggregation
      );

      // Check if we got any data back
      this.isEmpty =
        Array.isArray(aggregationData) && aggregationData.length === 0;
      // If series
      if (get(this.settings, 'chart.mapping.series', null)) {
        const groups = groupBy(aggregationData, 'series');
        const categories = uniq(aggregationData.map((x: any) => x.category));
        this.series.next(
          Object.keys(groups).map((key) => {
            const rawData = groups[key];
            const returnData = Array.from(
              categories,
              (category) =>
                rawData.find((x) => x.category === category) || {
                  category,
                  field: null,
                }
            );
            return {
              label:
                key || this.translate.instant('components.widget.chart.other'),
              name: key,
              data: returnData,
            };
          })
        );
      } else {
        // Group under same series
        this.series.next([
          {
            data: aggregationData,
          },
        ]);
      }
    } else {
      this.series.next(
        this.settings.resource ? data.recordsAggregation : data.referenceData
      );

      this.isEmpty =
        Array.isArray(this.series.value) && this.series.value.length === 0;
    }
  }

  /**
   * Applies selected filter to the query
   *
   * @param filter Filter to be applied
   */
  onFilterSelected(
    filter: (typeof this.predefinedFilters)[number] | undefined
  ) {
    if (filter) {
      this.selectedFilter = filter.filter;
    } else {
      this.selectedFilter = null;
    }
    this.loadChart();
  }
}
