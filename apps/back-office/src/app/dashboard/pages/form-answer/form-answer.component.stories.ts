import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { FormAnswerComponent } from './form-answer.component';

export default {
  title: 'FormAnswerComponent',
  component: FormAnswerComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<FormAnswerComponent>;

const Template: Story<FormAnswerComponent> = (args: FormAnswerComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
