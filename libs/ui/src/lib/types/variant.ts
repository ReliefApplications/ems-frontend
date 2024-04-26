/**
 * Variant
 */
export const variants = [
  'default',
  'primary',
  'secondary',
  'success',
  'danger',
  'grey',
  'light',
  'warning',
] as const;
export type Variant = (typeof variants)[number];
