/**
 * Types for the scroll strategies in the autocomplete panel
 */
export const scrollStrategies = ['close', 'block'] as const;
export type ScrollStrategies = (typeof scrollStrategies)[number];
