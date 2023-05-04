import { Component, Input } from '@angular/core';
import { Size } from '../shared/size.enum';
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
  @Input() size: Size | string = Size.MEDIUM;
  /** Variant: defines the colors */
  @Input() variant: AvatarVariant | string = AvatarVariant.PRIMARY;
  /** Avatar image */
  @Input() image = '';
  /** Avatar shape */
  @Input() shape: AvatarShape | string = AvatarShape.CIRCLE;
  /** short text */
  @Input() initials = '';

  avatarSize = Size;
  avatarShape = AvatarShape;
  avatarVariant = AvatarVariant;
}
