import { Component, Input } from '@angular/core';
import { AvatarSize } from './enums/avatar-size.enum';

/**
 *
 */
@Component({
  selector: 'ui-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() size: AvatarSize = AvatarSize.MEDIUM;
  avatarSize = AvatarSize;
}
