import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { TooltipComponent } from './tooltip.component';
import { TooltipExamplesPositions } from './enums/tooltip-example-positions.enum';
import { TooltipModule } from './tooltip.module';

export default {
  title: 'TooltipComponent',
  component: TooltipComponent,
  argTypes: {
    position: {
      options: TooltipExamplesPositions,
      control: 'select',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<TooltipComponent>;

/**
 * Template for storybook's test of the directive
 * @param args
 */
const Template: Story<TooltipComponent> = (args: TooltipComponent) => ({
  props: args,
  moduleMetadata: {
    // (3) don't forget it
    imports: [TooltipModule],
  },
  enum: TooltipExamplesPositions,
});

/**
 * Top centered element
 */
export const TopExample = Template.bind({});
TopExample.args = {
  position: TooltipExamplesPositions.TOP,
  hint: 'test',
};
/**
 * Top left element
 */
export const TopLeftExample = Template.bind({});
TopLeftExample.args = {
  position: TooltipExamplesPositions.TOPLEFT,
  hint: 'test',
};
/**
 * Top right element
 */
export const TopRightExample = Template.bind({});
TopRightExample.args = {
  position: TooltipExamplesPositions.TOPRIGHT,
  hint: 'test',
};
/**
 * Bottom centered element
 */
export const BottomExample = Template.bind({});
BottomExample.args = {
  position: TooltipExamplesPositions.BOTTOM,
  hint: 'test',
};
/**
 * Bottom left element
 */
export const BottomLeftExample = Template.bind({});
BottomLeftExample.args = {
  position: TooltipExamplesPositions.BOTTOMLEFT,
  hint: 'test',
};
/**
 * Bottom right element
 */
export const BottomRightExample = Template.bind({});
BottomRightExample.args = {
  position: TooltipExamplesPositions.BOTTOMRIGHT,
  hint: 'test',
};
/**
 * Middle left element
 */
export const LeftExample = Template.bind({});
LeftExample.args = {
  position: TooltipExamplesPositions.LEFT,
  hint: 'test',
};
/**
 * Middle right element
 */
export const RightExample = Template.bind({});
RightExample.args = {
  position: TooltipExamplesPositions.RIGHT,
  hint: 'test',
};
