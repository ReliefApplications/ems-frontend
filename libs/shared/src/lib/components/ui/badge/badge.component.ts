import { Component, Input } from '@angular/core';
import { BadgeSize } from './badge-size.enum';
import { BadgeVariant } from './badge-variant.enum';

/**
 * Badge component.
 */
@Component({
  selector: 'shared-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent {
  /** Input decorator for size. */
  @Input() size: BadgeSize | string = BadgeSize.MEDIUM;
  /** Input decorator for variant. */
  @Input() variant: BadgeVariant | string = BadgeVariant.DEFAULT;
  /** Input decorator for icon. */
  @Input() icon = '';
}
