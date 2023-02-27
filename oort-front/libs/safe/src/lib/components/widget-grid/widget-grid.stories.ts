import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { WIDGET_TYPES } from '../../models/dashboard.model';
import { SafeWidgetGridComponent } from './widget-grid.component';
import { SafeWidgetGridModule } from './widget-grid.module';

export default {
  component: SafeWidgetGridComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, SafeWidgetGridModule],
      providers: [],
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
const TEMPLATE: Story<SafeWidgetGridComponent> = (args) => ({
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

/** Export a story component */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {
  canUpdate: true,
  widgets: defaultWidgets,
};

/** Export a story component */
export const EMPTY = TEMPLATE.bind({});
EMPTY.storyName = 'Empty grid';
EMPTY.args = {
  canUpdate: true,
  widgets: [],
};
