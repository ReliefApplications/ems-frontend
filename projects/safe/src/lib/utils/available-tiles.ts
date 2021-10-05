import { SafeChartSettingsComponent } from '../components/widgets/chart-settings/chart-settings.component';
import { SafeSchedulerSettingsComponent } from '../components/widgets/scheduler-settings/scheduler-settings.component';
import { SafeGridSettingsComponent } from '../components/widgets/grid-settings/grid-settings.component';
import { SafeMapSettingsComponent } from '../components/widgets/map-settings/map-settings.component';
import { SafeEditorSettingsComponent } from '../components/widgets/editor-settings/editor-settings.component';

export const AVAILABLE_TILES = [
  {
    id: 'donut-chart',
    name: 'Donut chart',
    icon: 'donut',
    settings: {title: 'Donut chart', chart: {
      type: 'donut'
    }},
    defaultCols: 3,
    defaultRows: 3,
    component: 'chart',
    settingsTemplate: SafeChartSettingsComponent
  },
  {
    id: 'line-chart',
    name: 'Line chart',
    icon: 'line',
    settings: {title: 'Line chart', chart: {
      type: 'line'
    }},
    defaultCols: 3,
    defaultRows: 3,
    component: 'chart',
    settingsTemplate: SafeChartSettingsComponent
  },
  {
    id: 'pie-chart',
    name: 'Pie chart',
    icon: 'pie',
    settings: {title: 'Pie chart', chart: {
      type: 'pie'
    }},
    defaultCols: 3,
    defaultRows: 3,
    component: 'chart',
    settingsTemplate: SafeChartSettingsComponent
  },
  {
    id: 'grid',
    name: 'Grid',
    icon: 'grid',
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
    id: 'map',
    name: 'Map',
    icon: 'map',
    settings: {},
    defaultCols: 4,
    defaultRows: 4,
    component: 'map',
    settingsTemplate: SafeMapSettingsComponent
  },
  {
    id: 'text',
    name: 'Text',
    icon: 'text',
    settings: {title: 'Enter a title', text: 'Enter a content'},
    defaultCols: 3,
    defaultRows: 3,
    component: 'editor',
    settingsTemplate: SafeEditorSettingsComponent
  }
];
