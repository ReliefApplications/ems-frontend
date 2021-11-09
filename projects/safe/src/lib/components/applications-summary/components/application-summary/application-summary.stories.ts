import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { SafeApplicationSummaryComponent } from './application-summary.component';
import { SafeApplicationsSummaryModule } from '../../applications-summary.module';
import { status } from '../../../../models/form.model';

export default {
    component: SafeApplicationSummaryComponent,
    decorators: [
        moduleMetadata({
            imports: [
                SafeApplicationsSummaryModule
            ],
            providers: []
        }),
        withKnobs
    ],
    title: 'UI/Applications/Application Summary',
    argTypes: {}
} as Meta;

const Template: Story<SafeApplicationSummaryComponent> = args => ({
    props: {
        ...args
    }
});

export const Default = Template.bind({});
Default.args = {
    application: {
        name: 'Dummy Application',
        createdAt: new Date(),
        usersCount: 250,
        status: status.active
    }
};
