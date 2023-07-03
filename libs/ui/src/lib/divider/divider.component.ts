import { Component, Input } from '@angular/core';
import { DividerOrientation } from './types/divider-orientation';
import { DividerPosition } from './types/divider-position';

/**
 * UI Divider component
 */
@Component({
  selector: 'ui-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
})
export class DividerComponent {
  @Input() orientation: DividerOrientation = 'horizontal';
  @Input() text!: string;
  @Input() position: DividerPosition = 'center';
}
