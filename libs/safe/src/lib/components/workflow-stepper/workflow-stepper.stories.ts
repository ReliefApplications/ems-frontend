import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { SafeWorkflowStepperComponent } from './workflow-stepper.component';
import { SafeWorkflowStepperModule } from './workflow-stepper.module';
import { ContentType } from '../../models/page.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StorybookTranslateModule } from '../../components/storybook-translate/storybook-translate-module';

export default {
  component: SafeWorkflowStepperComponent,
  decorators: [
    moduleMetadata({
      imports: [
        SafeWorkflowStepperModule,
        BrowserAnimationsModule,
        StorybookTranslateModule,
      ],
      providers: [],
    }),
  ],
  title: 'UI/Workflow/Stepper',
  argTypes: {},
} as Meta;

/**
 * Template for story component
 *
 * @param args properties
 * @returns A story component
 */
const TEMPLATE: StoryFn<SafeWorkflowStepperComponent> = (args) => ({
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
    canUpdate: true,
    steps: [
      {
        name: 'Dashboard 1',
        type: ContentType.dashboard,
      },
      {
        name: 'Form 1',
        type: ContentType.form,
      },
      {
        name: 'Dashboard 2',
        type: ContentType.dashboard,
      },
      {
        name: 'Form 2',
        type: ContentType.form,
      },
    ],
  },
};
