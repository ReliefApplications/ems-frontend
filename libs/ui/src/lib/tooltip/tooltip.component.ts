import { Component, Input } from '@angular/core';
import { TooltipExamplesPosition } from './types/tooltip-example-positions';

/**
 * Tooltip component (mainly here for storybook usage)
 */
@Component({
  selector: 'ui-tooltip',
  templateUrl: './tooltip.component.html',
})
export class TooltipComponent {
  @Input() position!: TooltipExamplesPosition;
  @Input() hint = '';

  /**
   * Returns resolved wrapper classes by position
   *
   * @returns Resolved classes
   */
  get resolvePositionCases(): string[] {
    const classes = [];
    switch (this.position) {
      case 'top':
        classes.push('group flex relative justify-center');
        break;
      case 'top-left':
        classes.push('flex items-start justify-start');
        break;
      case 'top-right':
        classes.push('flex items-start justify-end');
        break;
      case 'bottom':
        classes.push('flex h-100% items-end justify-center');
        break;
      case 'bottom-left':
        classes.push('flex items-end justify-start');
        break;
      case 'bottom-right':
        classes.push('flex items-end justify-end');
        break;
      case 'left':
        classes.push('flex items-center justify-start');
        break;
      case 'right':
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
      case 'bottom':
      case 'bottom-left':
      case 'bottom-right':
        classes.push('fixed bottom-0');
        break;
      case 'right':
      case 'left':
        classes.push('fixed bottom-2/4');
        break;
      default:
        break;
    }
    return classes;
  }
}
