import { Component, Input, OnInit } from '@angular/core';

interface ChartLegend {
  visible?: boolean;
  orientation?: string;
  position?: string;
}

interface ChartSeries {
  color?: string;
  data: {
    category: any;
    field: any;
    color?: string;
  }[];
}

@Component({
  selector: 'safe-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class SafeLineChartComponent implements OnInit {

  @Input() legend: ChartLegend | undefined;

  @Input() series: ChartSeries[] = [];

  public categoryAxis: any = {
    type: 'date',
    maxDivisions: 10
  };

  constructor() { }

  ngOnInit(): void {
  }

}
