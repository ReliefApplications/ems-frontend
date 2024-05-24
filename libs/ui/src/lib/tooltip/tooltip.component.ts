import { Component, Input } from '@angular/core';

/**
 * Tooltip is a UI component that displays a hint when hovering over an element.
 */
@Component({
  selector: 'ui-tooltip',
  templateUrl: './tooltip.component.html',
})
export class TooltipComponent {
  /** Tooltip text */
  @Input() uiTooltip!: string;
  /** Tooltip title */
  @Input() uiTooltipTitle = '';
}
