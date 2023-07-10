import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { SafeApplicationSummaryComponent } from './application-summary.component';
import { SafeApplicationsSummaryModule } from '../../applications-summary.module';
import { status } from '../../../../models/form.model';
import { StorybookTranslateModule } from '../../../../components/storybook-translate/storybook-translate-module';

export default {
  component: SafeApplicationSummaryComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeApplicationsSummaryModule, StorybookTranslateModule],
      providers: [],
    }),
  ],
  title: 'UI/Applications/Application Summary',
  argTypes: {},
} as Meta;

/**
 * Defines a template for the component SafeApplicationSummaryComponent to use as a playground
 *
 * @param args the properties of the instance of SafeApplicationSummaryComponent
 * @returns the template
 */
const TEMPLATE: StoryFn<SafeApplicationSummaryComponent> = (args) => ({
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
    application: {
      name: 'Dummy Application',
      createdAt: new Date(),
      status: status.active,
    },
  },
};
