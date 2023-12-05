/** Action to enable element's tooltip display */
export const tooltipEnableByList = ['default', 'truncate'] as const;
export type TooltipEnableBy = (typeof tooltipEnableByList)[number];
