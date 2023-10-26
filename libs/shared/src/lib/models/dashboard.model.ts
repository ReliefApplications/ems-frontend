import { Step } from './step.model';
import { Page } from './page.model';
import { ChartSettingsComponent } from '../components/widgets/chart-settings/chart-settings.component';
import { GridSettingsComponent } from '../components/widgets/grid-settings/grid-settings.component';
import { MapSettingsComponent } from '../components/widgets/map-settings/map-settings.component';
import { EditorSettingsComponent } from '../components/widgets/editor-settings/editor-settings.component';
import { SummaryCardSettingsComponent } from '../components/widgets/summary-card-settings/summary-card-settings.component';
import { Category, Variant } from '@oort-front/ui';
import { TabsSettingsComponent } from '../components/widgets/tabs-settings/tabs-settings.component';

/** Model for IWidgetType object */
export interface IWidgetType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

/** List of Widget types with their properties */
export const WIDGET_TYPES = [
  {
    id: 'donut-chart',
    name: 'Donut chart',
    icon: '/assets/donut.svg',
    color: '#3B8CC4',
    settings: {
      title: 'Donut chart widget',
      chart: {
        type: 'donut',
      },
    },
    defaultCols: 3,
    defaultRows: 3,
    minRow: 1,
    component: 'chart',
    settingsTemplate: ChartSettingsComponent,
  },
  {
    id: 'column-chart',
    name: 'Column chart',
    icon: '/assets/column.svg',
    color: '#EBA075',
    settings: {
      title: 'Column chart widget',
      chart: {
        type: 'column',
      },
    },
    defaultCols: 3,
    defaultRows: 3,
    minRow: 1,
    component: 'chart',
    settingsTemplate: ChartSettingsComponent,
  },
  {
    id: 'line-chart',
    name: 'Line chart',
    icon: '/assets/line.svg',
    color: '#F6C481',
    settings: {
      title: 'Line chart widget',
      chart: {
        type: 'line',
      },
    },
    defaultCols: 3,
    defaultRows: 3,
    minRow: 1,
    component: 'chart',
    settingsTemplate: ChartSettingsComponent,
  },
  {
    id: 'pie-chart',
    name: 'Pie chart',
    icon: '/assets/pie.svg',
    color: '#8CCDD5',
    settings: {
      title: 'Pie chart widget',
      chart: {
        type: 'pie',
      },
    },
    defaultCols: 3,
    defaultRows: 3,
    minRow: 1,
    component: 'chart',
    settingsTemplate: ChartSettingsComponent,
  },
  {
    id: 'polar-chart',
    name: 'Polar chart',
    icon: '/assets/pie.svg',
    color: '#8CCDD5',
    settings: {
      title: 'Polar chart widget',
      chart: {
        type: 'polar',
      },
    },
    defaultCols: 3,
    defaultRows: 3,
    minRow: 1,
    component: 'chart',
    settingsTemplate: ChartSettingsComponent,
  },
  {
    id: 'bar-chart',
    name: 'Bar chart',
    icon: '/assets/bar.svg',
    color: '#B5DC8D',
    settings: {
      title: 'Bar chart widget',
      chart: {
        type: 'bar',
      },
    },
    defaultCols: 3,
    defaultRows: 3,
    minRow: 1,
    component: 'chart',
    settingsTemplate: ChartSettingsComponent,
  },
  {
    id: 'radar-chart',
    name: 'Radar chart',
    icon: '/assets/pie.svg',
    color: '#8CCDD5',
    settings: {
      title: 'Radar chart widget',
      chart: {
        type: 'radar',
      },
    },
    defaultCols: 3,
    defaultRows: 3,
    minRow: 1,
    component: 'chart',
    settingsTemplate: ChartSettingsComponent,
  },
  {
    id: 'grid',
    name: 'Grid',
    icon: '/assets/grid.svg',
    color: '#AC8CD5',
    settings: {
      title: 'Grid widget',
      sortable: false,
      from: 'resource',
      pageable: false,
      source: null,
      fields: [],
      toolbar: false,
      canAdd: false,
    },
    defaultCols: 8,
    defaultRows: 4,
    minRow: 2,
    component: 'grid',
    settingsTemplate: GridSettingsComponent,
  },
  {
    id: 'map',
    name: 'Map',
    icon: '/assets/map.svg',
    color: '#D58CA6',
    settings: {
      title: 'Map widget',
    },
    defaultCols: 4,
    defaultRows: 4,
    minRow: 1,
    component: 'map',
    settingsTemplate: MapSettingsComponent,
  },
  {
    id: 'text',
    name: 'Text',
    icon: '/assets/text.svg',
    color: '#2F383E',
    settings: {
      title: 'Text widget',
      text: 'Enter a content',
    },
    defaultCols: 3,
    defaultRows: 3,
    minRow: 1,
    component: 'editor',
    settingsTemplate: EditorSettingsComponent,
  },
  {
    id: 'summaryCard',
    name: 'Summary card',
    icon: '/assets/summary-card.svg',
    color: '#99CBEF',
    settings: { title: 'Summary Card' },
    defaultCols: 3,
    defaultRows: 3,
    minRow: 1,
    component: 'summaryCard',
    settingsTemplate: SummaryCardSettingsComponent,
  },
  {
    id: 'tabs',
    name: 'Tabs',
    icon: '/assets/tab.svg',
    color: '#D5B38C',
    settings: { title: 'Tabs' },
    defaultCols: 8,
    defaultRows: 4,
    minRow: 2,
    component: 'tabs',
    settingsTemplate: TabsSettingsComponent,
  },
];

/** Model for Dashboard object. */
export interface Dashboard {
  id?: string;
  name?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  structure?: any;
  permissions?: any;
  canSee?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  page?: Page;
  step?: Step;
  showFilter?: boolean;
  buttons?: {
    text: string;
    href: string;
    variant: Variant;
    category: Category;
    openInNewTab: boolean;
  }[];
}

/** Model for dashboard graphql query response */
export interface DashboardQueryResponse {
  dashboard: Dashboard;
}

/** Model for add dashboard graphql mutation response */
export interface AddDashboardMutationResponse {
  addDashboard: Dashboard;
}

/** Model for edit dashboard graphql mutation response */
export interface EditDashboardMutationResponse {
  editDashboard: Dashboard;
}

/** Model for delete dashboard graphql mutation response */
export interface DeleteDashboardMutationResponse {
  deleteDashboard: Dashboard;
}

/** Model for dashboards graphql query response */
export interface DashboardsQueryResponse {
  dashboards: Dashboard[];
}

/** Model for create dashboard with context mutation response */
export interface CreateDashboardWithContextMutationResponse {
  addDashboardWithContext: Pick<Dashboard, 'id' | 'structure' | 'page'>;
}
