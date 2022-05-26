import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from '@progress/kendo-angular-charts';

interface ChartTitle {
  visible: boolean;
  text: string;
  position: 'top' | 'bottom';
}

interface ChartLegend {
  visible: boolean;
  orientation: 'horizontal' | 'vertical';
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface ChartSeries {
  data: {
    category: any;
    field: any;
    color?: string;
  }[];
}

interface ChartLabels {
  showCategory: boolean;
  showValue: boolean;
  valueType: string;
}

interface ChartOptions {
  palette: string[];
}

@Component({
  selector: 'safe-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class SafePieChartComponent implements OnInit {
  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: ChartSeries[] = [];

  @Input() labels: ChartLabels | undefined;

  @Input() options: ChartOptions = {
    palette: [],
  };

  @ViewChild('chart')
  public chart?: ChartComponent;

  /**
   * The function which returns the Chart series label content.
   * Content is defined on the component init.
   *
   * @param e - Event which with the specific label data
   * @return Returns a string which will be used as the label content
   */
  public labelContent: ((e: any) => string) | null = null;

  constructor() {}

  ngOnInit(): void {
    if (this.labels) {
      if (this.labels.showCategory && this.labels.showValue) {
        if (this.labels.valueType === 'value') {
          this.labelContent = (e: any): string => e.category + '\n' + e.value;
        } else if (this.labels.valueType === 'percentage') {
          this.labelContent = (e: any): string =>
            e.category +
            '\n' +
            (parseFloat(e.percentage) * 100).toFixed(2) +
            '%';
        }
      } else if (this.labels.showCategory) {
        this.labelContent = (e: any): string => e.category;
      } else if (this.labels.showValue) {
        if (this.labels.valueType === 'value') {
          this.labelContent = (e: any): string => e.value;
        } else if (this.labels.valueType === 'percentage') {
          this.labelContent = (e: any): string =>
            (parseFloat(e.percentage) * 100).toFixed(2) + '%';
        }
      }
    }
  }
}
