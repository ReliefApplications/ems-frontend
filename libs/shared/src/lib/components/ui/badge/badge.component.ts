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
  @Input() size: BadgeSize | string = BadgeSize.MEDIUM;

  @Input() variant: BadgeVariant | string = BadgeVariant.DEFAULT;

  @Input() icon = '';
}
