import { moduleMetadata, StoryObj, Meta } from '@storybook/angular';
import { AvatarComponent } from './avatar.component';
import { AvatarSize } from './enums/avatar-size.enum';
import { AvatarModule } from './avatar.module';
import { AvatarVariant } from './enums/avatar-variant.enum';
import { AvatarShape } from './enums/avatar-shape.enum';

export default {
  title: 'Avatar',
  component: AvatarComponent,
  argTypes: {
    size: {
      options: AvatarSize,
      control: 'select',
    },
    shape: {
      options: AvatarShape,
      control: 'select',
    },
    variant: {
      options: AvatarVariant,
      control: 'select',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [AvatarModule],
    }),
  ],
} as Meta<AvatarComponent>;

/** Default inputs */
export const Defaut: StoryObj<AvatarComponent> = {
  args: {},
};
/**
 * Primary small circle avatar story
 */
export const PrimaryCircleAvatarSmall: StoryObj<AvatarComponent> = {
  args: {
    size: AvatarSize.SMALL,
    shape: AvatarShape.CIRCLE,
    initials: '',
    image: '',
    variant: AvatarVariant.PRIMARY,
  },
};
/**
 * Primary medium circle avatar story
 */
export const PrimaryCircleAvatarMedium: StoryObj<AvatarComponent> = {
  args: {
    size: AvatarSize.MEDIUM,
    shape: AvatarShape.CIRCLE,
    initials: '',
    image: '',
    variant: AvatarVariant.PRIMARY,
  },
};
/**
 * Primary large circle avatar story
 */
export const PrimaryCircleAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    size: AvatarSize.LARGE,
    shape: AvatarShape.CIRCLE,
    initials: '',
    image: '',
    variant: AvatarVariant.PRIMARY,
  },
};
/**
 * Primary large circle avatar with image story
 */
export const PrimaryCircleImageAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    size: AvatarSize.LARGE,
    shape: AvatarShape.CIRCLE,
    initials: '',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    variant: AvatarVariant.PRIMARY,
  },
};
/**
 * Secondary large circle avatar story
 */
export const SecondaryCircleAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    size: AvatarSize.LARGE,
    shape: AvatarShape.CIRCLE,
    initials: '',
    image: '',
    variant: AvatarVariant.SECONDARY,
  },
};
/**
 * Tertiary large circle avatar story
 */
export const TertiaryCircleAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    size: AvatarSize.LARGE,
    shape: AvatarShape.CIRCLE,
    initials: '',
    image: '',
    variant: AvatarVariant.TERTIARY,
  },
};
/**
 * Primary small rectangle avatar story
 */
export const PrimaryRectangleAvatarSmall: StoryObj<AvatarComponent> = {
  args: {
    size: AvatarSize.SMALL,
    shape: AvatarShape.RECTANGLE,
    initials: '',
    image: '',
    variant: AvatarVariant.PRIMARY,
  },
};
/**
 * Primary medium rectangle avatar story
 */
export const PrimaryRectangleAvatarMedium: StoryObj<AvatarComponent> = {
  args: {
    size: AvatarSize.MEDIUM,
    shape: AvatarShape.RECTANGLE,
    initials: '',
    image: '',
    variant: AvatarVariant.PRIMARY,
  },
};
/**
 * Primary large rectangle avatar story
 */
export const PrimaryRectangleAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    size: AvatarSize.LARGE,
    shape: AvatarShape.RECTANGLE,
    initials: '',
    image: '',
    variant: AvatarVariant.PRIMARY,
  },
};
/**
 * Primary large rectangle with image avatar story
 */
export const PrimaryRectangleImageAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    size: AvatarSize.LARGE,
    shape: AvatarShape.RECTANGLE,
    initials: '',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    variant: AvatarVariant.PRIMARY,
  },
};
/**
 * Secondary large rectangle avatar story
 */
export const SecondaryRectangleAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    size: AvatarSize.LARGE,
    shape: AvatarShape.RECTANGLE,
    initials: '',
    image: '',
    variant: AvatarVariant.SECONDARY,
  },
};
/**
 * Tertiary large rectangle avatar story
 */
export const TertiaryRectangleAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    size: AvatarSize.LARGE,
    shape: AvatarShape.RECTANGLE,
    initials: '',
    image: '',
    variant: AvatarVariant.TERTIARY,
  },
};
