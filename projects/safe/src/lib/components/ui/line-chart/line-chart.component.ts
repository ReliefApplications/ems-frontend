import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CategoryAxis, ChartComponent } from '@progress/kendo-angular-charts';

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
@Component({
  selector: 'safe-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class SafeLineChartComponent implements OnInit {
  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: ChartSeries[] = [];

  @ViewChild('chart')
  public chart?: ChartComponent;

  public categoryAxis: CategoryAxis = {
    type: 'date',
    maxDivisions: 10,
  };

  /**
   * Constructor for safe-line-chart component
   */
  constructor() {}

  ngOnInit(): void {}
}
