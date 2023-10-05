import { Component, Input } from '@angular/core';
import { DividerOrientation } from './types/divider-orientation';
import { DividerPosition } from './types/divider-position';

/**
 * UI Divider component
 * Divider is a UI component that separates content.
 * It can be used to separate content vertically or horizontally.
 */
@Component({
  selector: 'ui-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
})
export class DividerComponent {
  /** The orientation of the divider. */
  @Input() orientation: DividerOrientation = 'horizontal';
  /** The text to display on the divider. */
  @Input() text!: string;
  /** The position of the text on the divider. */
  @Input() position: DividerPosition = 'center';
}
