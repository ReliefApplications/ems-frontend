import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { AddStepComponent } from './add-step.component';

export default {
  title: 'AddStepComponent',
  component: AddStepComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<AddStepComponent>;

const Template: Story<AddStepComponent> = (args: AddStepComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
