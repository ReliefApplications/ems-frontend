import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from '@progress/kendo-angular-charts';
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
  value?: string;
  color?: string;
  items: {
    value: number | null;
    category: any;
  }[];
}

interface ChartOptions {
  palette: string[];
  axes?: {
    x?: {
      min?: number;
      max?: number;
    };
  };
}

@Component({
  selector: 'safe-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class SafeBarChartComponent implements OnInit, OnChanges {
  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: ChartSeries[] = [];

  @Input() options: ChartOptions = {
    palette: [],
  };

  @Input() gap = 2;

  @Input() spacing = 0.25;

  public min: number | undefined;

  public max: number | undefined;

  @ViewChild('chart')
  public chart?: ChartComponent;

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
