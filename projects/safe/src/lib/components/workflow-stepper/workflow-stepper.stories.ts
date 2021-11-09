import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { SafeWorkflowStepperComponent } from './workflow-stepper.component';
import { SafeWorkflowStepperModule } from './workflow-stepper.module';

export default {
    component: SafeWorkflowStepperComponent,
    decorators: [
        moduleMetadata({
            imports: [
                SafeWorkflowStepperModule
            ],
            providers: []
        }),
        withKnobs
    ],
    title: 'UI/Workflow/Stepper',
    argTypes: {}
} as Meta;

const Template: Story<SafeWorkflowStepperComponent> = args => ({
    props: {
        ...args
    }
});

export const Default = Template.bind({});
Default.args = {};
