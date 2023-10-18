import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UsersComponent } from './users.component';

export default {
  title: 'UsersComponent',
  component: UsersComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<UsersComponent>;

const Template: Story<UsersComponent> = (args: UsersComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
