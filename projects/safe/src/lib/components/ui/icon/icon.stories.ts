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

const TEMPLATE: Story<SafeIconComponent> = (args) => ({
  props: {
    ...args,
  },
});

export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {
  icon: 'edit',
};
