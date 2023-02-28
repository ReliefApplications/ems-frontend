import { Component, Input } from '@angular/core';
import { AvatarSize } from './avatar-size.enum';
import { AvatarVariant } from './avatar-variant.enum';

/**
 * Avatar component.
 */
@Component({
  selector: 'safe-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class SafeAvatarComponent {
  @Input() size: AvatarSize | string = AvatarSize.MEDIUM;

  @Input() variant: AvatarVariant | string = AvatarVariant.DEFAULT;

  @Input() icon = '';
}
