import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { SafeAddApplicationComponent } from './add-application.component';
import { SafeApplicationsSummaryModule } from '../../applications-summary.module';
import { StorybookTranslateModule } from '../../../../components/storybook-translate/storybook-translate-module';

export default {
  component: SafeAddApplicationComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeApplicationsSummaryModule, StorybookTranslateModule],
      providers: [],
    }),
  ],
  title: 'UI/Applications/Add Application',
  argTypes: {},
} as Meta;

/**
 * Defines a template for the component SafeAddApplicationComponent to use as a playground
 *
 * @param args the properties of the instance of of SafeAddApplicationComponent
 * @returns the template
 */
const TEMPLATE: StoryFn<SafeAddApplicationComponent> = (args) => ({
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
