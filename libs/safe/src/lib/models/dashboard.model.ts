import { Step } from './step.model';
import { Page } from './page.model';
import { Category, Variant } from '@oort-front/ui';
import {
  BarChartWidget,
  ColumnChartWidget,
  DonutChartWidget,
  EditorWidget,
  GridWidget,
  LineChartWidget,
  MapWidget,
  PieChartWidget,
  PolarChartWidget,
  RadarChartWidget,
  SummaryCardWidget,
  Widget,
} from './widgets/widget.model';
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
