import {
  moduleMetadata,
  Meta,
  StoryFn,
  componentWrapperDecorator,
} from '@storybook/angular';
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
    componentWrapperDecorator((story) => {
      story = story.replace(/></, '>Button label<');
      return `<div class="h-96">${story}</div>`;
    }),
  ],
  argTypes: {
    category: {
      options: Object.keys(Category),
      control: {
        type: 'select',
      },
    },
    variant: {
      options: Object.keys(Variant),
      control: {
        type: 'select',
      },
      defaultValue: Variant.DEFAULT,
    },
    size: {
      options: Object.keys(Size),
      control: {
        type: 'select',
      },
    },
    iconPosition: {
      options: Object.keys(ButtonIconPosition),
      control: {
        type: 'select',
      },
      defaultValue: ButtonIconPosition.PREFIX,
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
  category: Category.PRIMARY,
  variant: Variant.DEFAULT,
  size: Size.MEDIUM,
};
/**
 * Secondary button
 */
const secondaryButton = {
  label: 'Secondary button',
  category: Category.SECONDARY,
  variant: Variant.DEFAULT,
  size: Size.MEDIUM,
};
/**
 * Tertiary button
 */
const tertiaryButton = {
  label: 'Tertiary button',
  category: Category.TERTIARY,
  variant: Variant.DEFAULT,
  size: Size.MEDIUM,
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
    [icon]="'${args.icon}'"
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
