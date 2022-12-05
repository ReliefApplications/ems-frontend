import {
  BubbleDataPoint,
  Chart,
  ChartTypeRegistry,
  ScatterDataPoint,
  PointStyle,
  LegendItem,
} from 'chart.js';

/** Default legend label props */
const DEFAULT_LEGEND_LABEL: Partial<LegendItem> = {
  lineWidth: 0,
  borderRadius: 4,
  pointStyle: 'rectRounded' as PointStyle,
};

/** Default max size for chart legend */
const MAX_LABEL_LENGTH = 20;

/**
 * Gets a function for label generation for a chart
 *
 * @param usingSeries whether the chart has series setup
 * @returns the legend labels
 */
const getGeneratorFunction =
  (usingSeries = false) =>
  (
    chart: Chart<
      keyof ChartTypeRegistry,
      (number | ScatterDataPoint | BubbleDataPoint | null)[],
      unknown
    >
  ) => {
    const data = chart.data;
    if (!data.labels?.length || !data.datasets.length || !chart.legend)
      return [];
    const color = chart.legend.options.labels.color;
    const labels = usingSeries
      ? data.datasets.map((x) => x.label)
      : data.labels;

    return labels.map((label, i) => {
      const meta = chart.getDatasetMeta(usingSeries ? i : 0);
      const style = meta.controller.getStyle(i, true);
      const backgroundColor = usingSeries
        ? data.datasets[i]?.backgroundColor
        : (data.datasets[0]?.backgroundColor as any)?.[i];

      let newLabel = '';
      if (typeof label === 'string')
        newLabel =
          label.length > MAX_LABEL_LENGTH
            ? label.substring(0, MAX_LABEL_LENGTH) + '...'
            : label;

      return {
        ...DEFAULT_LEGEND_LABEL,
        text: newLabel,
        index: usingSeries ? undefined : i,
        datasetIndex: usingSeries ? i : undefined,
        fillStyle: backgroundColor || (style.borderColor as string),
        fontColor: color,
      };
    });
  };

export default getGeneratorFunction;
