import { moduleMetadata, StoryObj, Meta } from '@storybook/angular';
import { AvatarComponent } from './avatar.component';
import { sizes } from '../types/size';
import { categories } from '../types/category';
import { AvatarModule } from './avatar.module';
import { avatarShapes } from './types/avatar-shape';

export default {
  title: 'Avatar',
  component: AvatarComponent,
  argTypes: {
    size: {
      options: sizes,
      control: 'select',
    },
    shape: {
      options: avatarShapes,
      control: 'select',
    },
    variant: {
      options: categories,
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
    size: 'small',
    shape: 'circle',
    initials: '',
    image: '',
    variant: 'primary',
  },
};
/**
 * Primary medium circle avatar story
 */
export const PrimaryCircleAvatarMedium: StoryObj<AvatarComponent> = {
  args: {
    size: 'medium',
    shape: 'circle',
    initials: '',
    image: '',
    variant: 'primary',
  },
};
/**
 * Primary large circle avatar story
 */
export const PrimaryCircleAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    size: 'large',
    shape: 'circle',
    initials: '',
    image: '',
    variant: 'primary',
  },
};
/**
 * Primary large circle avatar with image story
 */
export const PrimaryCircleImageAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    size: 'large',
    shape: 'circle',
    initials: '',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    variant: 'primary',
  },
};
/**
 * Secondary large circle avatar story
 */
export const SecondaryCircleAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    size: 'large',
    shape: 'circle',
    initials: '',
    image: '',
    variant: 'secondary',
  },
};
/**
 * Tertiary large circle avatar story
 */
export const TertiaryCircleAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    size: 'large',
    shape: 'circle',
    initials: '',
    image: '',
    variant: 'tertiary',
  },
};
/**
 * Primary small rectangle avatar story
 */
export const PrimaryRectangleAvatarSmall: StoryObj<AvatarComponent> = {
  args: {
    size: 'small',
    shape: 'rectangle',
    initials: '',
    image: '',
    variant: 'primary',
  },
};
/**
 * Primary medium rectangle avatar story
 */
export const PrimaryRectangleAvatarMedium: StoryObj<AvatarComponent> = {
  args: {
    size: 'medium',
    shape: 'rectangle',
    initials: '',
    image: '',
    variant: 'primary',
  },
};
/**
 * Primary large rectangle avatar story
 */
export const PrimaryRectangleAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    size: 'large',
    shape: 'rectangle',
    initials: '',
    image: '',
    variant: 'primary',
  },
};
/**
 * Primary large rectangle with image avatar story
 */
export const PrimaryRectangleImageAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    size: 'large',
    shape: 'rectangle',
    initials: '',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    variant: 'primary',
  },
};
/**
 * Secondary large rectangle avatar story
 */
export const SecondaryRectangleAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    size: 'large',
    shape: 'rectangle',
    initials: '',
    image: '',
    variant: 'secondary',
  },
};
/**
 * Tertiary large rectangle avatar story
 */
export const TertiaryRectangleAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    size: 'large',
    shape: 'rectangle',
    initials: '',
    image: '',
    variant: 'tertiary',
  },
};
