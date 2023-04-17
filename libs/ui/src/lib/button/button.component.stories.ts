import { moduleMetadata, StoryFn, Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';
import { ButtonIconPosition } from './enums/button-icon-position.enum';
import { ButtonModule } from './button.module';

type StoryType = ButtonComponent & { label?: string };

export default {
  title: 'ButtonComponent',
  component: ButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [ButtonModule],
    }),
  ],
  render: (args) => {
    const { label, ...props } = args;
    return {
      props,
      template: `<ui-button>${label}</ui-button>`,
    };
  },
} as Meta<StoryType>;

// const Template: StoryFn<ButtonComponent> = (args) => ({
//   props: args,
// });

export const Primary: StoryObj<StoryType> = {
  args: {
    label: 'My button',
  },
};

// Primary.args = {
//   content: 'text',
//   icon: '',
//   iconPosition: ButtonIconPosition.PREFIX,
//   action: () => {
//     console.log('Action triggered!');
//   },
// };
