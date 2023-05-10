import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { SafeStepComponent } from './step.component';
import { SafeWorkflowStepperModule } from '../../workflow-stepper.module';
import { ContentType } from '../../../../models/page.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StorybookTranslateModule } from '../../../storybook-translate/storybook-translate-module';

export default {
  component: SafeStepComponent,
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
  title: 'UI/Workflow/Step',
  argTypes: {},
} as Meta;

/**
 * Template for story component
 *
 * @param args Properties
 * @returns A story component
 */
const TEMPLATE: StoryFn<SafeStepComponent> = (args) => ({
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
    step: {
      name: 'Dashboard',
      type: ContentType.dashboard,
    },
    active: true,
    canUpdate: true,
  },
};
