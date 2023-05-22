/**
 * Variant
 */
export const variants = [
  'default',
  'primary',
  'success',
  'danger',
  'grey',
  'light',
] as const;
export type Variant = (typeof variants)[number];
