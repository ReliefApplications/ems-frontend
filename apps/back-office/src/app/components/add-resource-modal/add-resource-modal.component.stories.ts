import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { AddResourceModalComponent } from './add-resource-modal.component';

export default {
  title: 'AddResourceModalComponent',
  component: AddResourceModalComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<AddResourceModalComponent>;

const Template: Story<AddResourceModalComponent> = (
  args: AddResourceModalComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
