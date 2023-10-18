import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SubscriptionsComponent } from './subscriptions.component';

export default {
  title: 'SubscriptionsComponent',
  component: SubscriptionsComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<SubscriptionsComponent>;

const Template: Story<SubscriptionsComponent> = (
  args: SubscriptionsComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
