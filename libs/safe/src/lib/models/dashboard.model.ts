import { Step } from './step.model';
import { Page } from './page.model';
import { Category, Variant } from '@oort-front/ui';
import { Widget } from './widgets/widget.model';
import {
  BarChartWidget,
  ColumnChartWidget,
  DonutChartWidget,
  LineChartWidget,
  PieChartWidget,
  PolarChartWidget,
  RadarChartWidget,
} from './widgets/chartWidget.model';
import { SummaryCardWidget } from './widgets/summaryCardWidget.model';
import { MapWidget } from './widgets/mapWidget.model';
import { GridWidget } from './widgets/gridWidget.model';
import { EditorWidget } from './widgets/editorWidget.model';
import { TabsWidget } from './widgets/tabWidget.model';

/** Model for IWidgetType object */
export interface IWidgetType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

/** List of Widget types with their properties */
export const WIDGET_TYPES: Widget[] = [
  new DonutChartWidget(),
  new ColumnChartWidget(),
  new LineChartWidget(),
  new PieChartWidget(),
  new PolarChartWidget(),
  new BarChartWidget(),
  new RadarChartWidget(),
  new GridWidget(),
  new MapWidget(),
  new EditorWidget(),
  new SummaryCardWidget(),
  new TabsWidget(),
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
