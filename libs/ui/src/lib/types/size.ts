/**
 * Size
 */
export const sizes = ['small', 'medium', 'large'] as const;
export type Size = (typeof sizes)[number];
