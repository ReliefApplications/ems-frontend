import { Meta, moduleMetadata, Story } from '@storybook/angular';
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
  template:
    '<div style="height:400px"><safe-pie-donut-chart [legend]="legend" [title]="title" [series]="series"></safe-pie-donut-chart></div>',
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
