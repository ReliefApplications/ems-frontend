import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { SafeApplicationsSummaryComponent } from './applications-summary.component';
import { SafeApplicationsSummaryModule } from './applications-summary.module';
import { status } from '../../models/form.model';

export default {
    component: SafeApplicationsSummaryComponent,
    decorators: [
        moduleMetadata({
            imports: [
                SafeApplicationsSummaryModule
            ],
            providers: []
        }),
        withKnobs
    ],
    title: 'UI/Applications/Applications Summary',
    argTypes: {}
} as Meta;

const Template: Story<SafeApplicationsSummaryComponent> = args => ({
    props: {
        ...args
    }
});

export const Default = Template.bind({});
Default.args = {
    canCreate: true,
    applications: [
        {
            name: 'Dummy Application',
            createdAt: new Date(),
            usersCount: 250,
            status: status.active
        },
        {
            name: 'Dummy Application',
            createdAt: new Date(),
            usersCount: 250,
            status: status.pending
        },
        {
            name: 'Dummy Application',
            createdAt: new Date(),
            usersCount: 250,
            status: status.archived
        },
        {
            name: 'Dummy Application',
            createdAt: new Date(),
            usersCount: 250,
            status: status.active
        },
        {
            name: 'Dummy Application',
            createdAt: new Date(),
            usersCount: 250
        }
    ]
};
