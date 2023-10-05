import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { EmptyComponent } from './empty.component';
import { EmptyModule } from './empty.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  component: EmptyComponent,
  decorators: [
    moduleMetadata({
      imports: [EmptyModule, BrowserAnimationsModule],
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
const TEMPLATE: StoryFn<EmptyComponent> = (args) => ({
  // template: '<shared-empty></shared-empty></div>',
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
  args: {},
};
