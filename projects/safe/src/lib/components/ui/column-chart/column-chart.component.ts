import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, SeriesStack } from '@progress/kendo-angular-charts';
import get from 'lodash/get';

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
  name?: string;
  color?: string;
  data: {
    field: number | null;
    category: any;
  }[];
}

interface ChartLabels {
  showValue: boolean;
}

interface ChartOptions {
  palette: string[];
  axes?: {
    y?: {
      min?: number;
      max?: number;
    };
  };
  labels?: ChartLabels;
  stack: boolean | SeriesStack;
}

@Component({
  selector: 'safe-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss'],
})
export class SafeColumnChartComponent implements OnInit, OnChanges {
  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: ChartSeries[] = [];

  @Input() options: ChartOptions = {
    palette: [],
    stack: false,
  };

  @Input() gap = 2;

  @Input() spacing = 0.25;

  public min: number | undefined;

  public max: number | undefined;

  public stack: boolean | SeriesStack = false;

  @ViewChild('chart')
  public chart?: ChartComponent;

  public labels: any;

  constructor() {}

  ngOnInit(): void {
    this.min = get(this.options, 'axes.y.min');
    this.max = get(this.options, 'axes.y.max');
    this.labels = {
      visible: get(this.options, 'labels.showValue'),
    };
    this.stack = this.series.length > 1 ? get(this.options, 'stack') : false;
  }

  ngOnChanges(): void {
    this.min = get(this.options, 'axes.y.min');
    this.max = get(this.options, 'axes.y.max');
    this.labels = {
      visible: get(this.options, 'labels.showValue'),
    };
    this.stack = this.series.length > 1 ? get(this.options, 'stack') : false;
  }
}
