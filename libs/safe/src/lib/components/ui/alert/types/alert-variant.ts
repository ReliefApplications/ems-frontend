/**
 * Alerts variants
 */
export const variants = [
  'default',
  'primary',
  'success',
  'danger',
  'warning',
] as const;
export type AlertVariant = (typeof variants)[number];
