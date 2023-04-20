import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { AvatarGroupComponent } from './avatar-group.component';
import { AvatarGroupStack } from './enums/avatar-group-stack.enum'
import { AvatarGroupModule } from './avatar-group.module'

type MockedAvatarGroup = {
  size: string;
  variant: string,
  shape: string,
  image: string;
  initials: string;
};

export default {
  title: 'AvatarGroupComponent',
  component: AvatarGroupComponent,
  decorators: [
    moduleMetadata({
      imports: [AvatarGroupModule],
    })
  ],
} as Meta<AvatarGroupComponent>;

const avatarGroupData : MockedAvatarGroup[] = [
  {
    size:"large",
    variant: "tertiary",
    image:"",
    shape:"circle",
    initials: 'JL',
  },
  {
    size:"large",
    variant: "tertiary",
    image:"https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    shape:"circle",
    initials: 'PM',
  },
  {
    size:"large",
    variant: "secondary",
    image:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
    shape:"circle",
    initials: '',
  },
  {
    size:"large",
    variant: "secondary",
    image:"https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    shape:"rectangle",
    initials: '',
  }
]

const Template: StoryFn<AvatarGroupComponent> = (
  args: AvatarGroupComponent
) => ({
  props: args,
});

export const AvatarGroupTemplate = Template.bind({});
AvatarGroupTemplate.args = {
  stack: AvatarGroupStack.TOP,
  limit: '2',
  avatars: avatarGroupData,
};

export const AvatarGroupTemplate2 = Template.bind({});
AvatarGroupTemplate2.args = {
  stack: AvatarGroupStack.BOTTOM,
  limit: '1',
  avatars: avatarGroupData,
};

export const AvatarGroupTemplate3 = Template.bind({});
AvatarGroupTemplate3.args = {
  stack: AvatarGroupStack.BOTTOM,
  limit: '4',
  avatars: avatarGroupData,
};