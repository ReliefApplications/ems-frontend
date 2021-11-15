import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { SafeWorkflowStepperComponent } from './workflow-stepper.component';
import { SafeWorkflowStepperModule } from './workflow-stepper.module';
import { ContentType } from '../../models/page.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
    component: SafeWorkflowStepperComponent,
    decorators: [
        moduleMetadata({
            imports: [
                SafeWorkflowStepperModule,
                BrowserAnimationsModule
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
Default.args = {
    canUpdate: true,
    steps: [
        {
            name: 'Dashboard 1',
            type: ContentType.dashboard
        },
        {
            name: 'Form 1',
            type: ContentType.form
        },
        {
            name: 'Dashboard 2',
            type: ContentType.dashboard
        },
        {
            name: 'Form 2',
            type: ContentType.form
        }
    ]
};
