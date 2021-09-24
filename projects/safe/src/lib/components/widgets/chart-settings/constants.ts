import { Pie } from './charts/pie';

export const CHART_TYPES = [
    // {
    //     name: 'bar',
    //     icon: 'bar_chart',
    //     class: Pie
    // },
    {
        name: 'donut',
        icon: 'donut_small',
        class: Pie
    },
    {
        name: 'line',
        icon: 'show_chart',
        class: Pie
    },
    {
        name: 'pie',
        icon: 'pie_chart',
        class: Pie
    },
    // {
    //     name: 'scatter',
    //     icon: 'scatter_plot',
    //     class: Pie
    // }
];

export const LEGEND_POSITIONS = [
    {
        value: 'top',
        icon: 'vertical_align_top'
    },
    {
        value: 'bottom',
        icon: 'vertical_align_bottom'
    },
    {
        value: 'left',
        icon: 'align_horizontal_left'
    },
    {
        value: 'right',
        icon: 'align_horizontal_right'
    }
];

export const LEGEND_ORIENTATIONS = [
    {
        value: 'vertical',
        icon: 'vertical_distribute'
    },
    {
        value: 'horizontal',
        icon: 'horizontal_distribute'
    }
];

export const TITLE_POSITIONS = [
    {
        value: 'top',
        icon: 'vertical_align_top'
    },
    {
        value: 'bottom',
        icon: 'vertical_align_bottom'
    }
];
