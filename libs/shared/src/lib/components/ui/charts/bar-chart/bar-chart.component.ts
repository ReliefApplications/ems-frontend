import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import get from 'lodash/get';
import {
  ChartArea,
  ChartConfiguration,
  ChartData,
  ChartType,
  Plugin,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import drawUnderlinePlugin from '../../../../utils/graphs/plugins/underline.plugin';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { parseFontOptions } from '../../../../utils/graphs/parseFontString';
import whiteBackgroundPlugin from '../../../../utils/graphs/plugins/background.plugin';
import { ChartLegend, ChartTitle } from '../interfaces';
import { DEFAULT_PALETTE } from '../const/palette';
import { getColor } from '../utils/color.util';
import { isEqual, isNil } from 'lodash';
import Color from 'color';

/**
 * Bar/Column chart component, based on chart.js component.
 */
@Component({
  selector: 'shared-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnChanges {
  /** Array of plugins. */
  public plugins: Plugin[] = [
    drawUnderlinePlugin,
    DataLabelsPlugin,
    whiteBackgroundPlugin,
  ];
  /** Boolean to track if percentage is used. */
  private usePercentage = false;
  /** Variable to track the display of value labels. */
  private showValueLabels: false | 'percentage' | 'value' = false;
  /** Input decorator for orientation. */
  @Input() orientation: 'vertical' | 'horizontal' = 'horizontal';
  /** Input decorator for title. */
  @Input() title: ChartTitle | undefined;
  /** Input decorator for legend. */
  @Input() legend: ChartLegend | undefined;
  /** Input decorator for series. */
  @Input() series: any[] = [];
  /** Input decorator for options. */
  @Input() options: any = {
    palette: DEFAULT_PALETTE,
    stack: false,
  };
  /** Input decorator for gap. */
  @Input() gap = 2;
  /** Input decorator for spacing. */
  @Input() spacing = 0.25;
  /** ViewChild decorator for chart. */
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  /** Options for the chart configuration. */
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };
  /** Type of the chart.   */
  public chartType: ChartType = 'bar';
  /** Data for the chart. */
  public chartData: ChartData<'bar'> = {
    datasets: [],
  };

  /** OnChanges lifecycle hook. */
  ngOnChanges(): void {
    const isBar = this.orientation === 'horizontal';
    this.usePercentage = get(this.options, 'stack', {}).type === '100%';
    if (get(this.options, 'labels.showValue', false))
      this.showValueLabels = get(this.options, 'labels.valueType', false);
    if (this.usePercentage) this.normalizeDataset();
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
          // Get fill type
          const fill = get(serie, 'fill', null);
          let gradient: CanvasGradient | undefined;
          if (fill === 'gradient') {
            const chartArea = this.chart?.chart?.chartArea as ChartArea;
            const ctx = this.chart?.chart?.canvas.getContext('2d');
            gradient = ctx?.createLinearGradient(
              isBar ? chartArea.left : 0,
              isBar ? 0 : chartArea.bottom,
              isBar ? chartArea.right : 0,
              isBar ? 0 : chartArea.top
            );
            gradient?.addColorStop(1, color);
            gradient?.addColorStop(0, Color.rgb(color).alpha(0.05).toString());
          }
          return {
            ...x,
            borderRadius: 8,
            backgroundColor: gradient || color,
            color,
            borderColor: color,
            pointBorderColor: color,
            hoverBackgroundColor: color
              ? Color.rgb(color).fade(0.7).toString()
              : undefined,
          };
        } else {
          return;
        }
      })
      .filter(Boolean);
    this.setOptions();
    this.chart?.update();
  }

  /** Initializes chart options */
  setOptions(): void {
    const isBar = this.orientation === 'horizontal';
    const [fontOptions, underlineTitle] = parseFontOptions(
      get(this.title, 'font', '')
    );

    const titleText = get(this.title, 'text', '');
    const titleColor = get(this.title, 'color', undefined);
    const titleVisible = titleText !== '';

    this.chartOptions = {
      ...this.chartOptions,
      indexAxis: isBar ? 'y' : 'x',
      // We use these empty structures as placeholders for dynamic theming.
      parsing: {
        xAxisKey: isBar ? 'field' : 'category',
        yAxisKey: isBar ? 'category' : 'field',
      },
      scales: {
        x: {
          grid: {
            display: get(this.options, 'grid.x.display', true),
          },
          stacked: get(this.options, 'stack', false),
          min: isBar ? get(this.options, 'axes.x.min', undefined) : undefined,
          max: isBar ? get(this.options, 'axes.x.max', undefined) : undefined,
          ticks: {
            autoSkip: isBar,
            maxRotation: 90,
            minRotation: 0,
          },
        },
        y: {
          grid: {
            display: get(this.options, 'grid.y.display', true),
          },
          stacked: get(this.options, 'stack', false),
          min: !isBar ? get(this.options, 'axes.y.min', undefined) : undefined,
          max: !isBar ? get(this.options, 'axes.y.max', undefined) : undefined,
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
          display: this.showValueLabels,
          color: 'white',
          font: {
            weight: 'bold',
          },
          anchor: 'center',
          align: 'center',
          formatter: (val: any = {}) => {
            const displayPercentage = this.showValueLabels === 'percentage';
            // if is stacked and use percentage, show percentage, else show value
            let value =
              displayPercentage || !this.usePercentage
                ? val.field
                : val.actualField;
            if (!value) return '';

            // if has no decimals, show as integer
            // toFixed(0) also fixes precision issues
            if (Math.trunc(value) === value) value = value.toFixed(0);
            else value = value.toFixed(2);
            return displayPercentage ? `${value}%` : value;
          },
        },
      });
    }

    // adds % sign to tooltip if usePercentage is true
    if (this.usePercentage && this.chartOptions?.plugins) {
      Object.assign(this.chartOptions.plugins, {
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.dataset.label || '';
              let value =
                context.parsed[this.orientation === 'vertical' ? 'y' : 'x'];
              if (Math.trunc(value) === value) value = value.toFixed(0);
              else value = value.toFixed(2);
              return `${label}: ${value}%`;
            },
          },
        },
      });
    }
  }

  /** Normalizes data into percentage of category total */
  private normalizeDataset() {
    const categoryTotal = this.series.reduce((acc, s) => {
      s.data.forEach((d: any) => {
        acc[d.category] = (acc[d.category] || 0) + d.field;
      });
      return acc;
    }, {});
    this.series = this.series.map((x) => ({
      ...x,
      data: x.data.map((d: any) => ({
        ...d,
        field: (d.field / categoryTotal[d.category]) * 100,
        actualField: d.field,
      })),
    }));
  }

  /** Exports chart as an image */
  public exportImage(): void {
    this.chart?.toBase64Image();
  }
}
