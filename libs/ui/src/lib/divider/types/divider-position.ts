/**
 * Type for the divider position
 */
export const dividerPositions = ['right', 'center', 'left'] as const;
export type DividerPosition = (typeof dividerPositions)[number];
