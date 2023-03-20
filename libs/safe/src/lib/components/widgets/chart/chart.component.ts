import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { SafeLineChartComponent } from '../../ui/charts/line-chart/line-chart.component';
import { SafePieDonutChartComponent } from '../../ui/charts/pie-donut-chart/pie-donut-chart.component';
import { SafeBarChartComponent } from '../../ui/charts/bar-chart/bar-chart.component';
import { uniq, get, groupBy } from 'lodash';
import { SafeAggregationService } from '../../../services/aggregation/aggregation.service';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

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
export class SafeChartComponent
  extends SafeUnsubscribeComponent
  implements OnChanges
{
  // === DATA ===
  public loading = true;
  public series: any[] = [];
  public options: any = null;
  private dataQuery: any;

  public lastUpdate = '';
  public hasError = false;

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
    | SafePieDonutChartComponent
    | SafeBarChartComponent;

  /**
   * Chart widget using KendoUI.
   *
   * @param aggregationService Shared aggregation service
   */
  constructor(private aggregationService: SafeAggregationService) {
    super();
  }

  /** Detect changes of the settings to reload the data. */
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
            this.dataQuery = this.aggregationService.aggregationDataQuery(
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
  }

  /**
   * Exports the chart as a png ticket
   */
  public onExport(): void {
    // {
    //   width: 1200,
    //   height: 800,
    // }
    // this.chartWrapper?.exportImage();
    // .then((dataURI: string) => {
    //   saveAs(dataURI, this.fileName);
    // });
    const downloadLink = document.createElement('a');
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
          this.series = [];
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
              JSON.stringify(data.recordsAggregation)
            );
            if (get(this.settings, 'chart.mapping.series', null)) {
              const groups = groupBy(aggregationData, 'series');
              const categories = uniq(
                aggregationData.map((x: any) => x.category)
              );
              this.series = Object.keys(groups).map((key) => {
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
                  label: key,
                  name: key,
                  data: returnData,
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
            this.series = data.recordsAggregation;
          }
          this.loading = loading;
        }
      });
  }
}
