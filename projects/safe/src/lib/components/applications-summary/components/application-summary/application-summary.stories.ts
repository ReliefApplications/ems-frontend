import { Meta, moduleMetadata, Story } from '@storybook/angular';
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
        })
    ],
    title: 'UI/Applications/Application Summary',
    argTypes: {}
} as Meta;

const TEMPLATE: Story<SafeApplicationSummaryComponent> = args => ({
    props: {
        ...args
    }
});

export const DEFAULT = TEMPLATE.bind({});
DEFAULT.args = {
    application: {
        name: 'Dummy Application',
        createdAt: new Date(),
        usersCount: 250,
        status: status.active
    }
};
