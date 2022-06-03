import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeStepComponent } from './step.component';
import { SafeWorkflowStepperModule } from '../../workflow-stepper.module';
import { ContentType } from '../../../../models/page.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  component: SafeStepComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeWorkflowStepperModule, BrowserAnimationsModule],
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
const TEMPLATE: Story<SafeStepComponent> = (args) => ({
  props: {
    ...args,
  },
});

/** Story component */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.args = {
  step: {
    name: 'Dashboard',
    type: ContentType.dashboard,
  },
  active: true,
  canUpdate: true,
};
