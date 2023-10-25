import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import get from 'lodash/get';
import {
  Plugin,
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType,
  ChartArea,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import drawUnderlinePlugin from '../../../../utils/graphs/plugins/underline.plugin';
import { parseFontOptions } from '../../../../utils/graphs/parseFontString';
import whiteBackgroundPlugin from '../../../../utils/graphs/plugins/background.plugin';
import { ChartLegend, ChartTitle } from '../interfaces';
import { DEFAULT_PALETTE } from '../const/palette';
import { getColor } from '../utils/color.util';
import { isEqual, isNil } from 'lodash';
import Color from 'color';

/** Interpolation modes */
type Interpolation = 'linear' | 'cubic' | 'step';

/** Step interpolation models */
type StepInterpolation = 'before' | 'after' | 'middle';

/**
 * Uses chart.js to render the data as a line chart
 */
@Component({
  selector: 'shared-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnChanges {
  /** Array of plugins. */
  public plugins: Plugin[] = [
    drawUnderlinePlugin,
    DataLabelsPlugin,
    whiteBackgroundPlugin,
  ];
  /** Boolean to track the display of value labels. */
  private showValueLabels = false;
  /** Variable to track the minimum value. */
  private min = Infinity;
  /** Variable to track the maximum value. */
  private max = -Infinity;
  /** Input decorator for title. */
  @Input() title: ChartTitle | undefined;
  /** Input decorator for legend. */
  @Input() legend: ChartLegend | undefined;
  /** Input decorator for series.  */
  @Input() series: any[] = [];
  /** Input decorator for options. */
  @Input() options: any = {
    palette: DEFAULT_PALETTE,
    axes: null,
  };
  /** ViewChild decorator for chart. */
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  /** Options for the chart configuration. */
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    parsing: {
      xAxisKey: 'category',
      yAxisKey: 'field',
    },
    elements: {
      line: {
        spanGaps: true,
      },
    },
  };
  /** Type of the chart. */
  public chartType: ChartType = 'line';
  /** Data for the chart. */
  public chartData: ChartData<'line'> = {
    datasets: [],
  };

  /** OnChanges lifecycle hook. */
  ngOnChanges(): void {
    this.showValueLabels = get(this.options, 'labels.showValue', false);
    const series = get(this.options, 'series', []);
    const palette = get(this.options, 'palette') || DEFAULT_PALETTE;
    // Build series and filter out the hidden series
    this.chartData.datasets = this.series
      .map((x, i) => {
        // Get serie settings
        const serie = series.find(
          (serie: any) =>
            isEqual(serie.serie, x.name) ||
            (isNil(serie.serie) && isNil(x.name))
        );
        // if the serie is visible, get the data
        if (get(serie, 'visible', true)) {
          // Get color
          const color = Color(
            get(serie, 'color', null) || getColor(palette, i)
          ).hexa();
          // Find min and max values from x.data
          const min = Math.min(...x.data.map((y: any) => y.field ?? Infinity));
          const max = Math.max(...x.data.map((y: any) => y.field ?? -Infinity));
          if (min < this.min) this.min = min;
          if (max > this.max) this.max = max;
          // Get fill type
          const fill = get(serie, 'fill', null);
          let gradient: CanvasGradient | undefined;
          if (fill === 'gradient') {
            const chartArea = this.chart?.chart?.chartArea as ChartArea;
            const ctx = this.chart?.chart?.canvas.getContext('2d');
            gradient = ctx?.createLinearGradient(
              0,
              chartArea.bottom,
              0,
              chartArea.top
            );
            gradient?.addColorStop(1, color);
            gradient?.addColorStop(0, Color.rgb(color).alpha(0.05).toString());
          }
          // Get interpolation mode
          const interpolation = get<Interpolation>(
            serie,
            'interpolation',
            'linear'
          );

          return {
            ...x,
            color,
            backgroundColor: gradient || color,
            borderColor: color,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBackgroundColor: color,
            pointHoverBackgroundColor: color
              ? Color.rgb(color).fade(0.7).toString()
              : undefined,
            pointBorderColor: color,
            pointBorderWidth: 2,
            pointHoverBorderColor: color,
            pointHoverBorderWidth: 2,
            ...(interpolation === 'cubic' && { tension: 0.4 }),
            ...(interpolation === 'step' && {
              stepped: get<StepInterpolation>(serie, 'stepped', 'before'),
            }),
            fill: !!fill,
          };
        }
      })
      .filter(Boolean);
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

    // log min an max
    this.chartOptions = {
      ...this.chartOptions,
      scales: {
        x: {
          grid: {
            display: get(this.options, 'grid.x.display', true),
          },
          ticks: {
            autoSkip: true,
            maxRotation: 90,
            minRotation: 0,
          },
        },
        y: {
          grid: {
            display: get(this.options, 'grid.y.display', true),
          },
          min: this.min - 0.1 * this.min,
          max: this.max + 0.1 * this.max,
        },
      },
      plugins: {
        legend: {
          display:
            get(this.legend, 'visible', false) && !!this.series[0]?.label,
          labels: {
            // borderRadius: 4,
            // useBorderRadius: true,
            color: '#000',
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
      devicePixelRatio: 2,
    } as ChartOptions;

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
          display: this.showValueLabels,
          color: 'black',
          font: {
            weight: 'bold',
          },
          anchor: 'end',
          align: 'end',
          offset: 4,
          formatter: (val: any) => val?.field ?? '',
        },
      });
    }
  }

  /** Exports chart as an image */
  public exportImage(): void {
    this.chart?.toBase64Image();
  }
}
