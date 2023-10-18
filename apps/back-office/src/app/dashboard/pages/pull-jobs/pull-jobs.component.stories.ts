import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { PullJobsComponent } from './pull-jobs.component';

export default {
  title: 'PullJobsComponent',
  component: PullJobsComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<PullJobsComponent>;

const Template: Story<PullJobsComponent> = (args: PullJobsComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
