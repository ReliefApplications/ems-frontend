import { Pie } from './charts/pie';

/** List of all the widget types of chart */
export const CHART_TYPES = [
  {
    name: 'donut',
    icon: '/assets/donut.svg',
    class: Pie,
  },
  {
    name: 'column',
    icon: '/assets/column.svg',
    class: Pie,
  },
  {
    name: 'line',
    icon: '/assets/line.svg',
    class: Pie,
  },
  {
    name: 'pie',
    icon: '/assets/pie.svg',
    class: Pie,
  },
  {
    name: 'polar',
    icon: '/assets/pie.svg',
    class: Pie,
  },
  {
    name: 'radar',
    icon: '/assets/pie.svg',
    class: Pie,
  },
  {
    name: 'bar',
    icon: '/assets/bar.svg',
    class: Pie,
  },
];

/** List of available positions for the legend in charts */
export const LEGEND_POSITIONS = [
  {
    value: 'top',
    icon: 'vertical_align_top',
  },
  {
    value: 'bottom',
    icon: 'vertical_align_bottom',
  },
  {
    value: 'left',
    icon: 'align_horizontal_left',
  },
  {
    value: 'right',
    icon: 'align_horizontal_right',
  },
];

/** List of available title positions */
export const TITLE_POSITIONS = [
  {
    value: 'top',
    icon: 'vertical_align_top',
  },
  {
    value: 'bottom',
    icon: 'vertical_align_bottom',
  },
];
