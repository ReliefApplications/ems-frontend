import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { SafeDonutChartComponent } from './donut-chart.component';
import { SafeDonutChartModule } from './donut-chart.module';

export default {
    component: SafeDonutChartComponent,
    decorators: [
        moduleMetadata({
            imports: [
                SafeDonutChartModule
            ],
            providers: []
        }),
        withKnobs
    ],
    title: 'UI/Donut Chart',
} as Meta;

const Template: Story<SafeDonutChartComponent> = args => ({
    template: '<safe-donut-chart></safe-donut-chart>',
    props: {
        ...args
    }
});

export const Default = Template.bind({});
Default.args = {
    series: [
        {
            data: [
                {
                    field: 8,
                    category: 'category 1',
                    color: undefined
                },
                {
                    field: 7,
                    category: 'category 2',
                    color: undefined
                },
                {
                    field: 19,
                    category: 'category 3',
                    color: undefined
                },
                {
                    field: 16,
                    category: 'category 4',
                    color: undefined
                }
            ]
        },
        {
            data: [
                {
                    field: 8,
                    category: 'category 1',
                    color: '#FDA649'
                },
                {
                    field: 7,
                    category: 'category 2',
                    color: '#F4E683'
                },
                {
                    field: 19,
                    category: 'category 3',
                    color: '#B83C70'
                },
                {
                    field: 16,
                    category: 'category 4',
                    color: '#4DB3E4'
                }
            ]
        }
    ]
};
