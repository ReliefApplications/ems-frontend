import { moduleMetadata, StoryObj, Meta } from '@storybook/angular';
import { AvatarComponent } from './avatar.component';
import { AvatarSize } from './enums/avatar-size.enum';
import { AvatarModule } from './avatar.module';
import { AvatarVariant } from './enums/avatar-variant.enum';

export default {
  title: 'AvatarComponent',
  component: AvatarComponent,
  decorators: [
    moduleMetadata({
      imports: [AvatarModule],
    }),
  ],
  render: (args) => {
    return {
      args,
      template: `<ui-avatar [size]="'${
        args.size ?? AvatarSize.MEDIUM}'"></ui-avatar>`,
      userDefinedTemplate: true,
    };
  },
} as Meta<AvatarComponent>;

// Common props for each spinner size //
/**
 * Small spinner
 */
const smallAvatar = {
  size: AvatarSize.SMALL,
};
/**
 * Medium spinner
 */
const mediumAvatar = {
  size: AvatarSize.MEDIUM,
};
/**
 * Large spinner
 */
const largeAvatar = {
  size: AvatarSize.LARGE,
};

// AVATARS //
/**
 * Primary small spinner story
 */
export const PrimaryAvatarSmall: StoryObj<AvatarComponent> = {
  args: {
    ...smallAvatar,
  },
};
/**
 * Primary medium spinner story
 */
export const PrimaryAvatarMedium: StoryObj<AvatarComponent> = {
  args: {
    ...mediumAvatar,
  },
};
/**
 * Primary large spinner story
 */
export const PrimaryAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    ...largeAvatar,
  },
};

/**
 * Success small spinner story
 */
export const SuccessSpinnerSmall: StoryObj<AvatarComponent> = {
  args: {
    ...smallAvatar,
    variant: AvatarVariant.SUCCESS,
  },
};
/**
 * Success medium spinner story
 */
export const SuccessSpinnerMedium: StoryObj<AvatarComponent> = {
  args: {
    ...mediumAvatar,
    variant: AvatarVariant.SUCCESS,
  },
};
/**
 * Success large spinner story
 */
export const SuccessSpinnerLarge: StoryObj<AvatarComponent> = {
  args: {
    ...largeAvatar,
    variant: AvatarVariant.SUCCESS,
  },
};

/**
 * Danger small spinner story
 */
export const DangerSpinnerSmall: StoryObj<AvatarComponent> = {
  args: {
    ...smallAvatar,
    variant: AvatarVariant.DANGER,
  },
};
/**
 * Danger medium spinner story
 */
export const DangerSpinnerMedium: StoryObj<AvatarComponent> = {
  args: {
    ...mediumAvatar,
    variant: AvatarVariant.DANGER,
  },
};
/**
 * Danger large spinner story
 */
export const DangerSpinnerLarge: StoryObj<AvatarComponent> = {
  args: {
    ...largeAvatar,
    variant: AvatarVariant.DANGER,
  },
};

/**
 * Grey small spinner story
 */
export const GreySpinnerSmall: StoryObj<AvatarComponent> = {
  args: {
    ...smallAvatar,
    variant: AvatarVariant.GREY,
  },
};
/**
 * Grey medium spinner story
 */
export const GreySpinnerMedium: StoryObj<AvatarComponent> = {
  args: {
    ...mediumAvatar,
    variant: AvatarVariant.GREY,
  },
};
/**
 * Grey large spinner story
 */
export const GreySpinnerLarge: StoryObj<AvatarComponent> = {
  args: {
    ...largeAvatar,
    variant: AvatarVariant.GREY,
  },
};

/**
 * Light small spinner story
 */
export const LightSpinnerSmall: StoryObj<AvatarComponent> = {
  args: {
    ...smallAvatar,
    variant: AvatarVariant.LIGHT,
  },
};
/**
 * Light medium spinner story
 */
export const LightSpinnerMedium: StoryObj<AvatarComponent> = {
  args: {
    ...mediumAvatar,
    variant: AvatarVariant.LIGHT,
  },
};
/**
 * Light large spinner story
 */
export const LightSpinnerLarge: StoryObj<AvatarComponent> = {
  args: {
    ...largeAvatar,
    variant: AvatarVariant.LIGHT,
  },
};
