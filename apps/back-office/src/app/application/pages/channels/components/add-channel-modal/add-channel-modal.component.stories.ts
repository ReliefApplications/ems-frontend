import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { AddChannelModalComponent } from './add-channel-modal.component';

export default {
  title: 'AddChannelModalComponent',
  component: AddChannelModalComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<AddChannelModalComponent>;

const Template: Story<AddChannelModalComponent> = (
  args: AddChannelModalComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
