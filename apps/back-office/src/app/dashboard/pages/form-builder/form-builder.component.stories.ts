import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { FormBuilderComponent } from './form-builder.component';

export default {
  title: 'FormBuilderComponent',
  component: FormBuilderComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<FormBuilderComponent>;

const Template: Story<FormBuilderComponent> = (args: FormBuilderComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
