import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';
import { ButtonIconPosition } from './enums/button-icon-position.enum';
import { ButtonModule } from './button.module';
import { ButtonCategory } from './enums/button-category.enum';
import { ButtonSize } from './enums/button-size.enum';

type StoryType = ButtonComponent & { label?: string };

export default {
  title: 'ButtonComponent',
  component: ButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [ButtonModule],
    }),
  ],
  render: (args) => {
    const { label, ...props } = args;
    console.log(props);
    return {
      props,
      template: `<ui-button [icon]=${props.icon} [category]=${props.category}>${label}</ui-button>`,
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
};
/**
 * Secondary button
 */
const secondaryButton = {
  label: 'Secondary button',
  category: ButtonCategory.SECONDARY,
};
/**
 * Tertiary button
 */
const tertiaryButton = {
  label: 'Tertiary button',
  category: ButtonCategory.TERTIARY,
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
 * Primary button with icon story
 */
export const PrimaryWithIcon: StoryObj<StoryType> = {
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
    size: ButtonSize.SMALL,
  },
};
/**
 * Medium button story
 */
export const MediumSecondary: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    size: ButtonSize.MEDIUM,
  },
};
/**
 * Large button story
 */
export const LargeSecondary: StoryObj<StoryType> = {
  args: {
    ...secondaryButton,
    size: ButtonSize.LARGE,
  },
};
