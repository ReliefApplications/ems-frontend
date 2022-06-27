import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeAvatarModule } from './avatar.module';
import { SafeAvatarComponent } from './avatar.component';
import { AvatarSize } from './avatar-size.enum';
import { AvatarVariant } from './avatar-variant.enum';

export default {
  component: SafeAvatarComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeAvatarModule],
    }),
  ],
  title: 'UI/Avatar',
  argTypes: {
    size: {
      options: [AvatarSize.SMALL, AvatarSize.MEDIUM],
      control: { type: 'select' },
    },
    variant: {
      options: [
        AvatarVariant.DEFAULT,
        AvatarVariant.PRIMARY,
        AvatarVariant.SUCCESS,
        AvatarVariant.DANGER,
        AvatarVariant.WARNING,
      ],
      control: { type: 'select' },
    },
    icon: {
      defaultValue: '',
      control: { type: 'text' },
    },
    content: {
      defaultValue: 'P',
      control: { type: 'text' },
    },
  },
} as Meta;

const TEMPLATE_WITH_TEXT: Story<SafeAvatarComponent> = (args) => ({
  template: '<safe-avatar [icon]="icon">{{content}}</safe-avatar>',
  props: {
    ...args,
  },
});

export const DEFAULT = TEMPLATE_WITH_TEXT.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {
  size: AvatarSize.MEDIUM,
  variant: AvatarVariant.DEFAULT,
};

export const ICON = TEMPLATE_WITH_TEXT.bind({});
DEFAULT.storyName = 'With icon';
ICON.args = {
  ...DEFAULT.args,
  icon: 'home',
};
