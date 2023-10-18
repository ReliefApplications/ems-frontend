import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { PositionAttributesComponent } from './position-attributes.component';

export default {
  title: 'PositionAttributesComponent',
  component: PositionAttributesComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<PositionAttributesComponent>;

const Template: Story<PositionAttributesComponent> = (
  args: PositionAttributesComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
