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
  'accent',
] as const;
export type Variant = (typeof variants)[number];
