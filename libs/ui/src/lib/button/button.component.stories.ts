import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';
import { ButtonModule } from './button.module';
import { ButtonCategory } from './enums/button-category.enum';
import { Size } from '../shared/size.enum';
import { ButtonIconPosition } from './enums/button-icon-position.enum';
import { Variant } from '../shared/variant.enum';
import { IconModule } from '../icon/icon.module';
import { SpinnerModule } from '../spinner/spinner.module';

type StoryType = ButtonComponent & { label?: string };

export default {
  title: 'ButtonComponent',
  component: ButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [ButtonModule, IconModule, SpinnerModule],
    }),
  ],
  render: (args) => {
    const { label, ...props } = args;
    console.log(props);
    return {
      props,
      template: `<ui-button [loading]="${props.loading ?? false}" [size]="'${
        props.size
      }'" [icon]="'${props.icon ?? ''}'" [iconPosition]="'${
        props.iconPosition ?? ''
      }'" [category]=${props.category} [variant]="'${
        props.variant ?? ''
      }'">${label}</ui-button>`,
      userDefinedTemplate: true,
    };
  },
} as Meta<StoryType>;

// Common props for each button type //
/**
 * Primary button
 */
const primaryButton = {
  label: 'Primary button',
  category: ButtonCategory.PRIMARY,
  size: Size.MEDIUM,
};
/**
 * Secondary button
 */
const secondaryButton = {
  label: 'Secondary button',
  category: ButtonCategory.SECONDARY,
  size: Size.MEDIUM,
};
/**
 * Tertiary button
 */
const tertiaryButton = {
  label: 'Tertiary button',
  category: ButtonCategory.TERTIARY,
  size: Size.MEDIUM,
};

// BUTTONS //
/**
 * Primary button story
 */
export const Primary: StoryObj<StoryType> = {
  args: primaryButton,
};
/**
 * Secondary button story
 */
export const Secondary: StoryObj<StoryType> = {
  args: secondaryButton,
};
/**
 * Tertiary button story
 */
export const Tertiary: StoryObj<StoryType> = {
  args: tertiaryButton,
};

// BUTTONS WITH ICON //
/**
 * Primary button with icon suffix story
 */
export const PrimaryWithIconSuffix: StoryObj<StoryType> = {
  args: {
    ...primaryButton,
    icon: 'search_outline',
    iconPosition: ButtonIconPosition.SUFFIX,
  },
};
/**
 * Secondary button with icon story
 */
export const SecondaryWithIcon: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    icon: 'search_outline',
  },
};
/**
 * Tertiary button with icon story
 */
export const TertiaryWithIcon: StoryObj<StoryType> = {
  args: {
    ...tertiaryButton,
    icon: 'search_outline',
  },
};

// BUTTON SIZES //
/**
 * Small button story
 */
export const SmallSecondary: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    size: Size.SMALL,
  },
};
/**
 * Medium button story
 */
export const MediumSecondary: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    size: Size.MEDIUM,
  },
};
/**
 * Large button story
 */
export const LargeSecondary: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    size: Size.LARGE,
  },
};

// BUTTON VARIANTS //
/**
 * Primary button primary variant story
 */
export const PrimaryVariantPrimaryButton: StoryObj<StoryType> = {
  args: {
    ...primaryButton,
    variant: Variant.PRIMARY,
  },
};
/**
 * Primary button danger variant story
 */
export const DangerVariantPrimaryButton: StoryObj<StoryType> = {
  args: {
    ...primaryButton,
    variant: Variant.DANGER,
  },
};
/**
 * Primary button success variant story
 */
export const SuccessVariantPrimaryButton: StoryObj<StoryType> = {
  args: {
    ...primaryButton,
    variant: Variant.SUCCESS,
  },
};
/**
 * Primary button grey variant story
 */
export const GreyVariantPrimaryButton: StoryObj<StoryType> = {
  args: {
    ...primaryButton,
    variant: Variant.GREY,
  },
};
/**
 * Secondary button primary variant story
 */
export const PrimaryVariantSecondaryButton: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    variant: Variant.PRIMARY,
  },
};
/**
 * Secondary button danger variant story
 */
export const DangerVariantSecondaryButton: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    variant: Variant.DANGER,
  },
};
/**
 * Secondary button success variant story
 */
export const SuccessVariantSecondaryButton: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    variant: Variant.SUCCESS,
  },
};
/**
 * Secondary button grey variant story
 */
export const GreyVariantSecondaryButton: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    variant: Variant.GREY,
  },
};
/**
 * Tertiary button primary variant story
 */
export const PrimaryVariantTertiaryButton: StoryObj<StoryType> = {
  args: {
    ...tertiaryButton,
    variant: Variant.PRIMARY,
  },
};
/**
 * Tertiary button danger variant story
 */
export const DangerVariantTertiaryButton: StoryObj<StoryType> = {
  args: {
    ...tertiaryButton,
    variant: Variant.DANGER,
  },
};
/**
 * Tertiary button success variant story
 */
export const SuccessVariantTertiaryButton: StoryObj<StoryType> = {
  args: {
    ...tertiaryButton,
    variant: Variant.SUCCESS,
  },
};
/**
 * Tertiary button grey variant story
 */
export const GreyVariantTertiaryButton: StoryObj<StoryType> = {
  args: {
    ...tertiaryButton,
    variant: Variant.GREY,
  },
};

// BUTTONS WITH SPINNER //
/**
 * Primary button with spinner suffix story
 */
export const PrimaryWithSpinnerSuffix: StoryObj<StoryType> = {
  args: {
    ...primaryButton,
    loading: true,
    iconPosition: ButtonIconPosition.SUFFIX,
    variant: Variant.DEFAULT,
  },
};
/**
 * Secondary button with spinner story
 */
export const SecondaryWithSpinner: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    loading: true,
    variant: Variant.DEFAULT,
  },
};
/**
 * Tertiary button with spinner story
 */
export const TertiaryWithSpinner: StoryObj<StoryType> = {
  args: {
    ...tertiaryButton,
    loading: true,
    variant: Variant.DEFAULT,
  },
};
