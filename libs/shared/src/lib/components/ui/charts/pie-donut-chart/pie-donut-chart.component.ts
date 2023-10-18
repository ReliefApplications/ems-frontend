import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Plugin, ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { get, flatten, isEqual, isNil } from 'lodash';
import { parseFontOptions } from '../../../../utils/graphs/parseFontString';
import drawUnderlinePlugin from '../../../../utils/graphs/plugins/underline.plugin';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import whiteBackgroundPlugin from '../../../../utils/graphs/plugins/background.plugin';
import { ChartLegend, ChartTitle } from '../interfaces';
import { DEFAULT_PALETTE } from '../const/palette';
import { getColor } from '../utils/color.util';
import Color from 'color';

/**
 * Uses chart.js to render the data as a pie chart
 */
@Component({
  selector: 'shared-pie-donut-chart',
  templateUrl: './pie-donut-chart.component.html',
  styleUrls: ['./pie-donut-chart.component.scss'],
})
/**
 * Pie/Doughnut/polarArea/Radar chart component, based on chart.js component.
 */
export class PieDonutChartComponent implements OnChanges {
  /** Variable to track the sum of the field. */
  private fieldSum = 0;
  /** Variable to track the display of value labels. */
  private showValueLabels: false | 'percentage' | 'value' = false;
  /** Boolean to track if category label is shown. */
  private showCategoryLabel = false;
  /** Array of plugins. */
  public plugins: Plugin[] = [
    drawUnderlinePlugin,
    DataLabelsPlugin,
    whiteBackgroundPlugin,
  ];
  /** Input decorator for chartType. */
  @Input() chartType: 'pie' | 'doughnut' | 'polarArea' | 'radar' = 'doughnut';
  /** Input decorator for title. */
  @Input() title: ChartTitle | undefined;
  /** Input decorator for legend. */
  @Input() legend: ChartLegend | undefined;
  /** Input decorator for series. */
  @Input() series: any[] = [];
  /** Input decorator for options.  */
  @Input() options: any = {
    palette: DEFAULT_PALETTE,
  };
  /** ViewChild decorator for chart. */
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  /** Options for the chart configuration. */
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    parsing: {
      key: 'field',
    },
  };
  /** Data for the chart. */
  public chartData: ChartData<'doughnut' | 'pie' | 'polarArea' | 'radar'> = {
    datasets: [],
  };

  /** OnChanges lifecycle hook. */
  ngOnChanges(): void {
    this.showCategoryLabel = get(this.options, 'labels.showCategory', false);
    if (get(this.options, 'labels.showValue', false))
      this.showValueLabels = get(this.options, 'labels.valueType', false);
    this.fieldSum =
      this.series[0]?.data.reduce(
        (acc: number, curr: any) => acc + curr.field,
        0
      ) || 0;

    const series = get(this.options, 'series', []);
    const palette = get(this.options, 'palette') || DEFAULT_PALETTE;

    // Build series and filter out the hidden series
    this.chartData.datasets = this.series
      .map((x) => {
        // Get serie settings
        const serie = series.find(
          (serie: any) =>
            isEqual(serie.serie, x.name) ||
            (isNil(serie.serie) && isNil(x.name))
        );
        // if the serie is visible, get the data
        if (get(serie, 'visible', true)) {
          const categories = get(serie, 'categories', []);
          const data: any[] =
            get(x, 'data', []).reduce((data: any[], item: any) => {
              get(
                categories.find((c: any) => c.category === item.category),
                'visible',
                true
              ) && data.push(item);
              return data;
            }, []) || [];
          const colors = data.reduce((colors: any[], item: any, i: number) => {
            colors.push(
              get(
                categories.find((c: any) => c.category === item.category),
                'color'
              ) || getColor(palette, i)
            );
            return colors;
          }, []);
          const transparentColors = colors.map((color: string) =>
            Color.rgb(color).fade(0.7).toString()
          );
          return {
            ...x,
            data,
            backgroundColor: colors,
            hoverBorderColor: colors,
            hoverBackgroundColor: transparentColors,
            hoverOffset: 4,
          };
        }
      })
      .filter(Boolean);
    this.chartData.labels = flatten(
      this.chartData.datasets.map((x) => x.data.map((y: any) => y.category))
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
      devicePixelRatio: 2,
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
          display: !!this.showValueLabels || this.showCategoryLabel,
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
            if (this.showCategoryLabel) res.push(val.category);
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
      });
    }
  }

  /** Exports chart as an image */
  public exportImage(): void {
    this.chart?.toBase64Image();
  }
}
