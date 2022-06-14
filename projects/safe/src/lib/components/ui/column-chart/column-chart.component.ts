import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, SeriesStack } from '@progress/kendo-angular-charts';
import get from 'lodash/get';

interface ChartTitle {
  visible: boolean;
  text: string;
  position: 'top' | 'bottom';
}

interface ChartLegend {
  visible: boolean;
  orientation: 'horizontal' | 'vertical';
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface ChartSeries {
  name?: string;
  color?: string;
  data: {
    field: number | null;
    category: any;
  }[];
}

interface ChartLabels {
  showValue: boolean;
  valueType: string;
}

interface ChartOptions {
  palette: string[];
  axes?: {
    y?: {
      min?: number;
      max?: number;
    };
  };
  labels?: ChartLabels;
  stack: boolean | SeriesStack;
}

@Component({
  selector: 'safe-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss'],
})
export class SafeColumnChartComponent implements OnInit, OnChanges {
  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: ChartSeries[] = [];

  @Input() options: ChartOptions = {
    palette: [],
    stack: false,
  };

  @Input() gap = 2;

  @Input() spacing = 0.25;

  public min: number | undefined;

  public max: number | undefined;

  public stack: boolean | SeriesStack = false;

  @ViewChild('chart')
  public chart?: ChartComponent;

  /**
   * The function which returns the Chart series label content.
   * Content is defined on the component init.
   *
   * @param e - Event which with the specific label data
   * @return Returns a string which will be used as the label content
   */
  public labelContent: ((e: any) => string) | null = null;

  ngOnInit(): void {
    this.min = get(this.options, 'axes.y.min');
    this.max = get(this.options, 'axes.y.max');
    this.stack = this.series.length > 1 ? get(this.options, 'stack') : false;
    this.setLabelContent();
  }

  ngOnChanges(): void {
    this.min = get(this.options, 'axes.y.min');
    this.max = get(this.options, 'axes.y.max');
    this.stack = this.series.length > 1 ? get(this.options, 'stack') : false;
  }

  /**
   * Set label content method.
   */
  private setLabelContent(): void {
    const showCategory = get(this.options, 'labels.showCategory', false);
    const showValue = get(this.options, 'labels.showValue', false);
    const valueType = get(this.options, 'labels.valueType', 'value');

    if (showCategory) {
      if (showValue) {
        switch (valueType) {
          case 'percentage': {
            this.labelContent = (e: any): string =>
              e.category && e.percentage
                ? `${e.category}
                ${(parseFloat(e.percentage) * 100).toFixed(2)}%`
                : '';
            break;
          }
          default: {
            this.labelContent = (e: any): string =>
              e.category && e.value ? e.category + '\n' + e.value : '';
            break;
          }
        }
      } else {
        this.labelContent = (e: any): string => e.category || '';
      }
    } else {
      if (showValue) {
        switch (valueType) {
          case 'percentage': {
            this.labelContent = (e: any): string =>
              e.percentage
                ? (parseFloat(e.percentage) * 100).toFixed(2) + '%'
                : '';
            break;
          }
          default: {
            this.labelContent = (e: any): string => e.value || '';
            break;
          }
        }
      }
    }
  }
}
