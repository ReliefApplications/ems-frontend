import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { SafeAddApplicationComponent } from './add-application.component';
import { SafeApplicationsSummaryModule } from '../../applications-summary.module';

export default {
    component: SafeAddApplicationComponent,
    decorators: [
        moduleMetadata({
            imports: [
                SafeApplicationsSummaryModule
            ],
            providers: []
        }),
        withKnobs
    ],
    title: 'UI/Applications/Add Application',
    argTypes: {}
} as Meta;

const Template: Story<SafeAddApplicationComponent> = args => ({
    props: {
        ...args
    }
});

export const Default = Template.bind({});
Default.args = {};
