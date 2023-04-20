import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { TooltipComponent } from './tooltip.component';
import { TooltipExamplesPositions } from './enums/tooltip-example-positions.enum';
import { TooltipModule } from './tooltip.module';

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
  moduleMetadata: {
    // (3) don't forget it
    imports: [TooltipModule],
  },
});

export const TopExample = Template.bind({});
TopExample.args = {
  position: TooltipExamplesPositions.TOP,
  hint: 'test',
};
export const TopLeftExample = Template.bind({});
TopLeftExample.args = {
  position: TooltipExamplesPositions.TOPLEFT,
  hint: 'test',
};
export const TopRightExample = Template.bind({});
TopRightExample.args = {
  position: TooltipExamplesPositions.TOPRIGHT,
  hint: 'test',
};
export const BottomExample = Template.bind({});
BottomExample.args = {
  position: TooltipExamplesPositions.BOTTOM,
  hint: 'test',
};
export const BottomLeftExample = Template.bind({});
BottomLeftExample.args = {
  position: TooltipExamplesPositions.BOTTOMLEFT,
  hint: 'test',
};
export const BottomRightExample = Template.bind({});
BottomRightExample.args = {
  position: TooltipExamplesPositions.BOTTOMRIGHT,
  hint: 'test',
};
export const LeftExample = Template.bind({});
LeftExample.args = {
  position: TooltipExamplesPositions.LEFT,
  hint: 'test',
};
export const RightExample = Template.bind({});
RightExample.args = {
  position: TooltipExamplesPositions.RIGHT,
  hint: 'test',
};
