import { Component, Input } from '@angular/core';
import { DividerOrientation } from './enums/divider-orientation.enum';
import { DividerPosition } from './enums/divider-position.enum';

/**
 * UI Divider component
 */
@Component({
  selector: 'ui-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
})
export class DividerComponent {
  @Input() orientation: DividerOrientation = DividerOrientation.HORIZONTAL;
  @Input() text!: string;
  @Input() position: DividerPosition = DividerPosition.CENTER;

  public dividerPositions = DividerPosition;
  public dividerOrientations = DividerOrientation;
}
