import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { ButtonGroupComponent } from './button-group.component';
import { ButtonGroupModule } from './button-group.module';
import { ButtonIconPosition } from '../button/enums/button-icon-position.enum';
import { ButtonModule } from '../button/button.module';
import { ButtonValue } from './interfaces/button-value.interface';

/** Buttons value example */
const buttons: ButtonValue[] = [
  {
    icon: 'edit',
    iconPosition: ButtonIconPosition.PREFIX,
    label: 'teste 1',
  },
  {
    icon: 'save',
    iconPosition: ButtonIconPosition.SUFFIX,
    label: 'teste 2',
  },
  {
    icon: 'delete',
    iconPosition: ButtonIconPosition.SUFFIX,
    label: 'teste 3',
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
    values: buttons,
    selectedValue: buttons[0],
  },
};

/** Button group with 2 buttons and without selected value */
export const WithoutSelectedValue: StoryObj<ButtonGroupComponent> = {
  args: {
    values: [buttons[0], buttons[1]],
  },
};
