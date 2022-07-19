import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from '@progress/kendo-angular-charts';

/** Interface for the chart title */
interface ChartTitle {
  visible: boolean;
  text: string;
  position: 'top' | 'bottom';
}

/** Interface for the chart legend */
interface ChartLegend {
  visible: boolean;
  orientation: 'horizontal' | 'vertical';
  position: 'top' | 'bottom' | 'left' | 'right';
}

/** Interface for the chart series */
interface ChartSeries {
  data: {
    category: any;
    field: any;
    color?: string;
  }[];
}

/**
 * Component for donut charts
 * Uses kendo chart to render the data as a donut chart
 */
@Component({
  selector: 'safe-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
})
export class SafeDonutChartComponent implements OnInit {
  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: ChartSeries[] = [];

  @ViewChild('chart')
  public chart?: ChartComponent;

  /**
   * Component for donut charts.
   */
  constructor() {}

  ngOnInit(): void {}
}
