import {
  Meta,
  moduleMetadata,
  Story,
  componentWrapperDecorator,
} from '@storybook/angular';
import { SafePieDonutChartComponent } from './pie-donut-chart.component';
import { SafePieDonutChartModule } from './pie-donut-chart.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  component: SafePieDonutChartComponent,
  decorators: [
    moduleMetadata({
      imports: [SafePieDonutChartModule, BrowserAnimationsModule],
      providers: [],
    }),
    componentWrapperDecorator((story) => `<div class="h-96">${story}</div>`),
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

/**
 * Stories template used to render the component
 *
 * @param args Arguments used by the component
 * @returns Returns an object used as the stories template
 */
const TEMPLATE: Story<SafePieDonutChartComponent> = (args) => ({
  props: {
    ...args,
  },
});

/**
 * Sets the template as the default state of the component
 */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {
  series: [
    {
      data: [
        {
          field: 2,
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
  ],
};

/**
 * Doughnut story.
 */
export const DOUGHNUT = TEMPLATE.bind({});
DOUGHNUT.storyName = 'Doughnut';
DOUGHNUT.args = {
  ...DEFAULT.args,
  chartType: 'doughnut',
};
