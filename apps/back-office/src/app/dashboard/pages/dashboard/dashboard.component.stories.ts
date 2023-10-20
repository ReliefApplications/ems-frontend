import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DashboardComponent } from './dashboard.component';
import { Apollo } from 'apollo-angular';

export default {
  title: 'DashboardComponent',
  component: DashboardComponent,
  decorators: [
    moduleMetadata({
      imports: [],
      providers: [Apollo],
    }),
  ],
} as Meta<DashboardComponent>;

const Template: Story<DashboardComponent> = (args: DashboardComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
