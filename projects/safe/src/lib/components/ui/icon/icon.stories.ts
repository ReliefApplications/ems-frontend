import { Meta, moduleMetadata, Story } from '@storybook/angular';
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
 * Template factory for story components
 *
 * @param args Properties for the component
 * @returns The template
 */
const TEMPLATE: Story<SafeIconComponent> = (args) => ({
  props: {
    ...args,
  },
});

/** Export a default template wwith mock properties */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {
  icon: 'edit',
};
