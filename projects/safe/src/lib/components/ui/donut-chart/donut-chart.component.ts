import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from '@progress/kendo-angular-charts';

/**
 * Interface containing the settings of the chart title
 */
interface ChartTitle {
  visible: boolean;
  text: string;
  position: 'top' | 'bottom';
}

/**
 * Interface containing the settings of the chart legend
 */
interface ChartLegend {
  visible: boolean;
  orientation: 'horizontal' | 'vertical';
  position: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Interface containing the settings of the chart series
 */
interface ChartSeries {
  data: {
    category: any;
    field: any;
    color?: string;
  }[];
}

/**
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
   * Constructor for safe-donut-chart component
   */
  constructor() {}

  ngOnInit(): void {}
}
