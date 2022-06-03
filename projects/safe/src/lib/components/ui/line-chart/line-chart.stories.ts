import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeLineChartComponent } from './line-chart.component';
import { SafeLineChartModule } from './line-chart.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  component: SafeLineChartComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeLineChartModule, BrowserAnimationsModule],
      providers: [],
    }),
  ],
  title: 'UI/Charts/Line Chart',
  argTypes: {
    series: {
      control: { type: 'object' },
    },
    legend: {
      control: { type: 'object' },
    },
    title: {
      control: { type: 'object' },
    },
  },
} as Meta;

const TEMPLATE: Story<SafeLineChartComponent> = (args) => ({
  template:
    '<div style="height:400px"><safe-line-chart [legend]="legend" [title]="title" [series]="series"></safe-line-chart></div>',
  props: {
    ...args,
  },
});

export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {
  series: [
    {
      color: '#a4e084',
      data: [
        {
          field: 8,
          category: 'Date 1',
          color: undefined,
        },
        {
          field: 7,
          category: 'Date 2',
          color: undefined,
        },
        {
          field: 19,
          category: 'Date 3',
          color: undefined,
        },
        {
          field: 16,
          category: 'Date 4',
          color: undefined,
        },
      ],
    },
    {
      data: [
        {
          field: 3,
          category: 'Date 1',
          color: '#FDA649',
        },
        {
          field: 12,
          category: 'Date 2',
          color: '#F4E683',
        },
        {
          field: 4,
          category: 'Date 3',
          color: '#B83C70',
        },
        {
          field: 6,
          category: 'Date 4',
          color: '#4DB3E4',
        },
      ],
    },
  ],
};
