import { SafeChartSettingsComponent } from '../../components/widgets/chart-settings/chart-settings.component';
import { Widget, WidgetSettings } from './widget.model';

/**
 * Chart widget subclass
 */
export class ChartWidget extends Widget {
  public override settings!: ChartWidgetSettings;

  /**
   * Chart widget subclass
   *
   * @param id id of the widget
   * @param name name of the widget
   * @param icon icon of the widget
   * @param color color of the widget
   * @param settings settings of the chart widget
   */
  constructor(
    id: string,
    name: string,
    icon: string,
    color: string,
    settings: ChartWidgetSettings
  ) {
    super(
      id,
      name,
      icon,
      color,
      settings,
      3,
      3,
      1,
      'chart',
      SafeChartSettingsComponent
    );
  }
}

/** Donut chart subwidget */
export class DonutChartWidget extends ChartWidget {
  /** Donut chart subwidget */
  constructor() {
    super('donut-chart', 'Donut chart', '/assets/donut.svg', '#3B8CC4', {
      title: 'Donut chart widget',
      chart: {
        type: 'donut',
      },
    });
  }
}

/** Column chart subwidget */
export class ColumnChartWidget extends ChartWidget {
  /** Column chart subwidget */
  constructor() {
    super('column-chart', 'Column chart', '/assets/column.svg', '#EBA075', {
      title: 'Column chart widget',
      chart: {
        type: 'column',
      },
    });
  }
}

/** Line chart subwidget */
export class LineChartWidget extends ChartWidget {
  /** Line chart subwidget */
  constructor() {
    super('line-chart', 'Line chart', '/assets/line.svg', '#F6C481', {
      title: 'Line chart widget',
      chart: {
        type: 'line',
      },
    });
  }
}

/** Pie chart subwidget */
export class PieChartWidget extends ChartWidget {
  /** Pie chart subwidget */
  constructor() {
    super('pie-chart', 'Pie chart', '/assets/pie.svg', '#8CCDD5', {
      title: 'Pie chart widget',
      chart: {
        type: 'pie',
      },
    });
  }
}

/** Polar chart subwidget */
export class PolarChartWidget extends ChartWidget {
  /** Polar chart subwidget */
  constructor() {
    super('polar-chart', 'Polar chart', '/assets/pie.svg', '#8CCDD5', {
      title: 'Polar chart widget',
      chart: {
        type: 'polar',
      },
    });
  }
}

/** Bar chart subwidget */
export class BarChartWidget extends ChartWidget {
  /** Bar chart subwidget */
  constructor() {
    super('bar-chart', 'Bar chart', '/assets/bar.svg', '#B5DC8D', {
      title: 'Bar chart widget',
      chart: {
        type: 'bar',
      },
    });
  }
}

/** Radar chart subwidget */
export class RadarChartWidget extends ChartWidget {
  /** Radar chart subwidget */
  constructor() {
    super('radar-chart', 'Radar chart', '/assets/pie.svg', '#8CCDD5', {
      title: 'Radar chart widget',
      chart: {
        type: 'radar',
      },
    });
  }
}

/**
 * Chart widget settings
 */
export interface ChartWidgetSettings extends WidgetSettings {
  chart: ChartSettings;
}

/** Chart settings */
export interface ChartSettings {
  type: 'donut' | 'column' | 'radar' | 'bar' | 'line' | 'pie' | 'polar';
  aggregationId?: string;
  mapping?: any;
  legend?: {
    visible: boolean;
    position: string;
  };
  title?: {
    text: string | null;
    position: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    font: string;
    size: number;
    color: string | null;
  };
  palette?: {
    enabled: boolean;
    value: string[];
  };
  labels?: {
    showCategory: boolean;
    showValue: boolean;
    valueType: string;
  };
  grid?: {
    x: {
      display: boolean;
    };
    y: {
      display: boolean;
    };
  };
  axes?: {
    y: {
      enableMin: boolean;
      min: number | null;
      enableMax: boolean;
      max: number | null;
    };
    x: {
      enableMin: boolean;
      min: number | null;
      enableMax: boolean;
      max: number | null;
    };
  };
  stack?: {
    enable: boolean;
    usePercentage: boolean;
  };
  series?: any[]; // Define a proper type for series
}
