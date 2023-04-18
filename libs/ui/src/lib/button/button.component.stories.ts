import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';
import { ButtonModule } from './button.module';
import { Category } from '../shared/category.enum';
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
      template: `<ui-button [isIcon]="${props.isIcon ?? false}" [loading]="${
        props.loading ?? false
      }" [size]="'${props.size}'" [icon]="'${
        props.icon ?? ''
      }'" [iconPosition]="'${props.iconPosition ?? ''}'" [category]=${
        props.category
      } [variant]="'${props.variant ?? ''}'">${label}</ui-button>`,
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
  category: Category.PRIMARY,
  size: Size.MEDIUM,
};
/**
 * Secondary button
 */
const secondaryButton = {
  label: 'Secondary button',
  category: Category.SECONDARY,
  size: Size.MEDIUM,
};
/**
 * Tertiary button
 */
const tertiaryButton = {
  label: 'Tertiary button',
  category: Category.TERTIARY,
  size: Size.MEDIUM,
};

// PRIMARY BUTTONS //
/**
 * Primary button story
 */
export const Primary: StoryObj<StoryType> = {
  args: primaryButton,
};

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
 * Primary button primary variant story
 */
export const PrimaryButtonPrimaryVariant: StoryObj<StoryType> = {
  args: {
    ...primaryButton,
    variant: Variant.PRIMARY,
  },
};
/**
 * Primary button danger variant story
 */
export const PrimaryButtonDangerVariant: StoryObj<StoryType> = {
  args: {
    ...primaryButton,
    variant: Variant.DANGER,
  },
};
/**
 * Primary button success variant story
 */
export const PrimaryButtonSuccessVariant: StoryObj<StoryType> = {
  args: {
    ...primaryButton,
    variant: Variant.SUCCESS,
  },
};

/**
 * Primary button grey variant story
 */
export const PrimaryButtonGreyVariant: StoryObj<StoryType> = {
  args: {
    ...primaryButton,
    variant: Variant.GREY,
  },
};

/**
 * Primary button light variant story
 */
export const PrimaryButtonLightVariant: StoryObj<StoryType> = {
  args: {
    ...primaryButton,
    variant: Variant.LIGHT,
  },
};

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

// SECONDARY BUTTONS //
/**
 * Secondary button story
 */
export const Secondary: StoryObj<StoryType> = {
  args: secondaryButton,
};

/**
 * Secondary button with icon story
 */
export const SecondaryWithIcon: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    icon: 'search_outline',
    variant: Variant.PRIMARY,
  },
};

/**
 * Small button story
 */
export const SecondarySmall: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    size: Size.SMALL,
    variant: Variant.PRIMARY,
  },
};
/**
 * Medium button story
 */
export const SecondaryMedium: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    size: Size.MEDIUM,
    variant: Variant.PRIMARY,
  },
};
/**
 * Large button story
 */
export const SecondaryLarge: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    size: Size.LARGE,
    variant: Variant.PRIMARY,
  },
};

/**
 * Secondary small icon button primary variant story
 */
export const SecondarySmallIconButtonPrimaryVariant: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    isIcon: true,
    icon: 'search_outline',
    size: Size.SMALL,
    variant: Variant.PRIMARY,
  },
};

/**
 * Secondary medium icon button primary variant story
 */
export const SecondaryMediumIconButtonPrimaryVariant: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    isIcon: true,
    icon: 'search_outline',
    variant: Variant.PRIMARY,
  },
};

/**
 * Secondary large icon button primary variant story
 */
export const SecondaryLargeIconButtonPrimaryVariant: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    isIcon: true,
    icon: 'search_outline',
    size: Size.LARGE,
    variant: Variant.PRIMARY,
  },
};

/**
 * Secondary button primary variant story
 */
export const SecondaryButtonPrimaryVariant: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    variant: Variant.PRIMARY,
  },
};
/**
 * Secondary button danger variant story
 */
export const SecondaryButtonDangerVariant: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    variant: Variant.DANGER,
  },
};
/**
 * Secondary button success variant story
 */
export const SecondaryButtonSuccessVariant: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    variant: Variant.SUCCESS,
  },
};
/**
 * Secondary button grey variant story
 */
export const SecondaryButtonGreyVariant: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    variant: Variant.GREY,
  },
};

/**
 * Secondary button light variant story
 */
export const SecondaryButtonLightVariant: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    variant: Variant.LIGHT,
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
 * Secondary button with spinner story
 */
export const SecondaryPrimaryVariantWithSpinner: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    loading: true,
    variant: Variant.PRIMARY,
  },
};

// TERTIARY BUTTONS //
/**
 * Tertiary button story
 */
export const Tertiary: StoryObj<StoryType> = {
  args: tertiaryButton,
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

/**
 * Tertiary button primary variant story
 */
export const TertiaryButtonPrimaryVariant: StoryObj<StoryType> = {
  args: {
    ...tertiaryButton,
    variant: Variant.PRIMARY,
  },
};
/**
 * Tertiary button danger variant story
 */
export const TertiaryButtonDangerVariant: StoryObj<StoryType> = {
  args: {
    ...tertiaryButton,
    variant: Variant.DANGER,
  },
};
/**
 * Tertiary button success variant story
 */
export const TertiaryButtonSuccessVariant: StoryObj<StoryType> = {
  args: {
    ...tertiaryButton,
    variant: Variant.SUCCESS,
  },
};
/**
 * Tertiary button grey variant story
 */
export const TertiaryButtonGreyVariant: StoryObj<StoryType> = {
  args: {
    ...tertiaryButton,
    variant: Variant.GREY,
  },
};

/**
 * Tertiary button light variant story
 */
export const TertiaryButtonLightVariant: StoryObj<StoryType> = {
  args: {
    ...tertiaryButton,
    variant: Variant.LIGHT,
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
