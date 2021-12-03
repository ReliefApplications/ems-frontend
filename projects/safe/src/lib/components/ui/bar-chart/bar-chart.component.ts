import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from '@progress/kendo-angular-charts';

interface ChartTitle {
  visible: boolean;
  text: string;
  position: 'top' | 'bottom';
}

interface ChartLegend {
  title?: {
    text: string,
    font?: string,
    align?: 'center' | 'left' | 'right'
  };
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

@Component({
  selector: 'safe-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class SafeBarChartComponent implements OnInit {

  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: ChartSeries[] = [];

  @Input() gap = 2;

  @Input() spacing = 0.25;

  @ViewChild('chart')
  public chart?: ChartComponent;

  constructor() { }

  ngOnInit(): void {
  }

}
