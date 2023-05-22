/**
 * Type of possible display styles
 */
export const breadCrumbDisplays = ['simple', 'contained', 'full'] as const;
export type BreadcrumbDisplay = (typeof breadCrumbDisplays)[number];
