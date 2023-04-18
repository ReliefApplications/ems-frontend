import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
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
  render: (args) => {
    return {
      args,
      template: `<ui-spinner [category]="'${
        args.category ?? Category.PRIMARY
      }'" [size]="'${args.size ?? Size.MEDIUM}'" [variant]="'${
        args.variant ?? Variant.DEFAULT
      }'"></ui-spinner>`,
      userDefinedTemplate: true,
    };
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

// SPINNERS //
/**
 * Primary small spinner story
 */
export const PrimarySpinnerSmall: StoryObj<SpinnerComponent> = {
  args: {
    ...smallSpinner,
    variant: Variant.PRIMARY,
  },
};
/**
 * Primary medium spinner story
 */
export const PrimarySpinnerMedium: StoryObj<SpinnerComponent> = {
  args: {
    ...mediumSpinner,
    variant: Variant.PRIMARY,
  },
};
/**
 * Primary large spinner story
 */
export const PrimarySpinnerLarge: StoryObj<SpinnerComponent> = {
  args: {
    ...largeSpinner,
    variant: Variant.PRIMARY,
  },
};

/**
 * Success small spinner story
 */
export const SuccessSpinnerSmall: StoryObj<SpinnerComponent> = {
  args: {
    ...smallSpinner,
    variant: Variant.SUCCESS,
  },
};
/**
 * Success medium spinner story
 */
export const SuccessSpinnerMedium: StoryObj<SpinnerComponent> = {
  args: {
    ...mediumSpinner,
    variant: Variant.SUCCESS,
  },
};
/**
 * Success large spinner story
 */
export const SuccessSpinnerLarge: StoryObj<SpinnerComponent> = {
  args: {
    ...largeSpinner,
    variant: Variant.SUCCESS,
  },
};

/**
 * Danger small spinner story
 */
export const DangerSpinnerSmall: StoryObj<SpinnerComponent> = {
  args: {
    ...smallSpinner,
    variant: Variant.DANGER,
  },
};
/**
 * Danger medium spinner story
 */
export const DangerSpinnerMedium: StoryObj<SpinnerComponent> = {
  args: {
    ...mediumSpinner,
    variant: Variant.DANGER,
  },
};
/**
 * Danger large spinner story
 */
export const DangerSpinnerLarge: StoryObj<SpinnerComponent> = {
  args: {
    ...largeSpinner,
    variant: Variant.DANGER,
  },
};

/**
 * Grey small spinner story
 */
export const GreySpinnerSmall: StoryObj<SpinnerComponent> = {
  args: {
    ...smallSpinner,
    variant: Variant.GREY,
  },
};
/**
 * Grey medium spinner story
 */
export const GreySpinnerMedium: StoryObj<SpinnerComponent> = {
  args: {
    ...mediumSpinner,
    variant: Variant.GREY,
  },
};
/**
 * Grey large spinner story
 */
export const GreySpinnerLarge: StoryObj<SpinnerComponent> = {
  args: {
    ...largeSpinner,
    variant: Variant.GREY,
  },
};

/**
 * Light small spinner story
 */
export const LightSpinnerSmall: StoryObj<SpinnerComponent> = {
  args: {
    ...smallSpinner,
    variant: Variant.LIGHT,
  },
};
/**
 * Light medium spinner story
 */
export const LightSpinnerMedium: StoryObj<SpinnerComponent> = {
  args: {
    ...mediumSpinner,
    variant: Variant.LIGHT,
  },
};
/**
 * Light large spinner story
 */
export const LightSpinnerLarge: StoryObj<SpinnerComponent> = {
  args: {
    ...largeSpinner,
    variant: Variant.LIGHT,
  },
};
