import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import get from 'lodash/get';
import {
  ChartComponentLike,
  ChartConfiguration,
  ChartData,
  ChartType,
} from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import drawUnderlinePlugin from '../../../utils/graphs/plugins/underline';
import { addTransparency } from '../../../utils/graphs/addTransparency';
import { parseFontOptions } from '../../../utils/graphs/parseFontString';

/**
 * Interface of chart title
 */
interface ChartTitle {
  visible: boolean;
  text: string;
  position: 'top' | 'bottom';
  font: string;
  color: string;
}

/**
 * Interface of chart legend
 */
interface ChartLegend {
  visible: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Column chart component, based on chart.js component.
 */
@Component({
  selector: 'safe-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss'],
})
export class SafeColumnChartComponent implements OnInit, OnChanges {
  public plugins: ChartComponentLike[] = [
    drawUnderlinePlugin,
    DataLabelsPlugin,
  ];
  private usePercentage = false;
  private showValueLabels: false | 'percentage' | 'value' = false;

  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: any[] = [];

  @Input() options: any = {
    palette: [],
    stack: false,
  };

  @Input() gap = 2;

  @Input() spacing = 0.25;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    parsing: {
      xAxisKey: 'category',
      yAxisKey: 'field',
    },
  };
  public chartType: ChartType = 'bar';

  public chartData: ChartData<'bar'> = {
    datasets: [],
  };

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.usePercentage = get(this.options, 'stack', {}).type === '100%';
    if (get(this.options, 'labels.showValue', false))
      this.showValueLabels = get(this.options, 'labels.valueType', false);
    if (this.usePercentage) this.normalizeDataset();

    this.chartData.datasets = this.series.map((x, i) => ({
      ...x,
      borderRadius: 8,
      backgroundColor: this.options.palette?.[i] || undefined,
      hoverBackgroundColor: this.options.palette?.[i]
        ? addTransparency(this.options.palette?.[i])
        : undefined,
    }));

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

    this.chartOptions = {
      ...this.chartOptions,
      scales: {
        x: {
          stacked: !!get(this.options, 'stack', false),
          min: get(this.options, 'axes.x.min', undefined),
          max: get(this.options, 'axes.x.max', undefined),
        },
        y: {
          stacked: !!get(this.options, 'stack', false),
          min: get(this.options, 'axes.y.min', undefined),
          max: get(this.options, 'axes.y.max', undefined),
        },
      },
      plugins: {
        legend: {
          display:
            get(this.legend, 'visible', false) && !!this.series[0]?.label,
          labels: {
            borderRadius: 4,
            useBorderRadius: true,
          },
          position: get(this.legend, 'position', 'bottom'),
        },
        title: {
          display: get(this.title, 'visible', false) && !!titleText,
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
              let value = context.parsed.y;
              if (Math.trunc(value) === value) value = value.toFixed(0);
              else value = value.toFixed(2);
              return `${label}: ${value.toFixed(2)}%`;
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
  exportImage(): void {
    this.chart?.toBase64Image();
  }
}
