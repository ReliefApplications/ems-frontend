import { Meta, moduleMetadata, Story } from '@storybook/angular';
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
const TEMPLATE: Story<SafeWorkflowStepperComponent> = (args) => ({
  props: {
    ...args,
  },
});

/** The story component */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {
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
};
