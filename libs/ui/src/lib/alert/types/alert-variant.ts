/**
 * Alerts variants
 */
export const alertVariants = [
  'default',
  'primary',
  'success',
  'danger',
  'warning',
] as const;
export type AlertVariant = (typeof alertVariants)[number];
