import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { SpinnerComponent } from './spinner.component';
import { SpinnerModule } from './spinner.module';
import { Size } from '../shared/size.enum';
import { Variant } from '../shared/variant.enum';
import { Category } from '../shared/category.enum';

export default {
  title: 'SpinnerComponent',
  component: SpinnerComponent,
  decorators: [
    moduleMetadata({
      imports: [SpinnerModule],
    }),
  ],
  argTypes: {
    category: {
      options: Category,
      control: {
        type: 'select',
      },
    },
    variant: {
      options: Variant,
      control: {
        type: 'select',
      },
      defaultValue: Variant.DEFAULT,
    },
  },
} as Meta<SpinnerComponent>;

// Common props for each spinner size //
/**
 * Small spinner
 */
const smallSpinner = {
  size: Size.SMALL,
};
/**
 * Medium spinner
 */
const mediumSpinner = {
  size: Size.MEDIUM,
};
/**
 * Large spinner
 */
const largeSpinner = {
  size: Size.LARGE,
};

/**
 * Template spinner
 *
 * @param {SpinnerComponent} args args
 * @returns SpinnerComponent
 */
const Template: StoryFn<SpinnerComponent> = (args: SpinnerComponent) => ({
  props: args,
});

/** Small spinner */
export const Small = Template.bind({});
Small.args = {
  ...smallSpinner,
};

/** Medium spinner */
export const Medium = Template.bind({});
Medium.args = {
  ...mediumSpinner,
};

/** Large spinner */
export const Large = Template.bind({});
Large.args = {
  ...largeSpinner,
};
