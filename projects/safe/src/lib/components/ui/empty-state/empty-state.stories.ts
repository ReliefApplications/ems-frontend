import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeEmptyStateComponent } from './empty-state.component';
import { SafeEmptyStateModule } from './empty-state.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  component: SafeEmptyStateComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeEmptyStateModule, BrowserAnimationsModule],
      providers: [],
    }),
  ],
  title: 'UI/Charts/Donut Chart',
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
const TEMPLATE: Story<SafeEmptyStateComponent> = (args) => ({
  template: '<safe-empty-state></safe-empty-state></div>',
  props: {
    ...args,
  },
});

/**
 * Sets the template as the default state of the component
 */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {};
