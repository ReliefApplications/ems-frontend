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
  'warning',
] as const;
export type Variant = (typeof variants)[number];
