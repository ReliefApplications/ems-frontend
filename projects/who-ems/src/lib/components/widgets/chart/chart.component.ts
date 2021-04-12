import { Component, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { saveAs } from '@progress/kendo-file-saver';
import { ChartComponent } from '@progress/kendo-angular-charts';
import { Subscription } from 'rxjs';
import { AggregationBuilderService } from '../../../services/aggregation-builder.service';

const DEFAULT_FILE_NAME = 'chart.png';

@Component({
  selector: 'who-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
/*  Chart widget using KendoUI.
*/
export class WhoChartComponent implements OnChanges, OnDestroy {

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
  @ViewChild('chart')
  private chart?: ChartComponent;

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
    this.chart?.exportImage({
      width: 1200,
      height: 800
    }).then((dataURI) => {
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
            data: res.data.recordsAggregation
          }
        ];
      } else {
        this.series = res.data.recordsAggregation;
      }
      this.loading = res.loading;
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
