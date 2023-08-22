/**
 * Avatar stack types.
 */
export const avatarGroupStacks = ['top', 'bottom'] as const;
export type AvatarGroupStack = (typeof avatarGroupStacks)[number];
