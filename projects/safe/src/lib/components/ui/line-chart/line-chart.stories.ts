import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { SafeLineChartComponent } from './line-chart.component';
import { SafeLineChartModule } from './line-chart.module';

export default {
    component: SafeLineChartComponent,
    decorators: [
        moduleMetadata({
            imports: [
                SafeLineChartModule
            ],
            providers: []
        }),
        withKnobs
    ],
    title: 'UI/Line Chart',
} as Meta;

const Template: Story<SafeLineChartComponent> = args => ({
    template: '<safe-line-chart></safe-line-chart>',
    props: {
        ...args
    }
});

export const Default = Template.bind({});
Default.args = {
    series: [
        {
            color: '#a4e084',
            data: [
                {
                    field: 8,
                    category: 'Date 1',
                    color: undefined
                },
                {
                    field: 7,
                    category: 'Date 2',
                    color: undefined
                },
                {
                    field: 19,
                    category: 'Date 3',
                    color: undefined
                },
                {
                    field: 16,
                    category: 'Date 4',
                    color: undefined
                }
            ]
        },
        {
            data: [
                {
                    field: 3,
                    category: 'Date 1',
                    color: '#FDA649'
                },
                {
                    field: 12,
                    category: 'Date 2',
                    color: '#F4E683'
                },
                {
                    field: 4,
                    category: 'Date 3',
                    color: '#B83C70'
                },
                {
                    field: 6,
                    category: 'Date 4',
                    color: '#4DB3E4'
                }
            ]
        }
    ]
};
