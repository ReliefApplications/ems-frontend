/** Types for tooltip examples button positions */
export const tooltipExamplesPositions = [
  'top',
  'top-left',
  'top-right',
  'right',
  'left',
  'bottom',
  'bottom-left',
  'bottom-right',
] as const;
export type TooltipExamplesPosition = (typeof tooltipExamplesPositions)[number];
