import { Component, Input } from '@angular/core';
import { Size } from '../shared/size.enum';

/**
 * UI Avatar Component
 */
@Component({
  selector: 'ui-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() size: Size = Size.MEDIUM;
  @Input() icon = '';
  avatarSize = Size;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  @Input() action: any = () => {};

  /**
   * Triggers any action given on click avatar element
   */
  triggerAvatarAction() {
    if (this.action) {
      this.action();
    }
  }
}
