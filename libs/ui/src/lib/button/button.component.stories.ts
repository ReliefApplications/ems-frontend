import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { addons } from '@storybook/addons';
import { FORCE_RE_RENDER } from '@storybook/core-events';
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
  title: 'Button',
  component: ButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [ButtonModule, IconModule, SpinnerModule],
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
    size: {
      options: Size,
      control: {
        type: 'select',
      },
    },
    iconPosition: {
      options: ButtonIconPosition,
      control: {
        type: 'select',
      },
      defaultValue: ButtonIconPosition.PREFIX,
    },
    icon: {
      control: 'text',
    },
    label: {
      control: 'text',
      defaultValue: 'Button label',
    },
    isIcon: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    loading: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
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

/**
 * Template button
 *
 * @param {StoryType} args args
 * @returns StoryType
 */
const Template: StoryFn<StoryType> = (args: StoryType) => ({
  props: args,
});

/** Primary button */
export const Primary = Template.bind({});
Primary.args = {
  ...primaryButton,
};

/** Secondary button */
export const Secondary = Template.bind({});
Secondary.args = {
  ...secondaryButton,
};

/** Tertiary button */
export const Tertiary = Template.bind({});
Tertiary.args = {
  ...tertiaryButton,
};

/**
 * Callback to test the button group directive change event
 *
 * @param status Selected status from the buttons
 */
const updateStatus = (status: any) => {
  currentStatus = status;
  addons.getChannel().emit(FORCE_RE_RENDER);
};

/**
 * Status array for story testing
 */
const statuses = ['Active', 'Pending', 'Archived'];
let currentStatus = statuses[0];

/**
 * Template button group
 *
 * @param {ButtonComponent} args args
 * @returns ButtonComponent
 */
const GroupTemplate: StoryFn<ButtonComponent> = (args: ButtonComponent) => {
  return {
    component: ButtonComponent,
    template: `<div [uiButtonGroup]="currentStatus" (uiButtonGroupChange)="updateStatus($event)">
    <ui-button [variant]="'${args.variant}'" *ngFor="let status of statuses" [value]="status">{{ status }}
    </ui-button>
    </div>
    <br>
    <p>value: {{currentStatus}}</p>
    `,
    props: {
      ...args,
      statuses,
      updateStatus,
      currentStatus,
    },
  };
};

/** Group button */
export const ButtonGroup = GroupTemplate.bind({});
