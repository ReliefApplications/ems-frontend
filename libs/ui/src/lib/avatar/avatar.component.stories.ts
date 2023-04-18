import { moduleMetadata, StoryObj, Meta } from '@storybook/angular';
import { AvatarComponent } from './avatar.component';
import { AvatarSize } from './enums/avatar-size.enum';
import { AvatarModule } from './avatar.module';
import { AvatarVariant } from './enums/avatar-variant.enum';
import { AvatarShape } from './enums/avatar-shape.enum';

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
        args.size ?? AvatarSize.MEDIUM}'" 
        [shape]="'${args.shape ?? AvatarShape.CIRCLE}'"
        [initials]="'${args.initials ?? false}'"
        [image]="'${args.image ?? ''}'"
        ></ui-avatar>`,
      userDefinedTemplate: true,
    };
  },
} as Meta<AvatarComponent>;

// Common props for each avatar size //
/**
 * Small avatar
 */
const smallAvatar = {
  size: AvatarSize.SMALL,
};
/**
 * Medium avatar
 */
const mediumAvatar = {
  size: AvatarSize.MEDIUM,
};
/**
 * Large avatar
 */
const largeAvatar = {
  size: AvatarSize.LARGE,
};

// AVATARS //
/**
 * Primary small circle avatar story
 */
export const PrimaryCircleAvatarSmall: StoryObj<AvatarComponent> = {
  args: {
    ...smallAvatar,
    shape: AvatarShape.CIRCLE,
    initials: false,
    image: ''
  },
};
/**
 * Primary medium circle avatar story
 */
export const PrimaryCircleAvatarMedium: StoryObj<AvatarComponent> = {
  args: {
    ...mediumAvatar,
    shape: AvatarShape.CIRCLE,
    initials: false,
    image: ''
  },
};
/**
 * Primary large circle avatar story
 */
export const PrimaryCircleAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    ...largeAvatar,
    shape: AvatarShape.CIRCLE,
    initials: false,
    image: ''
  },
};
/**
 * Primary small rectangle avatar story
 */
export const PrimaryRectangleAvatarSmall: StoryObj<AvatarComponent> = {
  args: {
    ...smallAvatar,
    shape: AvatarShape.RECTANGLE,
    initials: false,
    image: ''
  },
};
/**
 * Primary medium rectangle avatar story
 */
export const PrimaryRectangleAvatarMedium: StoryObj<AvatarComponent> = {
  args: {
    ...mediumAvatar,
    shape: AvatarShape.RECTANGLE,
    initials: false,
    image: ''
  },
};
/**
 * Primary large rectangle avatar story
 */
export const PrimaryRectangleAvatarLarge: StoryObj<AvatarComponent> = {
  args: {
    ...largeAvatar,
    shape: AvatarShape.RECTANGLE,
    initials: false,
    image: ''
  },
};