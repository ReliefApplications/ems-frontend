import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { SafePieChartComponent } from './pie-chart.component';
import { SafePieChartModule } from './pie-chart.module';

export default {
    component: SafePieChartComponent,
    decorators: [
        moduleMetadata({
            imports: [
                SafePieChartModule
            ],
            providers: []
        }),
        withKnobs
    ],
    title: 'UI/Pie Chart',
} as Meta;

const Template: Story<SafePieChartComponent> = args => ({
    template: '<safe-pie-chart></safe-pie-chart>',
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
                    field: 2,
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
