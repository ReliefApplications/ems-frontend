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
  'dark',
] as const;
export type Variant = (typeof variants)[number];
