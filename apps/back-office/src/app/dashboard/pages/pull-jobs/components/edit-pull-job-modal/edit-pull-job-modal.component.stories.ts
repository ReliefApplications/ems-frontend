import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { EditPullJobModalComponent } from './edit-pull-job-modal.component';

export default {
  title: 'EditPullJobModalComponent',
  component: EditPullJobModalComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<EditPullJobModalComponent>;

const Template: Story<EditPullJobModalComponent> = (
  args: EditPullJobModalComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
