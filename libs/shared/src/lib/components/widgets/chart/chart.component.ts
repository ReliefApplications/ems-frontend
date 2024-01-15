import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  Inject,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { LineChartComponent } from '../../ui/charts/line-chart/line-chart.component';
import { PieDonutChartComponent } from '../../ui/charts/pie-donut-chart/pie-donut-chart.component';
import { BarChartComponent } from '../../ui/charts/bar-chart/bar-chart.component';
import { uniq, get, groupBy, isEqual } from 'lodash';
import { AggregationService } from '../../../services/aggregation/aggregation.service';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ContextService } from '../../../services/context/context.service';
import { DOCUMENT } from '@angular/common';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

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
  const res: CompositeFilterDescriptor = {
    logic: 'and',
    filters: [],
  };

  if (contextFilters) {
    res.filters.push(contextFilters);
  }

  if (predefinedFilter) {
    res.filters.push(predefinedFilter);
  }

  return res;
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
  extends UnsubscribeComponent
  implements OnInit, OnChanges
{
  /** Can chart be exported */
  @Input() export = true;
  /** Widget settings */
  @Input() settings: any = null;
  /** Widget header template reference */
  @ViewChild('headerTemplate') headerTemplate!: TemplateRef<any>;
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
  /** Previous context filter value */
  public previousContextFilter: any = {};

  /** @returns Context filters array */
  get contextFilters(): CompositeFilterDescriptor {
    return this.settings.contextFilters
      ? JSON.parse(this.settings.contextFilters)
      : {
          logic: 'and',
          filters: [],
        };
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
   * @param document document
   */
  constructor(
    private aggregationService: AggregationService,
    private translate: TranslateService,
    private contextService: ContextService,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  ngOnInit(): void {
    // Listen to dashboard filters changes if it is necessary
    if (this.contextService.filterRegex.test(this.settings.contextFilters)) {
      this.contextService.filter$
        .pipe(takeUntil(this.destroy$))
        .subscribe((contextFilter: any) => {
          if (
            this.contextService.filterInWidgetFilter(
              this.previousContextFilter,
              contextFilter,
              this.settings.contextFilters
            )
          ) {
            this.series.next([]);
            this.loadChart();
            this.getOptions();
          }
          this.previousContextFilter = contextFilter;
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

  /** Loads chart */
  private loadChart(): void {
    this.loading = true;
    if (this.settings.resource || this.settings.referenceData) {
      this.dataQuery = this.aggregationService.aggregationDataQuery({
        referenceData: this.settings.referenceData,
        resource: this.settings.resource,
        aggregation: this.aggregationId || '',
        mapping: get(this.settings, 'chart.mapping', null),
        contextFilters: joinFilters(this.contextFilters, this.selectedFilter),
        at: this.settings.at
          ? this.contextService.atArgumentValue(this.settings.at)
          : undefined,
      });
      if (this.dataQuery) {
        this.getData();
      } else {
        this.loading = false;
      }
    } else {
      this.loading = false;
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

  /** Load the data, using widget parameters. */
  private getData(): void {
    this.dataQuery
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ errors, data, loading }: any) => {
        if (errors) {
          this.loading = false;
          this.hasError = true;
          this.series.next([]);
        } else {
          this.hasError = false;
          const today = new Date();
          this.lastUpdate =
            ('0' + today.getHours()).slice(-2) +
            ':' +
            ('0' + today.getMinutes()).slice(-2);
          if (
            [
              'pie',
              'donut',
              'radar',
              'line',
              'bar',
              'column',
              'polar',
            ].includes(this.settings.chart.type)
          ) {
            const aggregationData = JSON.parse(
              JSON.stringify(
                this.settings.resource
                  ? data.recordsAggregation
                  : data.referenceDataAggregation
              )
            );
            // If series
            if (get(this.settings, 'chart.mapping.series', null)) {
              const groups = groupBy(aggregationData, 'series');
              const categories = uniq(
                aggregationData.map((x: any) => x.category)
              );
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
                      key ||
                      this.translate.instant('components.widget.chart.other'),
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
              this.settings.resource
                ? data.recordsAggregation
                : data.referenceData
            );
          }
          this.loading = loading;
        }
      });
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
