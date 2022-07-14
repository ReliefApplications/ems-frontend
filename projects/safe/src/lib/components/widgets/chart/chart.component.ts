import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { saveAs } from '@progress/kendo-file-saver';
import { Subscription } from 'rxjs';
import { AggregationBuilderService } from '../../../services/aggregation-builder.service';
import { SafeLineChartComponent } from '../../ui/line-chart/line-chart.component';
import { SafePieChartComponent } from '../../ui/pie-chart/pie-chart.component';
import { SafeDonutChartComponent } from '../../ui/donut-chart/donut-chart.component';
import { SafeColumnChartComponent } from '../../ui/column-chart/column-chart.component';
import { SafeBarChartComponent } from '../../ui/bar-chart/bar-chart.component';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';

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
   * @param aggregationBuilder Share aggregation builder service
   */
  constructor(private aggregationBuilder: AggregationBuilderService) {}

  /** Detect changes of the settings to reload the data. */
  ngOnChanges(): void {
    this.loading = true;
    this.dataQuery = this.aggregationBuilder.buildAggregation(
      this.settings.chart.aggregation
    );
    if (this.dataQuery) {
      this.getOptions();
      this.getData();
    } else {
      this.loading = false;
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
          if (get(this.settings, 'chart.aggregation.mapping.series', null)) {
            const groups: any = {}; //groupBy(aggregationData, 'series');
            const mockGroups: any[] = [];
            aggregationData.map((data: any) => {
              if (!groups[data.series]) {
                groups[data.series] = [];
              }
              groups[data.series].push(data);
              if (
                !mockGroups.find((group) => group.category === data.category)
              ) {
                mockGroups.push({ category: data.category });
              }
            });

            this.series = [];
            Object.keys(groups).map((key) => {
              const data: any[] = groups[key];
              let currentIndex = -1;
              mockGroups.map((group: any) => {
                const i = data.findIndex(
                  (dataGroup) => dataGroup.category === group.category
                );
                if (i === -1) {
                  data.splice(++currentIndex, 0, group);
                } else {
                  currentIndex = i;
                }
              });
              this.series.push({
                name: key,
                data,
              });
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
        this.dataSubscription?.unsubscribe();
      }
    });
  }

  /** Remove subscriptions */
  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
