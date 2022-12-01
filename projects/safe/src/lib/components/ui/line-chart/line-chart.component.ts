import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import get from 'lodash/get';
import {
  ChartComponentLike,
  ChartConfiguration,
  ChartData,
  ChartType,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import drawUnderlinePlugin from '../../../utils/graphs/plugins/underline';
import { parseFontOptions } from '../../../utils/graphs/parseFontString';
import { addTransparency } from '../../../utils/graphs/addTransparency';

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
  position: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Uses chart.js to render the data as a line chart
 */
@Component({
  selector: 'safe-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class SafeLineChartComponent implements OnChanges {
  public plugins: ChartComponentLike[] = [
    drawUnderlinePlugin,
    DataLabelsPlugin,
  ];
  private showValueLabels = false;
  private min = Infinity;
  private max = -Infinity;

  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: any[] = [];

  @Input() options: any = {
    palette: [],
    axes: null,
  };

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    parsing: {
      xAxisKey: 'category',
      yAxisKey: 'field',
    },
  };

  public chartType: ChartType = 'line';
  public chartData: ChartData<'line'> = {
    datasets: [],
  };

  ngOnChanges(): void {
    this.showValueLabels = get(this.options, 'labels.valueType', false);
    this.chartData.datasets = this.series.map((x, i) => {
      const color = this.options.palette?.[i];

      // finds min and max values from x.data
      const min = Math.min(...x.data.map((y: any) => y.field ?? Infinity));
      const max = Math.max(...x.data.map((y: any) => y.field ?? -Infinity));
      if (min < this.min) this.min = min;
      if (max > this.max) this.max = max;
      return {
        ...x,
        color: color || undefined,
        backgroundColor: color || undefined,
        borderColor: color || undefined,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: color || undefined,
        pointHoverBackgroundColor: color ? addTransparency(color) : undefined,
        pointBorderColor: color || undefined,
        pointBorderWidth: 2,
        pointHoverBorderColor: color || undefined,
        pointHoverBorderWidth: 2,
        tension: 0.4,
      };
    });
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
    const titleVisible = get(this.title, 'visible', false);
    // log min an max
    this.chartOptions = {
      ...this.chartOptions,
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: this.shouldRotateLabels() ? 90 : 0,
            minRotation: this.shouldRotateLabels() ? 90 : 0,
          },
        },
        y: {
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

  /**
   * Gets whether or not the labels should be rotated
   *
   * @returns true if the labels should be rotated, false otherwise
   */
  private shouldRotateLabels() {
    const ctx = this.chart?.chart?.ctx;
    if (!ctx) return false;

    const labels = new Set<string>();
    this.series.forEach((s) =>
      s.data.forEach((d: any) => labels.add(d.category))
    );

    const totalLabelWidth = Array.from(labels).reduce(
      (acc, label) => acc + ctx.measureText(label).width + 10,
      0
    );

    return ctx.canvas.width < totalLabelWidth;
  }

  /** Exports chart as an image */
  public exportImage(): void {
    this.chart?.toBase64Image();
  }
}
