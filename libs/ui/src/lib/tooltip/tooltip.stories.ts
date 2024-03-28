import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { TooltipComponent } from './tooltip.component';
import { TooltipModule } from './tooltip.module';
import { TooltipPosition, tooltipPositions } from './types/tooltip-positions';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-tooltip-dummy',
  template: ` <button [uiTooltip]="tooltip" [uiTooltipPosition]="position">
    Hover me
  </button>`,
})
class TooltipDummyComponent {
  @Input() public tooltip = '';
  @Input() public position: TooltipPosition = 'bottom';
}

export default {
  title: 'Directives/Tooltip',
  tags: ['autodocs'],
  component: TooltipDummyComponent,
  argTypes: {
    position: {
      options: tooltipPositions,
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
const Template: Story<TooltipDummyComponent> = (
  args: TooltipDummyComponent
) => ({
  props: args,
});

/**
 * Top centered element
 */
export const TopExample = Template.bind({});
TopExample.args = {
  position: 'top',
  tooltip: 'test',
};

/**
 * Bottom centered element
 */
export const BottomExample = Template.bind({});
BottomExample.args = {
  position: 'bottom',
  tooltip: 'test',
};

/**
 * Middle left element
 */
export const LeftExample = Template.bind({});
LeftExample.args = {
  position: 'left',
  tooltip: 'test',
};

/**
 * Middle right element
 */
export const RightExample = Template.bind({});
RightExample.args = {
  position: 'right',
  tooltip: 'test',
};

/**
 * Long text element
 */
export const LongTextExample = Template.bind({});
LongTextExample.args = {
  position: 'top',
  tooltip:
    'The Tooltip can either be assigned auto height and width values or specific pixel values. The width and height properties are used to set the outer dimension ... The Tooltip can either be assigned auto height and width values or specific pixel values. The width and height properties are used to set the outer dimension ... The Tooltip can either be assigned auto height and width values or specific pixel values. The width and height properties are used to set the outer dimension ... The Tooltip can either be assigned auto height and width values or specific pixel values. The width and height properties are used to set the outer dimension ...',
};
