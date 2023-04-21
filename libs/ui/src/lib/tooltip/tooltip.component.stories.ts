import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { TooltipComponent } from './tooltip.component';
import { TooltipExamplesPositions } from './enums/tooltip-example-positions.enum';
import { TooltipModule } from './tooltip.module';

export default {
  title: 'Tooltip',
  component: TooltipComponent,
  argTypes: {
    position: {
      options: TooltipExamplesPositions,
      control: 'select',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [TooltipModule],
    }),
  ],
} as Meta<TooltipComponent>;

/**
 * Template for storybook's test of the directive
 *
 * @param args Tooltip component args
 * @returns TooltipComponent
 */
const Template: Story<TooltipComponent> = (args: TooltipComponent) => ({
  props: args,
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
  position: TooltipExamplesPositions.TOP_LEFT,
  hint: 'test',
};
/**
 * Top right element
 */
export const TopRightExample = Template.bind({});
TopRightExample.args = {
  position: TooltipExamplesPositions.TOP_RIGHT,
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
  position: TooltipExamplesPositions.BOTTOM_LEFT,
  hint: 'test',
};
/**
 * Bottom right element
 */
export const BottomRightExample = Template.bind({});
BottomRightExample.args = {
  position: TooltipExamplesPositions.BOTTOM_RIGHT,
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
/**
 * Long text element
 */
export const LongTextExample = Template.bind({});
LongTextExample.args = {
  position: TooltipExamplesPositions.TOP,
  hint: 'The Tooltip can either be assigned auto height and width values or specific pixel values. The width and height properties are used to set the outer dimension ... The Tooltip can either be assigned auto height and width values or specific pixel values. The width and height properties are used to set the outer dimension ... The Tooltip can either be assigned auto height and width values or specific pixel values. The width and height properties are used to set the outer dimension ... The Tooltip can either be assigned auto height and width values or specific pixel values. The width and height properties are used to set the outer dimension ...',
};
