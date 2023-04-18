import { Component, Input } from '@angular/core';
import { AvatarSize } from './enums/avatar-size.enum';
import { AvatarVariant } from './enums/avatar-variant.enum';

/**
 * UI Avatar Component
 */
@Component({
  selector: 'ui-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() size: AvatarSize = AvatarSize.MEDIUM;
  @Input() variant: AvatarVariant | string = AvatarVariant.DEFAULT;
  @Input() icon = '';
  @Input() shape: any = '';
  @Input() initials: any = '';
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  @Input() action: any = () => {};

  avatarSize = AvatarSize;
  avatarVariant = AvatarVariant;
  /**
   * Triggers any action given on click avatar element
   */
  triggerAvatarAction() {
    if (this.action) {
      this.action();
    }
  }
}
