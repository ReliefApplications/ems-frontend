import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { RadioComponent } from './radio.component';
import { RadioModule } from './radio.module'
import { RadioOrientation } from './enums/orientation.enum';

type RadioOption = {
  label: string;
  value: string;
}

export default {
  title: 'RadioComponent',
  component: RadioComponent,
  decorators: [
    moduleMetadata({
      imports: [RadioModule],
    })
  ],
} as Meta<RadioComponent>;

const radioOptions: RadioOption[] = [
  {
    label: "Email",
    value: "email"
  },
  {
    label: "Phone (SMS)",
    value: "sms"
  },
  {
    label: "Push Notification",
    value: "push"
  }
]

const Template: StoryFn<RadioComponent> = (args: RadioComponent) => ({
  props: args,
});

export const RadioTemplate1 = Template.bind({});
RadioTemplate1.args = {
  name: "notification-method",
  disabled: false,
  required: true,
  orientation: RadioOrientation.HORIZONTAL,
  ariaLabelledby: '',
  options: radioOptions
};