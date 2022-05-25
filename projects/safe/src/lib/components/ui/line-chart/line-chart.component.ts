import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { CategoryAxis, ChartComponent } from '@progress/kendo-angular-charts';
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
  color?: string;
  data: {
    category: any;
    field: any;
    color?: string;
  }[];
}

interface ChartOptions {
  palette: string[];
  axes: any;
}

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

  constructor() {}

  ngOnInit(): void {
    this.min = get(this.options, 'axes.x.min');
    this.max = get(this.options, 'axes.x.max');
  }

  ngOnChanges(): void {
    this.min = get(this.options, 'axes.x.min');
    this.max = get(this.options, 'axes.x.max');
  }
}
