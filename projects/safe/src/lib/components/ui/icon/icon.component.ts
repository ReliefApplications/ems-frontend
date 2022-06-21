import { Component, Input, OnInit } from '@angular/core';
import { IconVariant } from './icon-variant.enum';

/**
 * Component for custom icons
 */
@Component({
  selector: 'safe-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class SafeIconComponent implements OnInit {
  @Input() icon = '';

  @Input() inline = false;

  @Input() variant: IconVariant | string = IconVariant.DEFAULT;

  @Input() size = 24;

  /** @returns the font size of the icon */
  get fontSize(): string {
    return this.size + 'px';
  }

  /** @returns the color of the icon */
  get color(): string {
    switch (this.variant) {
      case IconVariant.PRIMARY: {
        return 'primary';
      }
      case IconVariant.DANGER: {
        return 'warn';
      }
      default: {
        return '';
      }
    }
  }

  /** Constructor of the component */
  constructor() {}

  ngOnInit(): void {}
}
