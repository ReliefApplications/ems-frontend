import { Component, Input, OnInit } from '@angular/core';
import { BadgeSize } from './badge-size.enum';
import { BadgeVariant } from './badge-variant.enum';

@Component({
  selector: 'safe-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class SafeBadgeComponent implements OnInit {

  @Input() size: BadgeSize | string = BadgeSize.MEDIUM;

  @Input() variant: BadgeVariant | string = BadgeVariant.DEFAULT;

  @Input() icon = '';

  constructor() { }

  ngOnInit(): void {
  }
}
