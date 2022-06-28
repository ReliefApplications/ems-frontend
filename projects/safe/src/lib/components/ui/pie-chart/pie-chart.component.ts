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
 * Uses kendo chart to render the data as a pie chart
 */
@Component({
  selector: 'safe-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
/**
 * Pie chart component, based on kendo chart component.
 */
export class SafePieChartComponent implements OnInit {
  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: ChartSeries[] = [];

  @ViewChild('chart')
  public chart?: ChartComponent;

  /**
   * Constructor for safe-pie-chart component
   */
  constructor() {}

  ngOnInit(): void {}
}
