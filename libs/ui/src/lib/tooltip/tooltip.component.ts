import { Component, Input } from '@angular/core';
import { TooltipExamplesPositions } from './enums/tooltip-example-positions.enum';

@Component({
  selector: 'ui-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  @Input() position = '';

  TooltipPositionEnum = TooltipExamplesPositions;
}
