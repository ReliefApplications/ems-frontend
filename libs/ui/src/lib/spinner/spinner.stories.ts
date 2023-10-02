import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { SpinnerComponent } from './spinner.component';
import { SpinnerModule } from './spinner.module';
import { sizes } from '../types/size';
import { variants } from '../types/variant';
import { categories } from '../types/category';

export default {
  title: 'Components/Spinner',
  tags: ['autodocs'],
  component: SpinnerComponent,
  decorators: [
    moduleMetadata({
      imports: [SpinnerModule],
    }),
  ],
  argTypes: {
    category: {
      options: categories,
      control: {
        type: 'select',
      },
    },
    variant: {
      options: variants,
      control: {
        type: 'select',
      },
      defaultValue: 'default',
    },
    size: {
      options: sizes,
      control: {
        type: 'select',
      },
    },
  },
} as Meta<SpinnerComponent>;

// Common props for each spinner size //
/**
 * Small spinner
 */
const smallSpinner = {
  size: 'small',
};
/**
 * Medium spinner
 */
const mediumSpinner = {
  size: 'medium',
};
/**
 * Large spinner
 */
const largeSpinner = {
  size: 'large',
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
  ...(smallSpinner as any),
};

/** Medium spinner */
export const Medium = Template.bind({});
Medium.args = {
  ...(mediumSpinner as any),
};

/** Large spinner */
export const Large = Template.bind({});
Large.args = {
  ...(largeSpinner as any),
};
