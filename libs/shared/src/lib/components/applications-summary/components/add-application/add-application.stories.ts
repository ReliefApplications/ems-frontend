import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { AddApplicationComponent } from './add-application.component';
import { ApplicationsSummaryModule } from '../../applications-summary.module';
import { StorybookTranslateModule } from '../../../storybook-translate/storybook-translate-module';

export default {
  component: AddApplicationComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ApplicationsSummaryModule, StorybookTranslateModule],
      providers: [],
    }),
  ],
  title: 'UI/Applications/Add Application',
  argTypes: {},
} as Meta;

/**
 * Defines a template for the component AddApplicationComponent to use as a playground
 *
 * @param args the properties of the instance of of AddApplicationComponent
 * @returns the template
 */
const TEMPLATE: StoryFn<AddApplicationComponent> = (args) => ({
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
