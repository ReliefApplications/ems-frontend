import { Component, Input } from '@angular/core';
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
export class AvatarComponent {
  /** Size of avatar */
  @Input() size: AvatarSize | string = AvatarSize.MEDIUM;
  /** Variant: defines the colors */
  @Input() variant: AvatarVariant | string = AvatarVariant.PRIMARY;
  /** Avatar image */
  @Input() image = '';
  /** Avatar shape */
  @Input() shape: AvatarShape | string = AvatarShape.CIRCLE;
  /** short text */
  @Input() initials = '';

  avatarSize = AvatarSize;
  avatarShape = AvatarShape;
  avatarVariant = AvatarVariant;
}
