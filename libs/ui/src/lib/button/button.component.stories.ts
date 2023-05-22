import {
  moduleMetadata,
  Meta,
  StoryFn,
  componentWrapperDecorator,
} from '@storybook/angular';
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
    componentWrapperDecorator((story) => {
      story = story.replace(/></, '>Button label<');
      return `<div class="h-96">${story}</div>`;
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
