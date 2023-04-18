import { moduleMetadata, StoryObj, Meta } from '@storybook/angular';
import { AvatarGroupComponent } from './avatar-group.component';
import { AvatarGroupStack } from './enums/avatar-group-stack.enum'

export default {
  title: 'AvatarGroupComponent',
  component: AvatarGroupComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
  render: (args) => {
    return {
      args,
      template: `<ui-avatar-group [stack]="'${
        args.stack ?? AvatarGroupStack.TOP}'"
        ></ui-avatar-group>`,
      userDefinedTemplate: true,
    };
  },
} as Meta<AvatarGroupComponent>;

export const PrimaryAvatar: StoryObj<AvatarGroupComponent> = {
  args: {
    stack: AvatarGroupStack.TOP
  },
};