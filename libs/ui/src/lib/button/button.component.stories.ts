import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { ButtonComponent } from './button.component';
import { ButtonIconPosition } from './enums/button-icon-position.enum';
import { ButtonModule } from './button.module';

export default {
  title: 'ButtonComponent',
  component: ButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [ButtonModule],
    }),
  ],
} as Meta<ButtonComponent>;

const Template: StoryFn<ButtonComponent> = (args: ButtonComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  label: '',
  icon: '',
  iconPosition: ButtonIconPosition.PREFIX,
  action: () => {
    console.log('Action triggered');
  },
};
