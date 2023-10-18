import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ChannelsComponent } from './channels.component';

export default {
  title: 'ChannelsComponent',
  component: ChannelsComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ChannelsComponent>;

const Template: Story<ChannelsComponent> = (args: ChannelsComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
