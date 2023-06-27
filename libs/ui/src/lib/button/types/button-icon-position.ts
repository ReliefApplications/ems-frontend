/**
 * Type for the icon position in the button component
 */
export const buttonIconPositions = ['prefix', 'suffix'] as const;
export type ButtonIconPosition = (typeof buttonIconPositions)[number];
