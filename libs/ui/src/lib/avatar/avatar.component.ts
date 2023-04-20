import { Component, Input} from '@angular/core';
import { AvatarSize } from './enums/avatar-size.enum';
import { AvatarVariant } from './enums/avatar-variant.enum';
import { AvatarShape } from './enums/avatar-shape.enum';

/**
 * UI Avatar Component
 */
@Component({
  selector: 'ui-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent{
  @Input() size: AvatarSize | string = AvatarSize.MEDIUM;
  @Input() variant: AvatarVariant | string = AvatarVariant.PRIMARY;
  @Input() image = '';
  @Input() shape: AvatarShape | string = AvatarShape.CIRCLE;
  @Input() initials: string = '';
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  @Input() action: any = () => {};

  avatarSize = AvatarSize;
  avatarShape = AvatarShape;
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
