import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { get, flatten } from 'lodash';

/** Interface for the chart title */
interface ChartTitle {
  visible: boolean;
  text: string;
  position: 'top' | 'bottom';
  font: string;
  color: string;
}

/** Interface for the chart legend */
interface ChartLegend {
  visible: boolean;
  orientation: 'horizontal' | 'vertical';
  position: 'top' | 'bottom' | 'left' | 'right';
}

/** Interface for the chart series */
// interface ChartSeries {
//   data: {
//     category: any;
//     field: any;
//     color?: string;
//   }[];
// }

/** Interface for chart labels */
// interface ChartLabels {
//   showCategory: boolean;
//   showValue: boolean;
//   valueType: string;
// }

// /** Interface for chart options */
// interface ChartOptions {
//   palette: string[];
//   labels?: ChartLabels;
// }

/**
 * Component for donut charts
 * Uses kendo chart to render the data as a donut chart
 */
@Component({
  selector: 'safe-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
})
export class SafeDonutChartComponent implements OnInit, OnChanges {
  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: any[] = [];

  @Input() options: any = {
    palette: [],
  };

  // @ViewChild('chart')
  // public chart?: ChartComponent;

  /**
   * The function which returns the Chart series label content.
   * Content is defined on the component init.
   *
   * @param e - Event which with the specific label data
   * @returns Returns a string which will be used as the label content
   */
  // public labelContent: ((e: any) => string) | null = null;

  /**
   * Component for donut charts.
   */
  // constructor() {}

  // ngOnInit(): void {
  //   this.setLabelContent();
  // }

  // ngOnChanges(): void {
  //   this.setLabelContent();
  // }

  /**
   * Set label content method.
   */
  // private setLabelContent(): void {
  //   const showCategory = get(this.options, 'labels.showCategory', false);
  //   const showValue = get(this.options, 'labels.showValue', false);
  //   const valueType = get(this.options, 'labels.valueType', 'value');

  //   if (showCategory) {
  //     if (showValue) {
  //       switch (valueType) {
  //         case 'percentage': {
  //           this.labelContent = (e: any): string =>
  //             e.category +
  //             '\n' +
  //             (parseFloat(e.percentage) * 100).toFixed(2) +
  //             '%';
  //           break;
  //         }
  //         default: {
  //           this.labelContent = (e: any): string => e.category + '\n' + e.value;
  //           break;
  //         }
  //       }
  //     } else {
  //       this.labelContent = (e: any): string => e.category;
  //     }
  //   } else {
  //     if (showValue) {
  //       switch (valueType) {
  //         case 'percentage': {
  //           this.labelContent = (e: any): string =>
  //             (parseFloat(e.percentage) * 100).toFixed(2) + '%';
  //           break;
  //         }
  //         default: {
  //           this.labelContent = (e: any): string => e.value;
  //           break;
  //         }
  //       }
  //     }
  //   }
  // }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    // scales: {
    //   x: {},
    //   y: {},
    // },
    parsing: {
      // xAxisKey: 'category',
      key: 'field',
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
  public chartType: ChartType = 'doughnut';
  // public barChartPlugins = [DataLabelsPlugin];

  public chartData: ChartData<'doughnut'> = {
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
      // borderRadius: 8,
    }));
    this.chartData.labels = flatten(
      this.series.map((x) => x.data.map((y: any) => y.category))
    );
    this.setOptions();
    this.chart?.update();
  }

  ngOnChanges(): void {
    this.chartData.datasets = this.series.map((x) => ({
      ...x,
      // borderRadius: 8,
    }));
    this.chartData.labels = flatten(
      this.series.map((x) => x.data.map((y: any) => y.category))
    );
    this.setOptions();
    this.chart?.update();
  }

  setOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      // We use these empty structures as placeholders for dynamic theming.
      // scales: {
      //   x: {},
      //   y: {},
      // },
      parsing: {
        // xAxisKey: 'category',
        key: 'field',
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
          text: get(this.title, 'text', undefined),
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
    this.chart?.toBase64Image();
  }
}
