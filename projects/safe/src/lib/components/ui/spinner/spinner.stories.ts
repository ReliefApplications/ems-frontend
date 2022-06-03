import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SpinnerSize } from './spinner-size.enum';
import { SpinnerVariant } from './spinner-variant.enum';
import { SafeSpinnerComponent } from './spinner.component';
import { SafeSpinnerModule } from './spinner.module';

export default {
  component: SafeSpinnerComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeSpinnerModule],
      providers: [],
    }),
  ],
  title: 'UI/Spinner',
  argTypes: {
    size: {
      options: [SpinnerSize.SMALL, SpinnerSize.MEDIUM],
      control: { type: 'select' },
    },
    variant: {
      options: [
        SpinnerVariant.DEFAULT,
        SpinnerVariant.PRIMARY,
        SpinnerVariant.SUCCESS,
        SpinnerVariant.DANGER,
        SpinnerVariant.LIGHT,
      ],
      control: { type: 'select' },
    },
  },
} as Meta;

const TEMPLATE: Story<SafeSpinnerComponent> = (args) => ({
  props: {
    ...args,
  },
});

export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {
  size: SpinnerSize.MEDIUM,
  variant: SpinnerVariant.DEFAULT,
};
