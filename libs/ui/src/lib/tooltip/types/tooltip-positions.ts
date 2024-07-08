/** Types for tooltip positions */
export const tooltipPositions = ['top', 'right', 'left', 'bottom'] as const;
export type TooltipPosition = (typeof tooltipPositions)[number];
