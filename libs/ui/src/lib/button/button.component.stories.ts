import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { ButtonComponent } from './button.component';
import { ButtonIconPosition } from './enums/button-icon-position.enum';

export default {
  title: 'ButtonComponent',
  component: ButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ButtonComponent>;

const Template: StoryFn<ButtonComponent> = (args: ButtonComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  icon: '',
  iconPosition: ButtonIconPosition.PREFIX,
  action: () => {
    console.log('Action triggered!');
  },
};
