import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { PositionComponent } from './position.component';

export default {
  title: 'PositionComponent',
  component: PositionComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<PositionComponent>;

const Template: Story<PositionComponent> = (args: PositionComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
