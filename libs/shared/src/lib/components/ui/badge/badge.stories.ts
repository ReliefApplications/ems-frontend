import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { BadgeModule } from './badge.module';
import { BadgeComponent } from './badge.component';
import { BadgeSize } from './badge-size.enum';
import { BadgeVariant } from './badge-variant.enum';

export default {
  component: BadgeComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BadgeModule],
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
const TEMPLATE_WITH_TEXT: StoryFn<BadgeComponent> = (args) => ({
  template:
    '<shared-badge [icon]="icon" [size]="size" [variant]="variant">{{content}}</shared-badge>',
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
