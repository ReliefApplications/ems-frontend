/**
 * Type for the divider orientation
 */
export const dividerOrientations = ['vertical', 'horizontal'] as const;
export type DividerOrientation = (typeof dividerOrientations)[number];
