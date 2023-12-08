import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { AddStepComponent } from './add-step.component';
import { WorkflowStepperModule } from '../../workflow-stepper.module';
import { StorybookTranslateModule } from '../../../storybook-translate/storybook-translate-module';

export default {
  component: AddStepComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [WorkflowStepperModule, StorybookTranslateModule],
      providers: [],
    }),
  ],
  title: 'UI/Workflow/Add Step',
  argTypes: {},
} as Meta;

/**
 * Template for story component
 *
 * @param args Properties
 * @returns A story component
 */
const TEMPLATE: StoryFn<AddStepComponent> = (args) => ({
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
