import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from '@progress/kendo-angular-charts';
import get from 'lodash/get';

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
interface ChartSeries {
  data: {
    category: any;
    field: any;
    color?: string;
  }[];
}

/** Interface for chart labels */
interface ChartLabels {
  showCategory: boolean;
  showValue: boolean;
  valueType: string;
}

/** Interface for chart options */
interface ChartOptions {
  palette: string[];
  labels?: ChartLabels;
}

/**
 * Component for donut charts
 * Uses kendo chart to render the data as a donut chart
 */
@Component({
  selector: 'safe-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
})
export class SafeDonutChartComponent implements OnInit {
  @Input() title: ChartTitle | undefined;

  @Input() legend: ChartLegend | undefined;

  @Input() series: ChartSeries[] = [];

  @Input() options: ChartOptions = {
    palette: [],
  };

  @ViewChild('chart')
  public chart?: ChartComponent;

  /**
   * The function which returns the Chart series label content.
   * Content is defined on the component init.
   *
   * @param e - Event which with the specific label data
   * @returns Returns a string which will be used as the label content
   */
  public labelContent: ((e: any) => string) | null = null;

  /**
   * Component for donut charts.
   */
  constructor() {}

  ngOnInit(): void {
    this.setLabelContent();
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
              e.category +
              '\n' +
              (parseFloat(e.percentage) * 100).toFixed(2) +
              '%';
            break;
          }
          default: {
            this.labelContent = (e: any): string => e.category + '\n' + e.value;
            break;
          }
        }
      } else {
        this.labelContent = (e: any): string => e.category;
      }
    } else {
      if (showValue) {
        switch (valueType) {
          case 'percentage': {
            this.labelContent = (e: any): string =>
              (parseFloat(e.percentage) * 100).toFixed(2) + '%';
            break;
          }
          default: {
            this.labelContent = (e: any): string => e.value;
            break;
          }
        }
      }
    }
  }
}
