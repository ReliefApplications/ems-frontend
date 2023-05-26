import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { SafeAlertModule } from './alert.module';
import { SafeAlertComponent } from './alert.component';
import { SafeIconModule } from '../icon/icon.module';
import { alertVariants } from './types/alert-variant';

export default {
  component: SafeAlertComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeAlertModule, SafeIconModule],
    }),
  ],
  title: 'UI/Alert',
  argTypes: {
    variant: {
      options: alertVariants,
      control: { type: 'select' },
    },
    content: {
      defaultValue: 'This is an alert',
      control: { type: 'text' },
    },
    border: {
      defaultValue: false,
      control: { type: 'boolean' },
    },
  },
} as Meta;

/**
 * Gets the template for the storybook rendering of the SafeAlertComponent
 *
 * @param args arguments for the SafeAlertComponent
 * @returns the story representation of the SafeAlertComponent
 */
const TEMPLATE_WITH_TEXT: StoryFn<SafeAlertComponent> = (args) => ({
  template: `<safe-alert [variant]="variant" [closable]="variant">{{content}}</safe-alert>`,
  props: {
    ...args,
  },
});

export const DEFAULT = {
  render: TEMPLATE_WITH_TEXT,
  name: 'Default',

  args: {
    variant: 'default',
    closable: true,
  },
};

/**
 * Template to create alert modal with the optional left border
 *
 * @param args args
 * @returns StoryFn<SafeAlertComponent> story
 */
const TemplateWithBorder: StoryFn<SafeAlertComponent> = (args: any) => {
  args.border = true;
  return {
    template: `
    <safe-alert [variant]="variant" [closable]="variant" [border]="border">
      <safe-icon icon="info"></safe-icon>
      Test alert
    </safe-alert>
    `,
    props: {
      ...args,
    },
  };
};

/** Alert modal with the optional left border */
export const WithBorder = TemplateWithBorder.bind({});
WithBorder.args = {
  variant: 'default',
  closable: true,
  border: true,
};
