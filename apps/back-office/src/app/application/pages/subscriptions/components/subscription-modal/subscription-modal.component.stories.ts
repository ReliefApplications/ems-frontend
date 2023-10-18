import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SubscriptionModalComponent } from './subscription-modal.component';

export default {
  title: 'SubscriptionModalComponent',
  component: SubscriptionModalComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<SubscriptionModalComponent>;

const Template: Story<SubscriptionModalComponent> = (
  args: SubscriptionModalComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
