import { moduleMetadata, StoryObj, Meta } from '@storybook/angular';
import { AvatarGroupComponent } from './avatar-group.component';
import { AvatarGroupStack } from './enums/avatar-group-stack.enum'
import { AvatarGroupModule } from './avatar-group.module'

export default {
  title: 'AvatarGroupComponent',
  component: AvatarGroupComponent,
  decorators: [
    moduleMetadata({
      imports: [AvatarGroupModule],
    })
  ],
  render: (args) => {
    return {
      args,
      template: `<ui-avatar-group [stack]="'${
        args.stack ?? AvatarGroupStack.TOP}'"
        [avatars]="'${args.avatars ?? []}'"
        ></ui-avatar-group>`,
      userDefinedTemplate: true,
    };
  },
} as Meta<AvatarGroupComponent>;

export const PrimaryAvatar: StoryObj<AvatarGroupComponent> = {
  args: {
    stack: AvatarGroupStack.TOP,
    avatars: [
      {
        size:"large",
        variant: "primary",
        image:"https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        shape:"circle",
        initials: false,
      },
      {
        size:"large",
        variant: "primary",
        image:"https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        shape:"rectangle",
        initials: true,
      },
      {
        size:"large",
        variant: "primary",
        image:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
        shape:"circle",
        initials: false,
      }
    ]
  },
};