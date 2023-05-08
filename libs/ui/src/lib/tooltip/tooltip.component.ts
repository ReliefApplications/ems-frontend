import { Component, Input } from '@angular/core';
import { TooltipExamplesPositions } from './enums/tooltip-example-positions.enum';

/**
 * Tooltip component (mainly here for storybook usage)
 */
@Component({
  selector: 'ui-tooltip',
  templateUrl: './tooltip.component.html',
})
export class TooltipComponent {
  @Input() position!: TooltipExamplesPositions;
  @Input() hint = '';

  TooltipPositionEnum = TooltipExamplesPositions;

  /**
   * Returns resolved wrapper classes by position
   *
   * @returns Resolved classes
   */
  get resolvePositionCases(): string[] {
    const classes = [];
    switch (this.position) {
      case TooltipExamplesPositions.TOP:
        classes.push('group flex relative justify-center');
        break;
      case TooltipExamplesPositions.TOP_LEFT:
        classes.push('flex items-start justify-start');
        break;
      case TooltipExamplesPositions.TOP_RIGHT:
        classes.push('flex items-start justify-end');
        break;
      case TooltipExamplesPositions.BOTTOM:
        classes.push('flex h-100% items-end justify-center');
        break;
      case TooltipExamplesPositions.BOTTOM_LEFT:
        classes.push('flex items-end justify-start');
        break;
      case TooltipExamplesPositions.BOTTOM_RIGHT:
        classes.push('flex items-end justify-end');
        break;
      case TooltipExamplesPositions.LEFT:
        classes.push('flex items-center justify-start');
        break;
      case TooltipExamplesPositions.RIGHT:
        classes.push('flex items-center justify-end');
        break;
      default:
        break;
    }
    return classes;
  }

  /**
   * Returns resolved button classes by position
   *
   * @returns Resolved classes
   */
  get resolveButtonCases(): string[] {
    const classes = [];
    switch (this.position) {
      case TooltipExamplesPositions.BOTTOM:
      case TooltipExamplesPositions.BOTTOM_LEFT:
      case TooltipExamplesPositions.BOTTOM_RIGHT:
        classes.push('fixed bottom-0');
        break;
      case TooltipExamplesPositions.RIGHT:
      case TooltipExamplesPositions.LEFT:
        classes.push('fixed bottom-2/4');
        break;
      default:
        break;
    }
    return classes;
  }
}
