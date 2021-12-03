import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, LegendLabelsContentArgs } from '@progress/kendo-angular-charts';

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
  visible?: boolean;
  orientation?: 'horizontal' | 'vertical';
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface ChartSeries {
  data: {
    category: any;
    field: any;
    color?: string;
  }[];
}

interface ChartLabels {
  visible: boolean;
}

@Component({
  selector: 'safe-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class SafePieChartComponent implements OnInit {

  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: ChartSeries[] = [];

  @Input() labels: ChartLabels | undefined;
  public chartLabels!: any;

  @ViewChild('chart')
  public chart?: ChartComponent;

  constructor() {}

  ngOnInit(): void {
    this.chartLabels = {
      visible: this.labels?.visible || false,
      content: this.labelContent.bind(this)
    };
  }

  public labelContent(args: LegendLabelsContentArgs): string {
    return `${args.dataItem.category}\n${args.dataItem.field}`;
  }
}
