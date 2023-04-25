import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { ButtonGroupComponent } from './button-group.component';
import { ButtonGroupModule } from './button-group.module';
import { ButtonIconPosition } from '../button/enums/button-icon-position.enum';
import { ButtonModule } from '../button/button.module';
import { ButtonValue } from './interfaces/button-value.interface';
import { Size } from '../shared/size.enum';
import { Variant } from '../shared/variant.enum';

/** Buttons value example */
const buttons: ButtonValue[] = [
  {
    icon: 'edit',
    iconPosition: ButtonIconPosition.SUFFIX,
    label: 'Button 1',
  },
  {
    icon: 'delete',
    iconPosition: ButtonIconPosition.SUFFIX,
    label: 'Button 2',
  },
  {
    icon: 'keyboard_arrow_left',
    size: Size.SMALL,
    variant: Variant.GREY,
    isIcon: true,
  },
  {
    icon: 'keyboard_arrow_right',
    size: Size.SMALL,
    variant: Variant.GREY,
    isIcon: true,
  },
];

export default {
  title: 'Button Group',
  component: ButtonGroupComponent,
  argTypes: {
    values: {
      defaultValue: buttons,
      control: 'array',
    },
    selectedValue: {
      defaultValue: buttons[0],
      control: 'object',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [ButtonGroupModule, ButtonModule],
    }),
  ],
} as Meta<ButtonGroupComponent>;

/** Button group with 3 buttons and selected value */
export const SelectedValue: StoryObj<ButtonGroupComponent> = {
  args: {
    values: [buttons[0], buttons[1]],
    selectedValue: buttons[0],
  },
};

/** Button group with 2 buttons and without selected value */
export const WithoutSelectedValue: StoryObj<ButtonGroupComponent> = {
  args: {
    values: buttons,
  },
};

/** Button group with 2 arrow icons buttons and without selected value */
export const ArrowValues: StoryObj<ButtonGroupComponent> = {
  args: {
    values: [buttons[2], buttons[3]],
  },
};
