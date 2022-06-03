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

const DEFAULT_FILE_NAME = 'chartS';

/**
 * Chart widget using KendoUI.
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

  /** Builds filename from the date and widget title */
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

  constructor(private aggregationBuilder: AggregationBuilderService) {}

  /*  Detect changes of the settings to reload the data.
   */
  ngOnChanges(changes: SimpleChanges): void {
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
    };
  }

  /*  Load the data, using widget parameters.
   */
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
          this.series = [
            {
              data: JSON.parse(JSON.stringify(res.data.recordsAggregation)),
            },
          ];
        } else {
          this.series = res.data.recordsAggregation;
        }
        this.loading = res.loading;
        this.dataSubscription?.unsubscribe();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
