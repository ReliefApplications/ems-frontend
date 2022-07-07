import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { CategoryAxis, ChartComponent } from '@progress/kendo-angular-charts';
import get from 'lodash/get';

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
  color?: string;
  data: {
    category: any;
    field: any;
    color?: string;
  }[];
}

/**
 *
 */
interface ChartLabels {
  showValue: boolean;
}

/**
 *
 */
interface ChartOptions {
  palette: string[];
  axes: any;
  labels?: ChartLabels;
}

/**
 * Uses kendo chart to render the data as a line chart
 */
@Component({
  selector: 'safe-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class SafeLineChartComponent implements OnInit, OnChanges {
  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: ChartSeries[] = [];

  @Input() options: ChartOptions = {
    palette: [],
    axes: null,
  };

  public min: number | undefined;

  public max: number | undefined;

  @ViewChild('chart')
  public chart?: ChartComponent;

  public categoryAxis: CategoryAxis = {
    type: 'date',
    maxDivisions: 10,
  };

  public labels: any;

  /**
   * Constructor for safe-line-chart component
   */
  constructor() {}

  ngOnInit(): void {
    this.min = get(this.options, 'axes.x.min');
    this.max = get(this.options, 'axes.x.max');
    this.labels = {
      visible: get(this.options, 'labels.showValue'),
    };
  }

  ngOnChanges(): void {
    this.min = get(this.options, 'axes.x.min');
    this.max = get(this.options, 'axes.x.max');
    this.labels = {
      visible: get(this.options, 'labels.showValue'),
    };
  }
}
