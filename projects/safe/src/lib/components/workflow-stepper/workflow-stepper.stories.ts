import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeWorkflowStepperComponent } from './workflow-stepper.component';
import { SafeWorkflowStepperModule } from './workflow-stepper.module';
import { ContentType } from '../../models/page.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  component: SafeWorkflowStepperComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeWorkflowStepperModule, BrowserAnimationsModule],
      providers: [],
    }),
  ],
  title: 'UI/Workflow/Stepper',
  argTypes: {},
} as Meta;

const TEMPLATE: Story<SafeWorkflowStepperComponent> = (args) => ({
  props: {
    ...args,
  },
});

export const DEFAULT = TEMPLATE.bind({});
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
