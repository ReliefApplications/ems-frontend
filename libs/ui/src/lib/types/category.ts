/**
 * Category
 */
export const categories = ['primary', 'secondary', 'tertiary'] as const;
export type Category = (typeof categories)[number];
