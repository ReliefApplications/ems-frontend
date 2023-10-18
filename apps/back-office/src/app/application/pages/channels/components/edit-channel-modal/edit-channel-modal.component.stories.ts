import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { EditChannelModalComponent } from './edit-channel-modal.component';

export default {
  title: 'EditChannelModalComponent',
  component: EditChannelModalComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<EditChannelModalComponent>;

const Template: Story<EditChannelModalComponent> = (
  args: EditChannelModalComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
