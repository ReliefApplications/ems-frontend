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
  selector: 'safe-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
})
export class SafeDonutChartComponent implements OnInit {
  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: ChartSeries[] = [];

  @Input() labels: ChartLabels | undefined;

  @Input() options: ChartOptions = {
    palette: [],
  };

  @ViewChild('chart')
  public chart?: ChartComponent;

  public labelContent: ((e: any) => string) | null = null;

  constructor() {}

  ngOnInit(): void {
    if (this.labels) {
      if (this.labels.showCategory && this.labels.showValue) {
        if (this.labels.valueType === 'value') {
          this.labelContent = (e: any): string => {return e.category + '\n' + e.value};
        } else if (this.labels.valueType === 'percentage') {
          this.labelContent = (e: any): string => {return e.category + '\n' + (parseFloat(e.percentage) * 100).toFixed(2) + '%'};
        }
      } else if (this.labels.showCategory) {
        this.labelContent = (e: any): string => {return e.category};
      } else if (this.labels.showValue) {
        if (this.labels.valueType === 'value') {
          this.labelContent = (e: any): string => {return e.value};
        } else if (this.labels.valueType === 'percentage') {
          this.labelContent = (e: any): string => {return (parseFloat(e.percentage) * 100).toFixed(2) + '%'};
        }
      }
    }
  }
}
