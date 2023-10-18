import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ChoseRoleComponent } from './chose-role.component';

export default {
  title: 'ChoseRoleComponent',
  component: ChoseRoleComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ChoseRoleComponent>;

const Template: Story<ChoseRoleComponent> = (args: ChoseRoleComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
