import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { WIDGET_TYPES } from '../../models/dashboard.model';
import { WidgetGridComponent } from './widget-grid.component';
import { WidgetGridModule } from './widget-grid.module';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { Apollo } from 'apollo-angular';

/**
 * Export default metadata
 */
const environment = {
  module: 'backoffice',
};
export default {
  component: WidgetGridComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, WidgetGridModule],
      providers: [
        { provide: 'environment', useValue: environment },
        DashboardService,
        Apollo,
      ],
    }),
  ],
  title: 'Dashboard/Widget Grid',
  argTypes: {
    widgetTypes: { table: { disable: true } },
  },
} as Meta;

/**
 * Template for the story component
 *
 * @param args Properties
 * @returns A story component
 */
const TEMPLATE: StoryFn<WidgetGridComponent> = (args) => ({
  props: {
    ...args,
    widgetTypes: WIDGET_TYPES,
  },
});

/** List of default widgets */
const defaultWidgets = [
  {
    id: 0,
    settings: {
      title: 'Widget 0',
      chart: {
        type: 'bar',
      },
    },
    component: 'chart',
    defaultCols: 3,
    defaultRows: 1,
  },
  {
    id: 1,
    settings: {
      title: 'Widget 1',
      chart: {
        type: 'bar',
      },
    },
    component: 'chart',
    defaultCols: 3,
    defaultRows: 1,
  },
  {
    id: 2,
    settings: {
      title: 'Widget 2',
    },
    component: 'map',
    defaultCols: 2,
    defaultRows: 1,
  },
];

/**
 * Default story.
 */
export const DEFAULT = {
  render: TEMPLATE,
  name: 'Default',

  args: {
    canUpdate: true,
    widgets: defaultWidgets,
  },
};

/**
 * Empty story.
 */
export const EMPTY = {
  render: TEMPLATE,
  name: 'Empty grid',

  args: {
    canUpdate: true,
    widgets: [],
  },
};
