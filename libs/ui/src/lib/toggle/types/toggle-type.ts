/**
 * Type for the toggle types in the toggle component
 */
export const toggleTypes = ['simple', 'short'] as const;
export type ToggleType = (typeof toggleTypes)[number];
