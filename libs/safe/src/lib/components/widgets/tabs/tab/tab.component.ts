import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { SafeWidgetGridComponent } from '../../../widget-grid/widget-grid.component';

const structure = [
  {
    id: null,
    name: 'Bar chart',
    icon: '/assets/bar.svg',
    color: '#B5DC8D',
    settings: {
      id: null,
      title: 'Bar chart widget',
      chart: {
        type: 'bar',
        aggregationId: '6324458f9bcbed002894941e',
        legend: {
          visible: true,
          position: 'bottom',
        },
        title: {
          text: null,
          position: 'top',
          bold: false,
          italic: false,
          underline: false,
          font: '',
          size: 12,
          color: null,
        },
        palette: {
          enabled: false,
          value: [
            '#ff6358',
            '#ffd246',
            '#78d237',
            '#28b4c8',
            '#2d73f5',
            '#aa46be',
            '#FF8A82',
            '#FFDD74',
            '#9ADD69',
            '#5EC7D6',
            '#6296F8',
            '#BF74CE',
            '#BF4A42',
            '#BF9E35',
            '#5A9E29',
            '#1E8796',
            '#2256B8',
            '#80358F',
            '#FFB1AC',
            '#FFE9A3',
          ],
        },
        labels: {
          showCategory: false,
          showValue: false,
          valueType: 'value',
        },
        grid: {
          x: {
            display: true,
          },
          y: {
            display: true,
          },
        },
        axes: {
          y: {
            enableMin: false,
            min: null,
            enableMax: false,
            max: null,
          },
          x: {
            enableMin: false,
            min: null,
            enableMax: false,
            max: null,
          },
        },
        stack: {
          enable: false,
          usePercentage: false,
        },
        series: [],
        mapping: {
          category: 'createdAt',
          field: 'count',
          series: '',
        },
      },
      resource: '626ba7077ad4dd5271f3fdab',
      contextFilters: '{\n  "logic": "and",\n  "filters": []\n}',
      widgetDisplay: {
        showBorder: true,
        style: '',
      },
    },
    defaultCols: 2,
    defaultRows: 3,
    minRow: 1,
    component: 'chart',
  },
];

@Component({
  selector: 'safe-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent {
  @ViewChild('content', { read: ViewContainerRef })
  content!: ViewContainerRef;

  ngAfterViewInit(): void {
    const componentRef = this.content.createComponent(SafeWidgetGridComponent);
    componentRef.setInput('widgets', structure);
  }
}
