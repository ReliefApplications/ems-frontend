import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ShareComponent } from './share.component';

export default {
  title: 'ShareComponent',
  component: ShareComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ShareComponent>;

const Template: Story<ShareComponent> = (args: ShareComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
