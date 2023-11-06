import {
  Meta,
  moduleMetadata,
  StoryFn,
  componentWrapperDecorator,
} from '@storybook/angular';
import { LineChartComponent } from './line-chart.component';
import { LineChartModule } from './line-chart.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  component: LineChartComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LineChartModule, BrowserAnimationsModule],
      providers: [],
    }),
    componentWrapperDecorator((story) => `<div class="h-96">${story}</div>`),
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

/**
 * Stories template used to render the component
 *
 * @param args Arguments used by the component
 * @returns Returns an object used as the stories template
 */
const TEMPLATE: StoryFn<LineChartComponent> = (args) => ({
  props: {
    ...args,
  },
});

/**
 * Default story.
 */
export const DEFAULT = {
  render: TEMPLATE,
  name: 'Default',

  args: {
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
  },
};
