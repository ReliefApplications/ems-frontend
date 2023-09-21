/**
 * Interface containing the settings of the chart title
 */
export interface ChartTitle {
  text: string;
  position: 'top' | 'bottom';
  font: string;
  color: string;
}

/**
 * Interface containing the settings of the chart legend
 */
export interface ChartLegend {
  visible: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
}
