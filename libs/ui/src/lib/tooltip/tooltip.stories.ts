import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { TooltipComponent } from './tooltip.component';
import { tooltipExamplesPositions } from './types/tooltip-example-positions';
import { TooltipModule } from './tooltip.module';

export default {
  title: 'Components/Tooltip',
  tags: ['autodocs'],
  component: TooltipComponent,
  argTypes: {
    position: {
      options: tooltipExamplesPositions,
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
  position: 'top',
  hint: 'test',
};
/**
 * Top left element
 */
export const TopLeftExample = Template.bind({});
TopLeftExample.args = {
  position: 'top-left',
  hint: 'test',
};
/**
 * Top right element
 */
export const TopRightExample = Template.bind({});
TopRightExample.args = {
  position: 'top-right',
  hint: 'test',
};
/**
 * Bottom centered element
 */
export const BottomExample = Template.bind({});
BottomExample.args = {
  position: 'bottom',
  hint: 'test',
};
/**
 * Bottom left element
 */
export const BottomLeftExample = Template.bind({});
BottomLeftExample.args = {
  position: 'bottom-left',
  hint: 'test',
};
/**
 * Bottom right element
 */
export const BottomRightExample = Template.bind({});
BottomRightExample.args = {
  position: 'bottom-right',
  hint: 'test',
};
/**
 * Middle left element
 */
export const LeftExample = Template.bind({});
LeftExample.args = {
  position: 'left',
  hint: 'test',
};
/**
 * Middle right element
 */
export const RightExample = Template.bind({});
RightExample.args = {
  position: 'right',
  hint: 'test',
};
/**
 * Long text element
 */
export const LongTextExample = Template.bind({});
LongTextExample.args = {
  position: 'top',
  hint: 'The Tooltip can either be assigned auto height and width values or specific pixel values. The width and height properties are used to set the outer dimension ... The Tooltip can either be assigned auto height and width values or specific pixel values. The width and height properties are used to set the outer dimension ... The Tooltip can either be assigned auto height and width values or specific pixel values. The width and height properties are used to set the outer dimension ... The Tooltip can either be assigned auto height and width values or specific pixel values. The width and height properties are used to set the outer dimension ...',
};
