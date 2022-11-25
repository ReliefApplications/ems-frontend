import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import get from 'lodash/get';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

/**
 * Interface containing the settings of the chart title
 */
interface ChartTitle {
  visible: boolean;
  text: string;
  position: 'top' | 'bottom';
  font: string;
  color: string;
}

/**
 * Interface containing the settings of the chart legend
 */
interface ChartLegend {
  visible: boolean;
  orientation: 'horizontal' | 'vertical';
  position: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Interface containing the settings of the chart series
 */
// interface ChartSeries {
//   name?: string;
//   color?: string;
//   data: {
//     category: any;
//     field: any;
//     color?: string;
//   }[];
// }

// /** Interface of chart labels */
// interface ChartLabels {
//   showValue: boolean;
// }

// /** Interface of chart options */
// interface ChartOptions {
//   palette: string[];
//   axes: any;
//   labels?: ChartLabels;
// }

/**
 * Uses kendo chart to render the data as a line chart
 */
@Component({
  selector: 'safe-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class SafeLineChartComponent implements OnInit, OnChanges {
  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: any[] = [];

  @Input() options: any = {
    palette: [],
    axes: null,
  };

  // public min: number | undefined;

  // public max: number | undefined;

  // @ViewChild('chart')
  // public chart?: ChartComponent;

  // public labels: any;

  /**
   * Constructor for safe-line-chart component
   */
  // constructor() {}

  // ngOnInit(): void {
  //   this.min = get(this.options, 'axes.x.min');
  //   this.max = get(this.options, 'axes.x.max');
  //   this.labels = {
  //     visible: get(this.options, 'labels.showValue'),
  //   };
  // }

  // ngOnChanges(): void {
  //   this.min = get(this.options, 'axes.x.min');
  //   this.max = get(this.options, 'axes.x.max');
  //   this.labels = {
  //     visible: get(this.options, 'labels.showValue'),
  //   };
  // }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {},
    },
    parsing: {
      xAxisKey: 'category',
      yAxisKey: 'field',
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          borderRadius: 4,
          useBorderRadius: true,
        },
      },
      // datalabels: {
      //   anchor: 'end',
      //   align: 'end',
      // },
    },
  };
  public chartType: ChartType = 'line';
  // public barChartPlugins = [DataLabelsPlugin];

  public chartData: ChartData<'line'> = {
    // labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      // {
      //   data: [65, 59, 80, 81, 56, 55, 40],
      //   label: 'Series A',
      //   borderRadius: 4,
      // },
      // {
      //   data: [28, 48, 40, 19, 86, 27, 90],
      //   label: 'Series B',
      //   borderRadius: 4,
      // },
    ],
  };

  ngOnInit(): void {
    this.chartData.datasets = this.series.map((x) => ({
      ...x,
      borderRadius: 8,
    }));
    this.setOptions();
    this.chart?.update();
  }

  ngOnChanges(): void {
    this.chartData.datasets = this.series.map((x) => ({
      ...x,
      borderRadius: 8,
    }));
    this.setOptions();
    this.chart?.update();
  }

  setOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      // We use these empty structures as placeholders for dynamic theming.
      scales: {
        x: {},
        y: {},
      },
      parsing: {
        xAxisKey: 'category',
        yAxisKey: 'field',
      },
      plugins: {
        legend: {
          display: get(this.legend, 'visible', false),
          labels: {
            borderRadius: 4,
            useBorderRadius: true,
          },
          position: get(this.legend, 'position', 'bottom'),
        },
        title: {
          display: get(this.title, 'visible', false),
          text: get(this.title, 'text', ''),
          position: get(this.title, 'position', 'top'),
          color: get(this.title, 'color', undefined),
        },
        // datalabels: {
        //   anchor: 'end',
        //   align: 'end',
        // },
      },
    };
  }

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: any[];
  }): void {
    // console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: any[];
  }): void {
    // console.log(event, active);
  }

  exportImage(): void {
    const downloadLink = document.createElement('a');
    downloadLink.href = this.chart?.toBase64Image() as string;
    downloadLink.download = 'test';
    downloadLink.click();
  }
}
