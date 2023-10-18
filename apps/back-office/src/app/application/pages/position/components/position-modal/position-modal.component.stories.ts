import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { PositionModalComponent } from './position-modal.component';

export default {
  title: 'PositionModalComponent',
  component: PositionModalComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<PositionModalComponent>;

const Template: Story<PositionModalComponent> = (
  args: PositionModalComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
