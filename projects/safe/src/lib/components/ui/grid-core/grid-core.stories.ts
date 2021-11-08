import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { SafeGridCoreComponent } from './grid-core.component';
import { SafeGridCoreModule } from './grid-core.module';

export default {
    component: SafeGridCoreComponent,
    decorators: [
        moduleMetadata({
            imports: [
                SafeGridCoreModule
            ],
            providers: []
        }),
        withKnobs
    ],
    title: 'UI/Charts/Line Chart',
    argTypes: {
        series: {
            control: { type: 'object' }
        },
        legend: {
            control: { type: 'object' }
        },
        title: {
            control: { type: 'object' }
        }
    }
} as Meta;

const Template: Story<SafeGridCoreComponent> = args => ({
    props: {
        ...args
    }
});

export const Default = Template.bind({});
Default.args = {};
