import { Component, Input } from '@angular/core';
import { BadgeSize } from './badge-size.enum';
import { BadgeVariant } from './badge-variant.enum';

/**
 * Badge component.
 */
@Component({
  selector: 'safe-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class SafeBadgeComponent {
  @Input() size: BadgeSize | string = BadgeSize.MEDIUM;

  @Input() variant: BadgeVariant | string = BadgeVariant.DEFAULT;

  @Input() icon = '';
}
