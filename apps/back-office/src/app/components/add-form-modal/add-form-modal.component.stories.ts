import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { AddFormModalComponent } from './add-form-modal.component';

export default {
  title: 'AddFormModalComponent',
  component: AddFormModalComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<AddFormModalComponent>;

const Template: Story<AddFormModalComponent> = (
  args: AddFormModalComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
