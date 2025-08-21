import { Step } from './step.model';
import { Page } from './page.model';
import { EventEmitter } from '@angular/core';
import { ActionButton } from '../components/action-button/action-button.type';

/** Model for IWidgetType object */
export interface IWidgetType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

/** Model for the dashboard filter */
export interface DashboardFilter {
  variant?: string;
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

/** Available widget type component */
export type WidgetTypeComponent =
  | 'chart'
  | 'grid'
  | 'map'
  | 'editor'
  | 'summaryCard'
  | 'tabs'
  | 'file-explorer';

/**
 * Widget type interface
 *
 * @property {string} id widget type identifier
 * @property {string} name display name
 * @property {string} icon display icon
 * @property {string} color display color
 * @property {any} settings default settings
 * @property {number} cols number of default columns
 * @property {number} rows number of default rows
 * @property {number} minItemRows minimum number of rows the widget should use
 * @property {WidgetTypeComponent} component Angular component identifier
 */
export interface WidgetType {
  id: string;
  name: string;
  icon: string;
  color: string;
  settings: any;
  cols: number;
  rows: number;
  minItemRows: number;
  component: WidgetTypeComponent;
}

/** List of Widget types with their properties */
export const WIDGET_TYPES: WidgetType[] = [
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
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'chart',
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
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'chart',
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
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'chart',
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
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'chart',
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
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'chart',
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
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'chart',
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
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'chart',
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
    cols: 8,
    rows: 4,
    minItemRows: 2,
    component: 'grid',
  },
  {
    id: 'map',
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
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'editor',
  },
  {
    id: 'summaryCard',
    name: 'Summary card',
    icon: '/assets/summary-card.svg',
    color: '#99CBEF',
    settings: { title: 'Summary Card' },
    cols: 3,
    rows: 3,
    minItemRows: 1,
    component: 'summaryCard',
  },
  {
    id: 'tabs',
    name: 'Tabs',
    icon: '/assets/tab.svg',
    color: '#D5B38C',
    settings: { title: 'Tabs' },
    cols: 8,
    rows: 4,
    minItemRows: 2,
    component: 'tabs',
  },
  {
    id: 'file-explorer',
    name: 'File Explorer',
    icon: '/assets/file-explorer.svg',
    color: '#D58080',
    settings: { title: 'File Explorer' },
    cols: 8,
    rows: 4,
    minItemRows: 2,
    component: 'file-explorer',
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
  contextData?: {
    [key: string]: any;
  };
  buttons?: ActionButton[];
  filter?: DashboardFilter;
  gridOptions?: any;
  defaultTemplate?: boolean;
}

/** Model for dashboard graphql query response */
export interface DashboardQueryResponse {
  dashboard: Dashboard;
}

/** Model for dashboards graphql query response */
export interface DashboardsQueryResponse {
  dashboards: Dashboard[];
}

/** Model for add dashboard template graphql mutation response */
export interface AddDashboardTemplateMutationResponse {
  addDashboardTemplate: Dashboard;
}

/** Model for delete dashboard templates graphql mutation response */
export interface DeleteDashboardTemplatesMutationResponse {
  deleteDashboardTemplates: number;
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

export type DashboardQueryType = {
  query: any;
  variables: {
    id: string;
    contextEl?: string | number | null;
  };
};

export type DashboardTemplate = ({ element: string } | { record: string }) & {
  content: string;
  name?: string;
};
