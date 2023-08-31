/** Widget class */
export class Widget {
  /**
   * Widget class
   *
   * @param id id of the widget
   * @param name name of the widget
   * @param icon icon of the widget
   * @param color color of the widget
   * @param settings Settings for the widget
   * @param defaultCols default number of columns
   * @param defaultRows default number of rows
   * @param minRow minimum number of rows
   * @param component component to use as a template
   * @param settingsTemplate settings component to use as a template for settings
   */
  constructor(
    public id: string,
    public name: string,
    public icon: string,
    public color: string,
    public settings: WidgetSettings,
    public defaultCols: number,
    public defaultRows: number,
    public minRow: number,
    public component: 'chart' | 'grid' | 'editor' | 'map' | 'summaryCard',
    public settingsTemplate: any
  ) {}
}

/** Widget settings */
export interface WidgetSettings {
  title?: string | null;
  defaultLayout?: any;
  widgetDisplay?: any;
  record?: string | null;
  layout?: string | null;
  sortFields?: [];
}
