import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DashboardComponent } from './dashboard.component';

export default {
  title: 'DashboardComponent',
  component: DashboardComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<DashboardComponent>;

const Template: Story<DashboardComponent> = (args: DashboardComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
