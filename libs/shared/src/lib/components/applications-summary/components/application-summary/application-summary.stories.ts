import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { ApplicationSummaryComponent } from './application-summary.component';
import { ApplicationsSummaryModule } from '../../applications-summary.module';
import { status } from '../../../../models/form.model';
import { StorybookTranslateModule } from '../../../storybook-translate/storybook-translate-module';
import { DateTranslateService } from '../../../../services/date-translate/date-translate.service';

export default {
  component: ApplicationSummaryComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ApplicationsSummaryModule, StorybookTranslateModule],
      providers: [DateTranslateService],
    }),
  ],
  title: 'UI/Applications/Application Summary',
  argTypes: {},
} as Meta;

/**
 * Defines a template for the component ApplicationSummaryComponent to use as a playground
 *
 * @param args the properties of the instance of ApplicationSummaryComponent
 * @returns the template
 */
const TEMPLATE: StoryFn<ApplicationSummaryComponent> = (args) => ({
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
