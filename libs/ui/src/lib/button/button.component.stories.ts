import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { addons } from '@storybook/addons';
import { FORCE_RE_RENDER } from '@storybook/core-events';
import { ButtonComponent } from './button.component';
import { ButtonModule } from './button.module';
import { categories } from '../types/category';
import { sizes } from '../types/size';
import { buttonIconPositions } from './types/button-icon-position';
import { variants } from '../types/variant';
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
    iconPosition: {
      options: buttonIconPositions,
      control: {
        type: 'select',
      },
      defaultValue: 'prefix',
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
  category: 'primary',
  variant: 'default',
  size: 'medium',
  icon: null,
};
/**
 * Secondary button
 */
const secondaryButton = {
  label: 'Secondary button',
  category: 'secondary',
  variant: 'default',
  size: 'medium',
  icon: null,
};
/**
 * Tertiary button
 */
const tertiaryButton = {
  label: 'Tertiary button',
  category: 'tertiary',
  variant: 'default',
  size: 'medium',
  icon: null,
};

/**
 * Disable click test
 *
 * @returns alert
 */
const testClick = () => window.alert('Should not show if disabled!!');

/**
 * Template button
 *
 * @param {StoryType} args args
 * @returns StoryType
 */
const Template: StoryFn<StoryType> = (args: StoryType) => {
  return {
    template: `<ui-button 
    (click)="testClick()" 
    [disabled]="${args.disabled}"
    [icon]="${args.icon}"
    [isIcon]="${args.isIcon}" 
    [size]="'${args.size}'" 
    [variant]="'${args.variant}'" 
    [category]="'${args.category}'">
    ${args.label}
    </ui-button>`,
    props: {
      ...args,
      testClick,
    },
  };
};

/** Primary button */
export const Primary = Template.bind({});
Primary.args = {
  ...(primaryButton as any),
};

/** Secondary button */
export const Secondary = Template.bind({});
Secondary.args = {
  ...(secondaryButton as any),
};

/** Tertiary button */
export const Tertiary = Template.bind({});
Tertiary.args = {
  ...(tertiaryButton as any),
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
