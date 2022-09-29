import {
  Component,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  CategoryAxis,
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
  font: string;
  color: string;
}

/**
 * Interface containing the settings of the chart series
 */
interface ChartSeries {
  name?: string;
  color?: string;
  data: {
    category: any;
    field: any;
    color?: string;
  }[];
}

/** Interface of chart labels */
interface ChartLabels {
  showValue: boolean;
}

/** Interface of chart options */
interface ChartOptions {
  palette: string[];
  axes: any;
  labels?: ChartLabels;
}

/**
 * Uses kendo chart to render the data as a line chart
 */
@Component({
  selector: 'safe-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class SafeLineChartComponent implements OnInit, OnChanges {
  @Input() title: ChartTitle | undefined;

  @Input() series: ChartSeries[] = [];

  @Input() options: ChartOptions = {
    palette: [],
    axes: null,
  };

  @Input() legendEvent: any;

  public animateChart = true;

  @ViewChild('chart')
  public chart?: ChartComponent;

  @ViewChildren('series')
  public seriesComponent?: QueryList<SeriesItemComponent>;

  public min: number | undefined;

  public max: number | undefined;

  public labels: any;

  /**
   * Constructor for safe-line-chart component
   */
  constructor() {}

  ngOnInit(): void {
    this.min = get(this.options, 'axes.x.min');
    this.max = get(this.options, 'axes.x.max');
    this.labels = {
      visible: get(this.options, 'labels.showValue'),
    };
    this.legendEvent.subscribe((res: any) => {
      if (res) {
        if (res.event === 'toggleSeries') {
          this.seriesComponent?.get(res.index)?.toggleVisibility();
          this.animateChart = false;
          res.item.active = !res.item.active;
        } else if (res.event === 'toggleSeriesHighlight') {
          this.chart?.toggleHighlight(
            res.value,
            (p: any) => p.series.name === res.id
          );
        }
      }
    });
  }

  ngOnChanges(): void {
    this.min = get(this.options, 'axes.x.min');
    this.max = get(this.options, 'axes.x.max');
    this.labels = {
      visible: get(this.options, 'labels.showValue'),
    };
  }
}
