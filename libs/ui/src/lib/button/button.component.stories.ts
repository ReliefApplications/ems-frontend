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
import { variants } from '../types/variant';
import { buttonIconPositions } from './types/button-icon-position';
import { IconModule } from '../icon/icon.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { CommonModule } from '@angular/common';

type StoryType = ButtonComponent & { label?: string };

export default {
  title: 'Button',
  component: ButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ButtonModule, IconModule, SpinnerModule],
    }),
    componentWrapperDecorator((story) => {
      story = story.replace(/></, '>Button label<');
      return `<div class="h-96">${story}</div>`;
    }),
  ],
  argTypes: {
    size: {
      options: sizes,
      control: {
        type: 'select',
      },
    },
  },
} as Meta<StoryType>;

/**
 * ArgTypes for individual button stories
 */
const individualBtnArgs = {
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
  iconPosition: {
    options: buttonIconPositions,
    control: {
      type: 'select',
    },
    defaultValue: 'prefix',
  },
  icon: {
    control: 'text',
    defaultValue: '',
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
  icon: '',
};
/**
 * Secondary button
 */
const secondaryButton = {
  label: 'Secondary button',
  category: 'secondary',
  variant: 'default',
  size: 'medium',
  icon: '',
};
/**
 * Tertiary button
 */
const tertiaryButton = {
  label: 'Tertiary button',
  category: 'tertiary',
  variant: 'default',
  size: 'medium',
  icon: '',
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
    template: `
      <ui-button
        (click)="testClick()"
        [disabled]="${args.disabled}"
        icon="${args.icon}"
        iconPosition="${args.iconPosition}"
        [loading]="${args.loading}"
        [isIcon]="${args.isIcon}"
        [size]="'${args.size}'"
        [variant]="'${args.variant}'"
        [category]="'${args.category}'"
      >
        ${args.label}
      </ui-button>
    `,
    props: {
      ...args,
      testClick,
    },
  };
};

/** Primary button */
export const Primary = Template.bind({});
Primary.argTypes = {
  ...(individualBtnArgs as any),
};
Primary.args = {
  ...(primaryButton as any),
};

/** Secondary button */
export const Secondary = Template.bind({});
Secondary.argTypes = {
  ...(individualBtnArgs as any),
};
Secondary.args = {
  ...(secondaryButton as any),
};

/** Tertiary button */
export const Tertiary = Template.bind({});
Tertiary.argTypes = {
  ...(individualBtnArgs as any),
};
Tertiary.args = {
  ...(tertiaryButton as any),
};

/**
 * List of all available buttons
 */
const configurations = [
  {
    title: 'Default',
    items: categories.map((category) => ({
      variant: 'default',
      category: category,
      text: 'default',
    })),
  },
  {
    title: 'Primary',
    items: categories.map((category) => ({
      variant: 'primary',
      category: category,
      text: 'primary',
    })),
  },
  {
    title: 'Success',
    items: categories.map((category) => ({
      variant: 'success',
      category: category,
      text: 'success',
    })),
  },
  {
    title: 'Danger',
    items: categories.map((category) => ({
      variant: 'danger',
      category: category,
      text: 'danger',
    })),
  },
  {
    title: 'Grey',
    items: categories.map((category) => ({
      variant: 'grey',
      category: category,
      text: 'grey',
    })),
  },
  {
    title: 'Light',
    items: categories.map((category) => ({
      variant: 'light',
      category: category,
      text: 'light',
    })),
  },
  {
    title: 'Warning',
    items: categories.map((category) => ({
      variant: 'warning',
      category: category,
      text: 'warning',
    })),
  },
  {
    title: 'Disabled',
    items: categories.map((category) => ({
      variant: 'primary',
      category: category,
      text: 'disabled',
      disabled: true,
    })),
  },
];

/**
 * Tertiary button
 */
const allButtons = {
  size: 'medium',
};

/**
 * Template button
 *
 * @param {StoryType} args args
 * @returns StoryType
 */
const AllButtonsTemplate: StoryFn<StoryType> = (args: StoryType) => {
  return {
    template: `
      <h1 class="text-lg mb-4">Grouped by variant</h1>
      <div class="flex flex-wrap gap-4">
        <div class="border rounded-lg" *ngFor="let variant of configurations">
          <h2 class="w-full text-center border-b py-2">{{variant.title}}</h2>
          <div class="flex gap-2 p-4">
            <ui-button
              *ngFor="let btn of variant.items"
              [variant]="btn.variant"
              [category]="btn.category"
              [disabled]="btn.disabled"
              [title]="btn.category"
              [size]="'${args.size}'"
            >
              {{btn.text}}
            </ui-button>
          </div>
        </div>
      </div>
    `,
    props: {
      configurations,
    },
  };
};

/** All buttons */
export const VariantsList = AllButtonsTemplate.bind({});
VariantsList.args = {
  ...(allButtons as any),
};
