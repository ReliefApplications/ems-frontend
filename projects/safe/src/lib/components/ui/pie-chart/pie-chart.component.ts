import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  SeriesItemComponent,
} from '@progress/kendo-angular-charts';
import get from 'lodash/get';

/**
 * Interface containing the settings of the chart title
 */
interface ChartTitle {
  visible: boolean;
  text: string;
  position: 'top' | 'bottom';
}

/**
 * Interface containing the settings of the chart series
 */
interface ChartSeries {
  data: {
    category: any;
    field: any;
    color?: string;
  }[];
}

/** Interface of chart labels */
interface ChartLabels {
  showCategory: boolean;
  showValue: boolean;
  valueType: string;
}

/** Interface of chart options */
interface ChartOptions {
  palette: string[];
  labels?: ChartLabels;
}

/**
 * Uses kendo chart to render the data as a pie chart
 */
@Component({
  selector: 'safe-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
/**
 * Pie chart component, based on kendo chart component.
 */
export class SafePieChartComponent implements OnInit {
  @Input() title: ChartTitle | undefined;

  @Input() series: ChartSeries[] = [];

  @Input() options: ChartOptions = {
    palette: [],
  };

  @Input() legendEvent: any;

  public animateChart = true;

  @ViewChild('chart')
  public chart?: ChartComponent;

  @ViewChild('series')
  public seriesComponent?: SeriesItemComponent;

  /**
   * The function which returns the Chart series label content.
   * Content is defined on the component init.
   *
   * @param e - Event which with the specific label data
   * @returns Returns a string which will be used as the label content
   */
  public labelContent: ((e: any) => string) | null = null;

  /**
   * Constructor for safe-pie-chart component
   */
  constructor() {}

  ngOnInit(): void {
    this.setLabelContent();
    this.legendEvent.subscribe((res: any) => {
      if (res) {
        if (res.event === 'toggleSeries') {
          this.animateChart = false;
          this.seriesComponent?.togglePointVisibility(res.index);
          res.item.active = !res.item.active;
        } else if (res.event === 'toggleSeriesHighlight') {
          this.chart?.toggleHighlight(
            res.value,
            (p) => p.dataItem.id === res.id
          );
        }
      }
    });
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
