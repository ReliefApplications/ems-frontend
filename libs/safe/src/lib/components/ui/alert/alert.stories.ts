import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { SafeAlertModule } from './alert.module';
import { SafeAlertComponent } from './alert.component';
import { AlertVariant } from './alert-variant.enum';

export default {
  component: SafeAlertComponent,
  decorators: [
    moduleMetadata({
      imports: [SafeAlertModule],
    }),
  ],
  title: 'UI/Alert',
  argTypes: {
    variant: {
      options: [
        AlertVariant.DEFAULT,
        AlertVariant.PRIMARY,
        AlertVariant.SUCCESS,
        AlertVariant.DANGER,
        AlertVariant.WARNING,
      ],
      control: { type: 'select' },
    },
    content: {
      defaultValue: 'This is an alert',
      control: { type: 'text' },
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
  template: `<safe-alert [variant]="variant">{{content}}</safe-alert>`,
  props: {
    ...args,
  },
});

export const DEFAULT = {
  render: TEMPLATE_WITH_TEXT,
  name: 'Default',

  args: {
    variant: AlertVariant.DEFAULT,
    closable: true,
  },
};
