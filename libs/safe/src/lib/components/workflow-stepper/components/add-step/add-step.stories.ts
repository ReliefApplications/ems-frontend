import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { SafeAddStepComponent } from './add-step.component';
import { SafeWorkflowStepperModule } from '../../workflow-stepper.module';
import { StorybookTranslateModule } from '../../../../components/storybook-translate/storybook-translate-module';

export default {
  component: SafeAddStepComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeWorkflowStepperModule, StorybookTranslateModule],
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
const TEMPLATE: StoryFn<SafeAddStepComponent> = (args) => ({
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
