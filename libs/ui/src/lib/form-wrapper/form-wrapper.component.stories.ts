import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { FormWrapperComponent } from './form-wrapper.component';

export default {
  title: 'FormWrapperComponent',
  component: FormWrapperComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<FormWrapperComponent>;

const Template: Story<FormWrapperComponent> = (args: FormWrapperComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
