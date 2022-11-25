import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import get from 'lodash/get';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
// import DataLabelsPlugin from 'chartjs-plugin-datalabels';

/**
 * Interface of chart title.
 */
interface ChartTitle {
  visible: boolean;
  text: string;
  position: 'top' | 'bottom';
  font: string;
  color: string;
}

/**
 * Interface of chart legend.
 */
interface ChartLegend {
  visible: boolean;
  orientation: 'horizontal' | 'vertical';
  position: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Interface of chart series.
 */
// interface ChartSeries {
//   name?: string;
//   color?: string;
//   data: {
//     field: number | null;
//     category: any;
//   }[];
// }

/** Interface of chart labels */
// interface ChartLabels {
//   showValue: boolean;
//   valueType: string;
// }

/** Interface of chart options */
// interface ChartOptions {
//   palette: string[];
//   axes?: {
//     x?: {
//       min?: number;
//       max?: number;
//     };
//   };
//   labels?: ChartLabels;
//   stack: boolean | SeriesStack;
// }

/**
 * Bar chart component, based on kendo chart component.
 */
@Component({
  selector: 'safe-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class SafeBarChartComponent implements OnInit, OnChanges {
  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: any[] = [];

  @Input() options: any = {
    palette: [],
    stack: false,
  };

  @Input() gap = 2;

  @Input() spacing = 0.25;

  // public min: number | undefined;

  // public max: number | undefined;

  // public stack: boolean | SeriesStack = false;

  // @ViewChild('chart')
  // public chart?: ChartComponent;

  // /**
  //  * Bar chart component, based on kendo chart component.
  //  */
  // constructor() {}

  // /**
  //  * The function which returns the Chart series label content.
  //  * Content is defined on the component init.
  //  *
  //  * @param e - Event which with the specific label data
  //  * @returns Returns a string which will be used as the label content
  //  */
  // public labelContent: ((e: any) => string) | null = null;

  // ngOnInit(): void {
  //   this.min = get(this.options, 'axes.x.min');
  //   this.max = get(this.options, 'axes.x.max');
  //   this.stack = this.series.length > 1 ? get(this.options, 'stack') : false;
  //   this.setLabelContent();
  // }

  // ngOnChanges(): void {
  //   this.min = get(this.options, 'axes.x.min');
  //   this.max = get(this.options, 'axes.x.max');
  //   this.stack = this.series.length > 1 ? get(this.options, 'stack') : false;
  //   this.setLabelContent();
  // }

  // /**
  //  * Set label content method.
  //  */
  // private setLabelContent(): void {
  //   const showCategory = get(this.options, 'labels.showCategory', false);
  //   const showValue = get(this.options, 'labels.showValue', false);
  //   const valueType = get(this.options, 'labels.valueType', 'value');
  //   if (showCategory) {
  //     if (showValue) {
  //       switch (valueType) {
  //         case 'percentage': {
  //           this.labelContent = (e: any): string =>
  //             e.category && e.percentage
  //               ? `${e.category}
  //               ${(parseFloat(e.percentage) * 100).toFixed(2)}%`
  //               : '';
  //           break;
  //         }
  //         default: {
  //           this.labelContent = (e: any): string =>
  //             e.category && e.value ? e.category + '\n' + e.value : '';
  //           break;
  //         }
  //       }
  //     } else {
  //       this.labelContent = (e: any): string => e.category || '';
  //     }
  //   } else {
  //     if (showValue) {
  //       switch (valueType) {
  //         case 'percentage': {
  //           this.labelContent = (e: any): string =>
  //             e.percentage
  //               ? (parseFloat(e.percentage) * 100).toFixed(2) + '%'
  //               : '';
  //           break;
  //         }
  //         default: {
  //           this.labelContent = (e: any): string => e.value || '';
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
    scales: {
      x: {},
      y: {},
    },
    parsing: {
      yAxisKey: 'category',
      xAxisKey: 'field',
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
  public chartType: ChartType = 'bar';
  // public chartPlugins = [DataLabelsPlugin];

  public chartData: ChartData<'bar'> = {
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
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      // We use these empty structures as placeholders for dynamic theming.
      scales: {
        x: {},
        y: {},
      },
      parsing: {
        yAxisKey: 'category',
        xAxisKey: 'field',
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
        }
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
