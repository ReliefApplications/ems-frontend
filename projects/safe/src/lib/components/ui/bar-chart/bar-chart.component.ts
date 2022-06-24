import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from '@progress/kendo-angular-charts';

/**
 * Interface of chart title.
 */
interface ChartTitle {
  visible: boolean;
  text: string;
  position: 'top' | 'bottom';
}

/**
 * Interface of chart legend.
 */
interface ChartLegend {
  visible: boolean;
  orientation: 'horizontal' | 'vertical';
  position: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Interface of chart series.
 */
interface ChartSeries {
  name?: string;
  color?: string;
  data: {
    field: number | null;
    category: any;
  }[];
}

/**
 * Bar chart component, based on kendo chart component.
 */
@Component({
  selector: 'safe-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class SafeBarChartComponent implements OnInit {
  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: ChartSeries[] = [];

  @Input() gap = 2;

  @Input() spacing = 0.25;

  @ViewChild('chart')
  public chart?: ChartComponent;

  /**
   * Bar chart component, based on kendo chart component.
   */
  constructor() {}

  ngOnInit(): void {}
}
