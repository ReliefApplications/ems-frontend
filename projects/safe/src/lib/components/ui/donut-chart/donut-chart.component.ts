import { Component, Input, OnInit } from '@angular/core';

interface ChartLegend {
  visible?: boolean;
  orientation?: string;
  position?: string;
}

interface ChartSeries {
  data: {
    category: any;
    field: any;
    color?: string;
  }[];
}

@Component({
  selector: 'safe-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class SafeDonutChartComponent implements OnInit {

  @Input() legend: ChartLegend | undefined;

  @Input() series: ChartSeries[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
