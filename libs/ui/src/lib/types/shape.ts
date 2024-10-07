/**
 * Shape
 */
export const shapes = ['square', 'round', 'large'] as const;
export type Shape = (typeof shapes)[number];
