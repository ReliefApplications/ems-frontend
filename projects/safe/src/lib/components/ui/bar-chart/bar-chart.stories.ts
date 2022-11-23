import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeBarChartComponent } from './bar-chart.component';
import { SafeBarChartModule } from './bar-chart.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  component: SafeBarChartComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeBarChartModule, BrowserAnimationsModule],
      providers: [],
    }),
  ],
  title: 'UI/Charts/Bar Chart',
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
 * Template used by storybook to display the component.
 *
 * @param args story arguments
 * @returns storybook template
 */
const TEMPLATE: Story<SafeBarChartComponent> = (args) => ({
  template:
    '<div style="height:400px"><safe-bar-chart [legend]="legend" [title]="title" [series]="series"></safe-bar-chart></div>',
  props: {
    ...args,
  },
});

/**
 * Default story
 */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {
  legend: { visible: true, orientation: 'horizontal', position: 'bottom' },
  title: {
    visible: true,
    text: 'title',
    position: 'bottom',
    font: '',
    color: '',
  },
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
