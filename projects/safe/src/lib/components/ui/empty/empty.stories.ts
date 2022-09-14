import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeEmptyComponent } from './empty.component';
import { SafeEmptyModule } from './empty.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  component: SafeEmptyComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeEmptyModule, BrowserAnimationsModule],
      providers: [],
    }),
  ],
  title: 'UI/Empty',
  // argTypes: {
  //   series: {
  //     control: { type: 'object' },
  //   },
  //   legend: {
  //     control: { type: 'object' },
  //   },
  //   title: {
  //     control: { type: 'object' },
  //   },
  // },
} as Meta;

/**
 * Stories template used to render the component
 *
 * @param args Arguments used by the component
 * @returns Returns an object used as the stories template
 */
const TEMPLATE: Story<SafeEmptyComponent> = (args) => ({
  // template: '<safe-empty></safe-empty></div>',
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
