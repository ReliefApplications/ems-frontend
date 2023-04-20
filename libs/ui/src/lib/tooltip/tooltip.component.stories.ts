import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { TooltipComponent } from './tooltip.component';
import { TooltipExamplesPositions } from './enums/tooltip-example-positions.enum';

export default {
  title: 'TooltipComponent',
  component: TooltipComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<TooltipComponent>;

const Template: Story<TooltipComponent> = (args: TooltipComponent) => ({
  props: args,
});

export const TopExample = Template.bind({});
TopExample.args = {
  position: TooltipExamplesPositions.TOP,
};
export const TopLeftExample = Template.bind({});
TopLeftExample.args = {
  position: TooltipExamplesPositions.TOPLEFT,
};
export const TopRightExample = Template.bind({});
TopRightExample.args = {
  position: TooltipExamplesPositions.TOPRIGHT,
};
export const BottomExample = Template.bind({});
BottomExample.args = {
  position: TooltipExamplesPositions.BOTTOM,
};
export const BottomLeftExample = Template.bind({});
BottomLeftExample.args = {
  position: TooltipExamplesPositions.BOTTOMLEFT,
};
export const BottomRightExample = Template.bind({});
BottomRightExample.args = {
  position: TooltipExamplesPositions.BOTTOMRIGHT,
};
export const LeftExample = Template.bind({});
LeftExample.args = {
  position: TooltipExamplesPositions.LEFT,
};
export const RightExample = Template.bind({});
RightExample.args = {
  position: TooltipExamplesPositions.RIGHT,
};
