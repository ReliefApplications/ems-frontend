import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { FormComponent } from './form.component';

export default {
  title: 'FormComponent',
  component: FormComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<FormComponent>;

const Template: Story<FormComponent> = (args: FormComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
