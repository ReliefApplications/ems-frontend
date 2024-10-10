/**
 * Types for the dialog size in the dialog component
 */
export const dialogSizes = [
  'fullscreen',
  'small',
  'medium',
  'big',
  'xlg',
] as const;
export type DialogSize = (typeof dialogSizes)[number];
