import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UpdateRecordComponent } from './update-record.component';

export default {
  title: 'UpdateRecordComponent',
  component: UpdateRecordComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<UpdateRecordComponent>;

const Template: Story<UpdateRecordComponent> = (
  args: UpdateRecordComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
