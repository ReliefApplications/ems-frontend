import { Component, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { saveAs } from '@progress/kendo-file-saver';
import { ChartComponent } from '@progress/kendo-angular-charts';
import { Subscription } from 'rxjs';
import { AggregationBuilderService } from '../../../services/aggregation-builder.service';
import { SafeLineChartComponent } from '../../ui/line-chart/line-chart.component';
import { SafePieChartComponent } from '../../ui/pie-chart/pie-chart.component';
import { SafeDonutChartComponent } from '../../ui/donut-chart/donut-chart.component';

const DEFAULT_FILE_NAME = 'chart.png';

@Component({
  selector: 'safe-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
/*  Chart widget using KendoUI.
*/
export class SafeChartComponent implements OnChanges, OnDestroy {

  // === DATA ===
  public loading = true;
  public series: any[] = [];
  private dataQuery: any;
  private dataSubscription?: Subscription;

  // === WIDGET CONFIGURATION ===
  @Input() header = true;
  @Input() export = true;
  @Input() settings: any = null;

  // === CHART ===
  @ViewChild('chartWrapper')
  private chartWrapper?: SafeLineChartComponent | SafePieChartComponent | SafeDonutChartComponent;

  public categoryAxis: any = {
    type: 'date',
    maxDivisions: 10
  };

  constructor(
    private aggregationBuilder: AggregationBuilderService
  ) { }

  /*  Detect changes of the settings to reload the data.
  */
  ngOnChanges(): void {
    this.loading = false;
    this.dataQuery = this.aggregationBuilder.buildAggregation(this.settings.chart.pipeline);
    if (this.dataQuery) {
      this.getData();
    } else {
      this.loading = false;
    }
  }

  public onExport(): void {
    this.chartWrapper?.chart?.exportImage({
      width: 1200,
      height: 800
    }).then((dataURI: string) => {
      saveAs(dataURI, this.settings.name ? `${this.settings.name}.png` : DEFAULT_FILE_NAME);
    });
  }

  /*  Load the data, using widget parameters.
  */
  private getData(): void {
    this.dataSubscription = this.dataQuery.valueChanges.subscribe((res: any) => {
      if (['pie', 'donut', 'line'].includes(this.settings.chart.type)) {
        this.series = [
          {
            data: JSON.parse(JSON.stringify(res.data.recordsAggregation))
          }
        ];
      } else {
        this.series = res.data.recordsAggregation;
      }
      this.loading = res.loading;
      this.dataSubscription?.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
