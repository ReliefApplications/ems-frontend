import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { IconVariant } from './icon-variant.enum';
import { SafeIconComponent } from './icon.component';
import { SafeIconModule } from './icon.module';

export default {
  component: SafeIconComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeIconModule],
      providers: [],
    }),
  ],
  title: 'UI/Icon',
  argTypes: {
    icon: {
      defaultValue: 'edit',
      control: { type: 'text' },
    },
    variant: {
      defaultValue: IconVariant.DEFAULT,
      options: [
        IconVariant.DEFAULT,
        IconVariant.PRIMARY,
        IconVariant.SUCCESS,
        IconVariant.DANGER,
        IconVariant.LIGHT,
        IconVariant.GREY,
      ],
      control: { type: 'select' },
    },
    size: {
      defaultValue: 24,
      control: { type: 'number' },
    },
  },
} as Meta;

/**
 * Stories template used to render the component
 *
 * @param args Arguments used by the component
 * @returns Returns an object used as the stories template
 */
const TEMPLATE: StoryFn<SafeIconComponent> = (args) => ({
  props: {
    ...args,
  },
});

/**
 * Default story.
 */
export const DEFAULT = {
  render: TEMPLATE,
  name: 'Default',

  args: {
    icon: 'edit',
  },
};
