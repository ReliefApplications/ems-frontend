import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { RadioComponent } from './radio.component';
import { RadioModule } from './radio.module'
import { RadioOrientation } from './enums/orientation.enum';

type RadioOption = {
  name: string;
  label: string;
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
    name: "email",
    label: "Email"
  },
  {
    name: "phone",
    label: "Phone (SMS)"
  },
  {
    name: "pushNotification",
    label: "Push Notification"
  }
]

const Template: StoryFn<RadioComponent> = (args: RadioComponent) => ({
  props: args,
});

export const RadioTemplate1 = Template.bind({});
RadioTemplate1.args = {
  disabled: false,
  required: true,
  orientation: RadioOrientation.HORIZONTAL,
  ariaLabelledby: '',
  options: radioOptions
};