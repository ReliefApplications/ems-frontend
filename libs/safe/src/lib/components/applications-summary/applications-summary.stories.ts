import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { SafeApplicationsSummaryComponent } from './applications-summary.component';
import { SafeApplicationsSummaryModule } from './applications-summary.module';
import { status } from '../../models/form.model';
import { StorybookTranslateModule } from '../storybook-translate/storybook-translate-module';

export default {
  component: SafeApplicationsSummaryComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeApplicationsSummaryModule, StorybookTranslateModule],
      providers: [],
    }),
  ],
  title: 'UI/Applications/Applications Summary',
  argTypes: {},
} as Meta;

/**
 * Defines a template for the component SafeApplicationsSummaryComponent to use as a playground
 *
 * @param args the properties of the instance of SafeApplicationsSummaryComponent
 * @returns the template
 */
const TEMPLATE: StoryFn<SafeApplicationsSummaryComponent> = (args) => ({
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
    canCreate: true,
    applications: [
      {
        name: 'Dummy Application',
        createdAt: new Date(),
        status: status.active,
      },
      {
        name: 'Dummy Application',
        createdAt: new Date(),
        status: status.pending,
      },
      {
        name: 'Dummy Application',
        createdAt: new Date(),
        status: status.archived,
      },
      {
        name: 'Dummy Application',
        createdAt: new Date(),
        status: status.active,
      },
      {
        name: 'Dummy Application',
        createdAt: new Date(),
      },
    ],
  },
};
