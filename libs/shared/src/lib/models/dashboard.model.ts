import { Step } from './step.model';
import { Page } from './page.model';
import { ChartSettingsComponent } from '../components/widgets/chart-settings/chart-settings.component';
import { GridSettingsComponent } from '../components/widgets/grid-settings/grid-settings.component';
import { MapSettingsComponent } from '../components/widgets/map-settings/map-settings.component';
import { EditorSettingsComponent } from '../components/widgets/editor-settings/editor-settings.component';
import { SummaryCardSettingsComponent } from '../components/widgets/summary-card-settings/summary-card-settings.component';
import { Category, Variant } from '@oort-front/ui';
import { TabsSettingsComponent } from '../components/widgets/tabs-settings/tabs-settings.component';
import { EventEmitter } from '@angular/core';
import { FormSettingsComponent } from '../components/widgets/form-settings/form-settings.component';

/** Model for IWidgetType object */
export interface IWidgetType {
  widgetType: string;
  name: string;
  icon: string;
  color: string;
}

/** Model for the dashboard filter */
export interface DashboardFilter {
  variant?: Variant;
  show?: boolean;
  closable?: boolean;
  structure?: any;
  position?: string;
}

/** Widget settings types */
export type WidgetSettingsType = WidgetSettings<any>;

/**
 * Extended class of all widget settings components
 *
 * Implement this class for any widget settings class component that is created
 */
export abstract class WidgetSettings<T extends (...args: any[]) => any> {
  /** Change event emitted on widget settings form group value change */
  public formChange!: EventEmitter<ReturnType<T>>;
  /** Related widget property */
  public widget: any;
  /** Widget settings form group */
  public widgetFormGroup!: ReturnType<T>;
  /** Build settings form for the given widget type */
  public buildSettingsForm!: () => void;
}

/** List of Widget types with their properties */
export const WIDGET_TYPES = [
  {
    widgetType: 'form',
    name: 'Form',
    icon: '/assets/form.svg',
    color: '#C5D3FC',
    settings: {
      title: 'Form widget',
    },
    defaultCols: 4,
    defaultRows: 4,
    minRow: 1,
    component: 'form',
    settingsTemplate: FormSettingsComponent,
  },
  {
    widgetType: 'donut-chart',
    name: 'Donut chart',
    icon: '/assets/donut.svg',
    color: '#3B8CC4',
    settings: {
      title: 'Donut chart widget',
      chart: {
        type: 'donut',
      },
    },
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'chart',
    settingsTemplate: ChartSettingsComponent,
  },
  {
    widgetType: 'column-chart',
    name: 'Column chart',
    icon: '/assets/column.svg',
    color: '#EBA075',
    settings: {
      title: 'Column chart widget',
      chart: {
        type: 'column',
      },
    },
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'chart',
    settingsTemplate: ChartSettingsComponent,
  },
  {
    widgetType: 'line-chart',
    name: 'Line chart',
    icon: '/assets/line.svg',
    color: '#F6C481',
    settings: {
      title: 'Line chart widget',
      chart: {
        type: 'line',
      },
    },
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'chart',
    settingsTemplate: ChartSettingsComponent,
  },
  {
    widgetType: 'pie-chart',
    name: 'Pie chart',
    icon: '/assets/pie.svg',
    color: '#8CCDD5',
    settings: {
      title: 'Pie chart widget',
      chart: {
        type: 'pie',
      },
    },
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'chart',
    settingsTemplate: ChartSettingsComponent,
  },
  {
    widgetType: 'polar-chart',
    name: 'Polar chart',
    icon: '/assets/pie.svg',
    color: '#8CCDD5',
    settings: {
      title: 'Polar chart widget',
      chart: {
        type: 'polar',
      },
    },
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'chart',
    settingsTemplate: ChartSettingsComponent,
  },
  {
    widgetType: 'bar-chart',
    name: 'Bar chart',
    icon: '/assets/bar.svg',
    color: '#B5DC8D',
    settings: {
      title: 'Bar chart widget',
      chart: {
        type: 'bar',
      },
    },
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'chart',
    settingsTemplate: ChartSettingsComponent,
  },
  {
    widgetType: 'radar-chart',
    name: 'Radar chart',
    icon: '/assets/pie.svg',
    color: '#8CCDD5',
    settings: {
      title: 'Radar chart widget',
      chart: {
        type: 'radar',
      },
    },
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'chart',
    settingsTemplate: ChartSettingsComponent,
  },
  {
    widgetType: 'grid',
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
    cols: 8,
    rows: 4,
    minItemRows: 2,
    component: 'grid',
    settingsTemplate: GridSettingsComponent,
  },
  {
    widgetType: 'map',
    name: 'Map',
    icon: '/assets/map.svg',
    color: '#D58CA6',
    settings: {
      title: 'Map widget',
    },
    cols: 4,
    rows: 4,
    minItemRows: 1,
    component: 'map',
    settingsTemplate: MapSettingsComponent,
  },
  {
    widgetType: 'text',
    name: 'Text',
    icon: '/assets/text.svg',
    color: '#2F383E',
    settings: {
      title: 'Text widget',
      text: 'Enter a content',
    },
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'editor',
    settingsTemplate: EditorSettingsComponent,
  },
  {
    widgetType: 'summaryCard',
    name: 'Summary card',
    icon: '/assets/summary-card.svg',
    color: '#99CBEF',
    settings: { title: 'Summary Card' },
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'summaryCard',
    settingsTemplate: SummaryCardSettingsComponent,
  },
  {
    widgetType: 'tabs',
    name: 'Tabs',
    icon: '/assets/tab.svg',
    color: '#D5B38C',
    settings: { title: 'Tabs' },
    cols: 8,
    rows: 4,
    minItemRows: 2,
    component: 'tabs',
    settingsTemplate: TabsSettingsComponent,
  },
];

/** DashboardState interface */
export interface DashboardState {
  name: string;
  value?: any;
  id: string;
}

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
  contextData?: {
    [key: string]: any;
  };
  states?: DashboardState[];
  buttons?: {
    text: string;
    href: string;
    variant: Variant;
    category: Category;
    openInNewTab: boolean;
  }[];
  filter?: DashboardFilter;
  gridOptions?: any;
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
