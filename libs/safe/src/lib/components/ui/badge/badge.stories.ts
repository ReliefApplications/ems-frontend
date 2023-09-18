import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { SafeBadgeModule } from './badge.module';
import { SafeBadgeComponent } from './badge.component';
import { BadgeSize } from './badge-size.enum';
import { BadgeVariant } from './badge-variant.enum';

export default {
  component: SafeBadgeComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeBadgeModule],
    }),
  ],
  title: 'UI/Badge',
  argTypes: {
    size: {
      options: [BadgeSize.SMALL, BadgeSize.MEDIUM],
      control: { type: 'select' },
    },
    variant: {
      options: [
        BadgeVariant.DEFAULT,
        BadgeVariant.PRIMARY,
        BadgeVariant.SUCCESS,
        BadgeVariant.DANGER,
        BadgeVariant.WARNING,
      ],
      control: { type: 'select' },
    },
    icon: {
      defaultValue: '',
      control: { type: 'text' },
    },
    content: {
      defaultValue: 'This is a badge',
      control: { type: 'text' },
    },
  },
} as Meta;

/**
 * Template used by storybook to display the component in stories.
 *
 * @param args story arguments
 * @returns story template
 */
const TEMPLATE_WITH_TEXT: StoryFn<SafeBadgeComponent> = (args) => ({
  template:
    '<safe-badge [icon]="icon" [size]="size" [variant]="variant">{{content}}</safe-badge>',
  props: {
    ...args,
  },
});

/**
 * Default story.
 */
export const DEFAULT = {
  render: TEMPLATE_WITH_TEXT,
  name: 'Default',

  args: {
    size: BadgeSize.MEDIUM,
    variant: BadgeVariant.DEFAULT,
  },
};

/**
 * With icon story.
 */
export const ICON = {
  render: TEMPLATE_WITH_TEXT,
  name: 'With icon',

  args: {
    ...DEFAULT.args,
    icon: 'home',
  },
};
