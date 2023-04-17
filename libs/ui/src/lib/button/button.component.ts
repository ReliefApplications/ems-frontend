import { Component, Input } from '@angular/core';
import { ButtonIconPosition } from './enums/button-icon-position.enum';

/**
 * UI Button Component
 */
@Component({
  selector: 'ui-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() iconPosition: ButtonIconPosition = ButtonIconPosition.PREFIX;
  buttonIconPosition = ButtonIconPosition;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  @Input() action: any = () => {};

  /**
   * Triggers any action given on click button element
   */
  triggerAction() {
    if (this.action) {
      this.action();
    }
  }
}
