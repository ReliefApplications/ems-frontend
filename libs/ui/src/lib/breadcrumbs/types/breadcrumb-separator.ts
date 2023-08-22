/**
 * Types of possible separators styles
 */
export const breadcrumbSeparators = ['chevron', 'slash'] as const;
export type BreadcrumbSeparator = (typeof breadcrumbSeparators)[number];
