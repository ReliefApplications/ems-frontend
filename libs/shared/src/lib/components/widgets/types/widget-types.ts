/**
 * Widget types
 */
export const widgetTypes = [
  'chart',
  'editor',
  'grid',
  'map',
  'summaryCard',
  'tabs',
] as const;
export type WidgetType = (typeof widgetTypes)[number];
