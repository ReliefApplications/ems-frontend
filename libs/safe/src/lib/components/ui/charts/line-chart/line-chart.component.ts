import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import get from 'lodash/get';
import {
  Plugin,
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import drawUnderlinePlugin from '../../../../utils/graphs/plugins/underline.plugin';
import { parseFontOptions } from '../../../../utils/graphs/parseFontString';
import { addTransparency } from '../../../../utils/graphs/addTransparency';
import whiteBackgroundPlugin from '../../../../utils/graphs/plugins/background.plugin';
import { ChartTitle } from '../interfaces';

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
  public plugins: Plugin[] = [
    drawUnderlinePlugin,
    DataLabelsPlugin,
    whiteBackgroundPlugin,
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
    elements: {
      line: {
        spanGaps: true,
      },
    },
  };

  public chartType: ChartType = 'line';
  public chartData: ChartData<'line'> = {
    datasets: [],
  };

  ngOnChanges(): void {
    this.showValueLabels = get(this.options, 'labels.valueType', false);
    const series = get(this.options, 'series', []);
    this.chartData.datasets = this.series.map((x, i) => {
      const serie = series.find((serie: any) => serie.serie === x.name);
      const color =
        get(serie, 'color', null) ||
        get(this.options, `palette[${i}]`, undefined);

      // finds min and max values from x.data
      const min = Math.min(...x.data.map((y: any) => y.field ?? Infinity));
      const max = Math.max(...x.data.map((y: any) => y.field ?? -Infinity));
      if (min < this.min) this.min = min;
      if (max > this.max) this.max = max;
      return {
        ...x,
        color,
        backgroundColor: color,
        borderColor: color,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: color,
        pointHoverBackgroundColor: color ? addTransparency(color) : undefined,
        pointBorderColor: color,
        pointBorderWidth: 2,
        pointHoverBorderColor: color,
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
            autoSkip: false,
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
