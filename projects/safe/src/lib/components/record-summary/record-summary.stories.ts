import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { SafeRecordSummaryModule } from './record-summary.module';
import { SafeRecordSummaryComponent } from './record-summary.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
    component: SafeRecordSummaryComponent,
    decorators: [
        moduleMetadata({
            imports: [
                BrowserAnimationsModule,
                SafeRecordSummaryModule
            ],
            providers: []
        }),
        withKnobs
    ],
    title: 'Form/Record Summary',
    argTypes: {
        record: {
            control: { type: 'object' }
        },
        cacheDate: {
            control: { type: 'date' }
        }
    }
} as Meta;

const TEMPLATE: Story<SafeRecordSummaryComponent> = args => ({
    props: {
        ...args
    }
});

export const DEFAULT = TEMPLATE.bind({});
DEFAULT.args = {
    record: {
        createdBy: {
            name: 'Dummy'
        },
        createdAt: new Date(),
        modifiedBy: {
            name: 'Dummy'
        },
        modifiedAt: new Date()
    },
    cacheDate: new Date()
};

export const CACHE_ONLY = TEMPLATE.bind({});
CACHE_ONLY.args = {
    cacheDate: new Date()
};

export const WITHOUT_CACHE = TEMPLATE.bind({});
WITHOUT_CACHE.args = {
    record: {
        createdBy: {
            name: 'Dummy'
        },
        createdAt: new Date(),
        modifiedBy: {
            name: 'Dummy'
        },
        modifiedAt: new Date()
    }
};
