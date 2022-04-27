import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CategoryAxis, ChartComponent } from '@progress/kendo-angular-charts';

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

interface ChartPalette {
  use: boolean;
  palette: string[];
}

@Component({
  selector: 'safe-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class SafeLineChartComponent implements OnInit {
  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: ChartSeries[] = [];

  @Input() palette: ChartPalette | undefined;

  @ViewChild('chart')
  public chart?: ChartComponent;

  public categoryAxis: CategoryAxis = {
    type: 'date',
    maxDivisions: 10,
  };

  constructor() {}

  ngOnInit(): void {}
}
