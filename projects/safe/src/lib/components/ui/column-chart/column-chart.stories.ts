import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeColumnChartComponent } from './column-chart.component';
import { SafeColumnChartModule } from './column-chart.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  component: SafeColumnChartComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeColumnChartModule, BrowserAnimationsModule],
      providers: [],
    }),
  ],
  title: 'UI/Charts/Column Chart',
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

/**
 * Template used by storybook to display the component in stories.
 *
 * @param args story arguments
 * @returns story template
 */
const TEMPLATE: Story<SafeColumnChartComponent> = (args) => ({
  template:
    '<div style="height:400px"><safe-column-chart [legend]="legend" [title]="title" [series]="series"></safe-column-chart></div>',
  props: {
    ...args,
  },
});

/**
 * Default template
 */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {
  legend: { visible: true, orientation: 'horizontal', position: 'bottom' },
  title: { visible: true, text: 'title', position: 'bottom' },
  series: [
    {
      name: 'Serie 1',
      data: [
        {
          field: 8,
          category: 'category 1',
        },
        {
          field: 7,
          category: 'category 2',
        },
        {
          field: 19,
          category: 'category 3',
        },
        {
          field: 16,
          category: 'category 4',
        },
      ],
    },
    {
      name: 'Serie 2',
      color: '#F4E683',
      data: [
        {
          field: 8,
          category: 'category 1',
        },
        {
          field: 7,
          category: 'category 2',
        },
        {
          field: 19,
          category: 'category 3',
        },
        {
          field: 16,
          category: 'category 4',
        },
      ],
    },
    {
      name: 'Serie 3',
      data: [
        {
          field: 8,
          category: 'category 1',
        },
        {
          field: 7,
          category: 'category 2',
        },
        {
          field: 19,
          category: 'category 5',
        },
        {
          field: 16,
          category: 'category 6',
        },
      ],
    },
  ],
};
