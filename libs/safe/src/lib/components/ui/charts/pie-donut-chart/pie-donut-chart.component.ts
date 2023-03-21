import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Plugin, ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { get, flatten } from 'lodash';
import { parseFontOptions } from '../../../../utils/graphs/parseFontString';
import drawUnderlinePlugin from '../../../../utils/graphs/plugins/underline.plugin';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { addTransparency } from '../../../../utils/graphs/addTransparency';
import whiteBackgroundPlugin from '../../../../utils/graphs/plugins/background.plugin';
import outsideLabelsPlugin from '../../../../utils/graphs/plugins/outsideLabels.plugin';
import { ChartTitle } from '../interfaces';

/**
 * Interface containing the settings of the chart legend
 */
interface ChartLegend {
  visible: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Uses chart.js to render the data as a pie chart
 */
@Component({
  selector: 'safe-pie-donut-chart',
  templateUrl: './pie-donut-chart.component.html',
  styleUrls: ['./pie-donut-chart.component.scss'],
})
/**
 * Pie/Doughnut/polarArea/Radar chart component, based on chart.js component.
 */
export class SafePieDonutChartComponent implements OnChanges {
  private fieldSum = 0;
  private showValueLabels: false | 'percentage' | 'value' = false;
  private showCategoryLabel = false;
  private categoryPositionLabel: false | 'inside' | 'outside' = false;
  public plugins: Plugin[] = [
    drawUnderlinePlugin,
    DataLabelsPlugin,
    whiteBackgroundPlugin,
    outsideLabelsPlugin,
  ];
  @Input() chartType: 'pie' | 'doughnut' | 'polarArea' | 'radar' = 'doughnut';

  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: any[] = [];

  @Input() options: any = {
    palette: [
      '#ff6358',
      '#ffd246',
      '#78d237',
      '#28b4c8',
      '#2d73f5',
      '#aa46be',
      '#FF8A82',
      '#FFDD74',
      '#9ADD69',
      '#5EC7D6',
      '#6296F8',
      '#BF74CE',
      '#BF4A42',
      '#BF9E35',
      '#5A9E29',
      '#1E8796',
      '#2256B8',
      '#80358F',
      '#FFB1AC',
      '#FFE9A3',
    ], //default palette
  };

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    parsing: {
      key: 'field',
    },
  };

  public chartData: ChartData<'doughnut' | 'pie' | 'polarArea' | 'radar'> = {
    datasets: [],
  };

  ngOnChanges(): void {
    this.showCategoryLabel = get(this.options, 'labels.showCategory', false);
    if (get(this.options, 'labels.showCategory', false))
      this.categoryPositionLabel = get(
        this.options,
        'labels.categoryPosition',
        false
      );
    if (get(this.options, 'labels.showValue', false))
      this.showValueLabels = get(this.options, 'labels.valueType', false);
    this.fieldSum =
      this.series[0]?.data.reduce(
        (acc: number, curr: any) => acc + curr.field,
        0
      ) || 0;
    this.chartData.datasets = this.series.map((x, i) => {
      const color: any = get(this.options, `palette[${i}]`, undefined);
      return {
        ...x,
        backgroundColor: color,
        hoverBackgroundColor: color ? addTransparency(color) : undefined,
        hoverOffset: 4,
      };
    });
    this.chartData.labels = flatten(
      this.series.map((x) => x.data.map((y: any) => y.category))
    );
    this.setOptions();
    this.chart?.update();
  }

  /** Initializes chart options */
  setOptions(): void {
    const [fontOptions, underlineTitle] = parseFontOptions(
      get(this.title, 'font', '')
    );

    const titleText = get(this.title, 'text', '');
    const titleColor = get(this.title, 'color', undefined);
    const titleVisible = titleText !== '';

    this.chartOptions = {
      ...this.chartOptions,
      plugins: {
        legend: {
          display: get(this.legend, 'visible', false),
          labels: {
            // borderRadius: 4,
            // useBorderRadius: true,
            usePointStyle: true,
            pointStyle: 'rectRounded',
          },
          position: get(this.legend, 'position', 'bottom'),
        },
        title: {
          display: titleVisible && !!titleText,
          text: titleText,
          position: get(this.title, 'position', 'top'),
          color: titleColor,
          font: fontOptions,
        },
      },
    };

    // adds underline plugin if needed
    if (titleVisible && underlineTitle && this.chartOptions?.plugins)
      Object.assign(this.chartOptions.plugins, {
        underline: {
          display: true,
          fontSize: fontOptions.size,
          fontWeight: fontOptions.weight,
          fontStyle: fontOptions.style,
          color: titleColor,
        },
      });

    // adds datalabels plugin options
    if (this.chartOptions?.plugins) {
      Object.assign(this.chartOptions.plugins, {
        datalabels: {
          display:
            !!this.showValueLabels ||
            (this.showCategoryLabel && this.categoryPositionLabel === 'inside'),
          color: 'white',
          font: {
            weight: 'bold',
          },
          anchor: 'center',
          align: 'center',
          textAlign: 'center',
          formatter: (val: any = {}) => {
            const res: string[] = [];
            if (!val.field || !val.category) return '';
            if (
              this.showCategoryLabel &&
              this.categoryPositionLabel === 'inside'
            )
              res.push(val.category);
            if (this.showValueLabels) {
              const displayPercentage = this.showValueLabels === 'percentage';
              let value = displayPercentage
                ? (val.field / this.fieldSum) * 100
                : val.field;

              // if has no decimals, show as integer
              // toFixed(0) also fixes precision issues
              if (Math.trunc(value) === value) value = value.toFixed(0);
              else value = value.toFixed(2);
              res.push(displayPercentage ? `${value}%` : value);
            }
            return res;
          },
        },
        customOutsideDataLabels: {
          display:
            !!this.showCategoryLabel &&
            this.categoryPositionLabel === 'outside',
        },
      });
    }
  }

  /** Exports chart as an image */
  public exportImage(): void {
    this.chart?.toBase64Image();
  }
}
