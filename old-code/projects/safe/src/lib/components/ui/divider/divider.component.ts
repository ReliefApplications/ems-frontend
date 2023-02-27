import { Component, HostBinding, Input } from '@angular/core';
import { DividerOrientation } from './divider-orientation.enum';
import { DividerPosition } from './divider-position.enum';

/**
 * Divider component.
 */
@Component({
  selector: 'safe-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
})
export class SafeDividerComponent {
  @Input() text?: string;

  @Input() orientation: DividerOrientation | string =
    DividerOrientation.HORIZONTAL;

  @Input() position: DividerPosition | string = DividerPosition.CENTER;

  /** @returns classes to apply on host. */
  @HostBinding('class') get class() {
    const classes = [];
    switch (this.orientation) {
      case DividerOrientation.HORIZONTAL: {
        classes.push('safe-divider-horizontal');
        if (this.text) {
          classes.push('safe-divider-with-text');

          switch (this.position) {
            case DividerPosition.LEFT: {
              classes.push('safe-divider-with-text-left');
              break;
            }
            case DividerPosition.RIGHT: {
              classes.push('safe-divider-with-text-right');
              break;
            }
          }
        }
        break;
      }
      case DividerOrientation.VERTICAL: {
        classes.push('safe-divider-vertical');
        break;
      }
    }
    return classes.join(' ');
  }
}
