import { Component, Input } from '@angular/core';
import { Size } from '../types/size';
import { Category } from '../types/category';
import { AvatarShape } from './types/avatar-shape';

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
  @Input() size: Size = 'medium';
  /** Variant: defines the colors */
  @Input() variant: Category = 'primary';
  /** Avatar image */
  @Input() image = '';
  /** Avatar shape */
  @Input() shape: AvatarShape = 'circle';
  /** short text */
  @Input() initials = '';
}
