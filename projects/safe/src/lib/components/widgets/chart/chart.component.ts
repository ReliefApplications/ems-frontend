import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { saveAs } from '@progress/kendo-file-saver';
import { Subject, Subscription } from 'rxjs';
import { AggregationBuilderService } from '../../../services/aggregation-builder.service';
import { SafeLineChartComponent } from '../../ui/line-chart/line-chart.component';
import { SafePieChartComponent } from '../../ui/pie-chart/pie-chart.component';
import { SafeDonutChartComponent } from '../../ui/donut-chart/donut-chart.component';
import { SafeColumnChartComponent } from '../../ui/column-chart/column-chart.component';
import { SafeBarChartComponent } from '../../ui/bar-chart/bar-chart.component';
import { uniq, get, groupBy } from 'lodash';
import { CHART_DEFAULT_PALETTE } from '../chart-settings/charts/chart';
import { SafeAggregationService } from '../../../services/aggregation/aggregation.service';

/**
 * Default file name for chart exports
 */
const DEFAULT_FILE_NAME = 'chart';

/**
 * Chart widget component using KendoUI
 */
@Component({
  selector: 'safe-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class SafeChartComponent implements OnChanges, OnDestroy {
  // === DATA ===
  public loading = true;
  public series: any[] = [];
  public options: any = null;
  private dataQuery: any;
  private dataSubscription?: Subscription;

  public lastUpdate = '';
  public hasError = false;
  public legend: any[] = [];
  public legendEvent: Subject<any> = new Subject<any>();
  public flexDirection = 'column';

  // === WIDGET CONFIGURATION ===
  @Input() header = true;
  @Input() export = true;
  @Input() settings: any = null;

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

  // === CHART ===
  @ViewChild('chartWrapper')
  private chartWrapper?:
    | SafeLineChartComponent
    | SafePieChartComponent
    | SafeDonutChartComponent
    | SafeBarChartComponent
    | SafeColumnChartComponent;

  /**
   * Chart widget using KendoUI.
   *
   * @param aggregationService Shared aggregation service
   * @param aggregationBuilder Shared aggregation builder service
   */
  constructor(
    private aggregationService: SafeAggregationService,
    private aggregationBuilder: AggregationBuilderService
  ) {}

  /** Detect changes of the settings to reload the data and sets the direction of the chart depending on the legend. */
  ngOnChanges(): void {
    this.loading = true;
    if (this.settings.resource) {
      this.aggregationService
        .getAggregations(this.settings.resource, {
          ids: [get(this.settings, 'chart.aggregationId', null)],
          first: 1,
        })
        .then((res) => {
          const aggregation = res.edges[0]?.node || null;
          if (aggregation) {
            this.dataQuery = this.aggregationBuilder.buildAggregation(
              this.settings.resource,
              aggregation.id || '',
              get(this.settings, 'chart.mapping', null)
            );
            if (this.dataQuery) {
              this.getOptions();
              this.getData();
            } else {
              this.loading = false;
            }
          } else {
            this.loading = false;
          }
        })
        .catch(() => (this.loading = false));
    } else {
      this.loading = false;
    }
    switch (this.settings.chart.legend?.position) {
      case 'top':
        this.flexDirection = 'column-reverse';
        break;
      case 'bottom':
        this.flexDirection = 'column';
        break;
      case 'right':
        this.flexDirection = 'row';
        break;
      case 'left':
        this.flexDirection = 'row-reverse';
        break;
      default:
        break;
    }
  }

  /**
   * Exports the chart as a png ticket
   */
  public onExport(): void {
    this.chartWrapper?.chart
      ?.exportImage({
        width: 1200,
        height: 800,
      })
      .then((dataURI: string) => {
        saveAs(dataURI, this.fileName);
      });
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
        },
        y: {
          min: get(this.settings, 'chart.axes.y.enableMin')
            ? get(this.settings, 'chart.axes.y.min')
            : null,
          max: get(this.settings, 'chart.axes.y.enableMax')
            ? get(this.settings, 'chart.axes.y.max')
            : null,
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
    };
  }

  /** Load the data, using widget parameters. */
  private getData(): void {
    this.dataSubscription = this.dataQuery.subscribe((res: any) => {
      if (res.errors) {
        this.loading = false;
        this.hasError = true;
        this.series = [];
      } else {
        this.hasError = false;
        const today = new Date();
        this.lastUpdate =
          ('0' + today.getHours()).slice(-2) +
          ':' +
          ('0' + today.getMinutes()).slice(-2);
        if (
          ['pie', 'donut', 'line', 'bar', 'column'].includes(
            this.settings.chart.type
          )
        ) {
          const aggregationData = JSON.parse(
            JSON.stringify(res.data.recordsAggregation)
          );
          if (get(this.settings, 'chart.mapping.series', null)) {
            const groups = groupBy(aggregationData, 'series');
            const categories = uniq(
              aggregationData.map((x: any) => x.category)
            );
            this.series = Object.keys(groups).map((key) => {
              const rawData = groups[key];
              const data = Array.from(
                categories,
                (category) =>
                  rawData.find((x) => x.category === category) || {
                    category,
                    field: null,
                  }
              );
              return {
                name: key,
                data,
              };
            });
          } else {
            this.series = [
              {
                data: aggregationData,
              },
            ];
          }
        } else {
          this.series = res.data.recordsAggregation;
        }
        this.loading = res.loading;
        this.legend = [];
        if (
          this.settings.chart.type === 'donut' ||
          this.settings.chart.type === 'pie'
        ) {
          this.series[0].data.map((value: any, index: number) => {
            const palette = this.settings.chart.palette.enabled
              ? this.settings.chart.palette.value
              : CHART_DEFAULT_PALETTE;
            const color = palette[index % palette.length];
            this.legend.push({
              value: value.category,
              id: value.id,
              active: true,
              color,
            });
          });
        } else if (this.settings.chart.aggregation.mapping.series) {
          this.series.map((value: any, index: number) => {
            const palette = this.settings.chart.palette.enabled
              ? this.settings.chart.palette.value
              : CHART_DEFAULT_PALETTE;
            const color = palette[index % palette.length];
            this.legend.push({
              value: value.name,
              active: true,
              color,
            });
          });
        }
        this.dataSubscription?.unsubscribe();
      }
    });
  }

  /**
   * Emits an event that will hide/show the item/serie when clicked in the legend
   *
   * @param item Item to hide.
   * @param index Index of the item in the data.
   */
  public toggleSeries(item: any, index: number): void {
    console.log(index);
    this.legendEvent.next({
      event: 'toggleSeries',
      item,
      index,
    });
  }

  /**
   * Emits an event that will toggle the highlight for the hovered item in the legend
   *
   * @param value Boolean to show/hide the highlight.
   * @param id Id identifying the item, or a name in the case of a serie.
   */
  public toggleSeriesHighlight(value: boolean, id: any): void {
    this.legendEvent.next({
      event: 'toggleSeriesHighlight',
      value,
      id,
    });
  }

  /** Remove subscriptions */
  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
