/**
 * Avatar shape types.
 */
export const avatarShapes = ['circle', 'rectangle'] as const;
export type AvatarShape = (typeof avatarShapes)[number];
