import { Pie } from './charts/pie';

export const CHART_TYPES = [
    {
        name: 'donut',
        icon: '/assets/donut.svg',
        class: Pie
    },
    {
        name: 'column',
        icon: '/assets/column.svg',
        class: Pie
    },
    {
        name: 'line',
        icon: '/assets/line.svg',
        class: Pie
    },
    {
        name: 'pie',
        icon: '/assets/pie.svg',
        class: Pie
    },
    {
        name: 'bar',
        icon: '/assets/bar.svg',
        class: Pie
    }
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
