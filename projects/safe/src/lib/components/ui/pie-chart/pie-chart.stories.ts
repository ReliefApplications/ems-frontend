import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafePieChartComponent } from './pie-chart.component';
import { SafePieChartModule } from './pie-chart.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  component: SafePieChartComponent,
  decorators: [
    moduleMetadata({
      imports: [SafePieChartModule, BrowserAnimationsModule],
      providers: [],
    }),
  ],
  title: 'UI/Charts/Pie Chart',
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

const TEMPLATE: Story<SafePieChartComponent> = (args) => ({
  template:
    '<div style="height:400px"><safe-pie-chart [legend]="legend" [title]="title" [series]="series"></safe-pie-chart></div>',
  props: {
    ...args,
  },
});

export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {
  series: [
    {
      data: [
        {
          field: 2,
          category: 'category 1',
          color: '#FDA649',
        },
        {
          field: 7,
          category: 'category 2',
          color: '#F4E683',
        },
        {
          field: 19,
          category: 'category 3',
          color: '#B83C70',
        },
        {
          field: 16,
          category: 'category 4',
          color: '#4DB3E4',
        },
      ],
    },
  ],
};
