import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { AvatarGroupComponent } from './avatar-group.component';
import { AvatarGroupModule } from './avatar-group.module';
import { AvatarShape, avatarShapes } from '../avatar/types/avatar-shape';
import { Size, sizes } from '../types/size';
import { Category, categories } from '../types/category';

type MockedAvatar = {
  size: Size;
  variant: Category;
  shape: AvatarShape;
  image: string;
  initials: string;
};

type StoryType = AvatarGroupComponent & { avatars?: any[] };

/**
 * Mocked avatar array
 */
const avatars: MockedAvatar[] = [
  {
    size: 'large',
    variant: 'tertiary',
    image: '',
    shape: 'circle',
    initials: 'JL',
  },
  {
    size: 'large',
    variant: 'tertiary',
    image:
      'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shape: 'circle',
    initials: 'PM',
  },
  {
    size: 'large',
    variant: 'secondary',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    shape: 'circle',
    initials: '',
  },
  {
    size: 'large',
    variant: 'secondary',
    image:
      'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shape: 'rectangle',
    initials: '',
  },
];

export default {
  title: 'Avatar Group',
  component: AvatarGroupComponent,
  argTypes: {
    shape: {
      options: avatarShapes,
      control: 'select',
    },
    variant: {
      options: categories,
      control: 'select',
    },
    size: {
      options: sizes,
      control: 'select',
    },
    limit: {
      control: 'number',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [AvatarGroupModule],
    }),
  ],
  render: (args) => {
    let avatarGroupContent = '';
    for (const avatar of avatars) {
      avatarGroupContent += `<ui-avatar variant=${avatar.variant} image="${avatar.image}" shape=${avatar.shape} initials=${avatar.initials}></ui-avatar>`;
    }
    return {
      props: args,
      template: `<ui-avatar-group shape=${args.shape} size=${args.size} limit=${args.limit}>${avatarGroupContent}
      </ui-avatar-group>`,
    };
  },
} as Meta<AvatarGroupComponent>;

/**
 * AvatarGroup with top stack, limit 2
 */
export const Default: StoryObj<StoryType> = {
  args: {},
};
// AvatarGroupTemplate.args = {
//   stack: AvatarGroupStack.TOP,
//   limit: '2',
//   avatars: avatarGroupData,
// };

/**
 * AvatarGroup with bottom stack, limit 1
 */
// export const AvatarGroupTemplate2 = Template.bind({});
// AvatarGroupTemplate2.args = {
//   stack: AvatarGroupStack.BOTTOM,
//   limit: '1',
//   avatars: avatarGroupData,
// };

/**
 * AvatarGroup with bottom stack, limit 4
 */
// export const AvatarGroupTemplate3 = Template.bind({});
// AvatarGroupTemplate3.args = {
//   stack: AvatarGroupStack.BOTTOM,
//   limit: '4',
//   avatars: avatarGroupData,
// };
