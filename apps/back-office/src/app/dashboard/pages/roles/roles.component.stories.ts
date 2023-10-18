import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { RolesComponent } from './roles.component';

export default {
  title: 'RolesComponent',
  component: RolesComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<RolesComponent>;

const Template: Story<RolesComponent> = (args: RolesComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
