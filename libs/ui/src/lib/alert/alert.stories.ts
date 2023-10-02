import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { alertVariants } from './types/alert-variant';
import { AlertModule } from './alert.module';
import { AlertComponent } from './alert.component';

type Story = AlertComponent & { content?: string };

export default {
  title: 'Components/Alert',
  tags: ['autodocs'],
  component: AlertComponent,
  decorators: [
    moduleMetadata({
      imports: [AlertModule],
    }),
  ],
  argTypes: {
    variant: {
      options: alertVariants,
      control: { type: 'select' },
    },
    content: {
      description: 'Text content of the alert.',
      defaultValue: 'This is an alert',
      control: { type: 'text' },
    },
    border: {
      defaultValue: false,
      control: { type: 'boolean' },
    },
    closable: {
      defaultValue: false,
      control: { type: 'boolean' },
    },
    showIcon: {
      defaultValue: true,
      control: { type: 'boolean' },
    },
  },
  render: (args) => {
    const { variant, border, closable, content, showIcon, ...props } = args;
    return {
      props,
      template: `<ui-alert variant=${variant} [closable]=${closable} [border]=${border} [showIcon]=${showIcon}>${content}</ui-alert>`,
    };
  },
} as Meta<Story>;

/**
 * Alert story
 */
export const Default: StoryObj<Story> = {
  args: {
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pellentesque rhoncus odio, a accumsan purus venenatis eget. Suspendisse pretium nunc non tellus pulvinar, ut dapibus velit mollis. Vivamus dictum tempus ligula, vitae condimentum justo scelerisque sit amet. Donec ultrices quis turpis vitae tincidunt.',
  },
};
