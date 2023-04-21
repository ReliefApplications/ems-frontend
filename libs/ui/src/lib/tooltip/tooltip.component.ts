import { Component, Input } from '@angular/core';
import { TooltipExamplesPositions } from './enums/tooltip-example-positions.enum';

/**
 * Tooltip component (mainly here for storybook usage)
 */
@Component({
  selector: 'ui-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  @Input() position = '';
  @Input() hint = '';

  TooltipPositionEnum = TooltipExamplesPositions;
}
