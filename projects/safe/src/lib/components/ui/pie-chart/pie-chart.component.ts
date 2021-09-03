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
  selector: 'safe-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class SafePieChartComponent implements OnInit {

  @Input() legend: ChartLegend | undefined;

  @Input() series: ChartSeries[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
