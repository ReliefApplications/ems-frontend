import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { WorkflowComponent } from './workflow.component';

export default {
  title: 'WorkflowComponent',
  component: WorkflowComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<WorkflowComponent>;

const Template: Story<WorkflowComponent> = (args: WorkflowComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
