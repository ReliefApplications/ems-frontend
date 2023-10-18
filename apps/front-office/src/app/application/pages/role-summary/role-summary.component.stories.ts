import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { RoleSummaryComponent } from './role-summary.component';

export default {
  title: 'RoleSummaryComponent',
  component: RoleSummaryComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<RoleSummaryComponent>;

const Template: Story<RoleSummaryComponent> = (args: RoleSummaryComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
