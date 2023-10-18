import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UserSummaryComponent } from './user-summary.component';

export default {
  title: 'UserSummaryComponent',
  component: UserSummaryComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<UserSummaryComponent>;

const Template: Story<UserSummaryComponent> = (args: UserSummaryComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
