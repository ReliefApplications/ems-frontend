import { moduleMetadata, StoryObj, Meta } from '@storybook/angular';
import { AvatarComponent } from './avatar.component';
import { AvatarSize } from './enums/avatar-size.enum';
import { AvatarModule } from './avatar.module';

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

// const Template: StoryFn<AvatarComponent> = (args: AvatarComponent) => ({
//   props: args,
// });

// export const Primary = Template.bind({});
// Primary.args = {
//   size: AvatarSize.MEDIUM,
//   icon: '',
//   variant: AvatarVariant.DEFAULT,
//   action: () => {
//     console.log('Action triggered!');
//   },
// };
