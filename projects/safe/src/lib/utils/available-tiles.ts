import { SafeChartSettingsComponent } from '../components/widgets/chart-settings/chart-settings.component';
import { SafeSchedulerSettingsComponent } from '../components/widgets/scheduler-settings/scheduler-settings.component';
import { SafeGridSettingsComponent } from '../components/widgets/grid-settings/grid-settings.component';
import { SafeMapSettingsComponent } from '../components/widgets/map-settings/map-settings.component';
import { SafeEditorSettingsComponent } from '../components/widgets/editor-settings/editor-settings.component';

export const AVAILABLE_TILES = [
  // {
  //   name: 'BAR CHART',
  //   icon: 'bar_chart',
  //   settings: {
  //     title: 'Bar chart',
  //     chart: {
  //       type: 'bar'
  //     }
  //   },
  //   defaultCols: 3,
  //   defaultRows: 3,
  //   component: 'chart',
  //   settingsTemplate: SafeChartSettingsComponent
  // },
  {
    name: 'DONUT CHART',
    icon: 'donut_small',
    settings: {title: 'Donut chart', chart: {
      type: 'donut'
    }},
    defaultCols: 3,
    defaultRows: 3,
    component: 'chart',
    settingsTemplate: SafeChartSettingsComponent
  },
  {
    name: 'LINE CHART',
    icon: 'show_chart',
    settings: {title: 'Line chart', chart: {
      type: 'line'
    }},
    defaultCols: 3,
    defaultRows: 3,
    component: 'chart',
    settingsTemplate: SafeChartSettingsComponent
  },
  {
    name: 'PIE CHART',
    icon: 'pie_chart',
    settings: {title: 'Pie chart', chart: {
      type: 'pie'
    }},
    defaultCols: 3,
    defaultRows: 3,
    component: 'chart',
    settingsTemplate: SafeChartSettingsComponent
  },
  // {
  //   name: 'SCATTER PLOT',
  //   icon: 'scatter_plot',
  //   settings: {title: 'Scatter chart', chart: {
  //     type: 'scatter'
  //   }},
  //   defaultCols: 2,
  //   defaultRows: 2,
  //   component: 'chart',
  //   settingsTemplate: SafeChartSettingsComponent
  // },
  // {
  //   name: 'SCHEDULER',
  //   icon: 'schedule',
  //   settings: {title: 'Scheduler'},
  //   defaultCols: 3,
  //   defaultRows: 3,
  //   component: 'scheduler',
  //   settingsTemplate: SafeSchedulerSettingsComponent
  // },
  {
    name: 'GRID',
    icon: 'view_column',
    settings: {
      title: 'New grid',
      sortable: false,
      from: 'resource',
      pageable: false,
      source: null,
      fields: [],
      toolbar: false,
      canAdd: false
    },
    defaultCols: 8,
    defaultRows: 4,
    component: 'grid',
    settingsTemplate: SafeGridSettingsComponent
  },
  {
    name: 'MAP',
    icon: 'explore',
    settings: {},
    defaultCols: 4,
    defaultRows: 4,
    component: 'map',
    settingsTemplate: SafeMapSettingsComponent
  },
  {
    name: 'TEXT',
    icon: 'text_fields',
    settings: {title: 'Enter a title', text: 'Enter a content'},
    defaultCols: 3,
    defaultRows: 3,
    component: 'editor',
    settingsTemplate: SafeEditorSettingsComponent
  }
];
