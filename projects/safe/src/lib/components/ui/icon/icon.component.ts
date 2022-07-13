import { Component, HostBinding, Input, OnInit } from '@angular/core';
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

  @HostBinding('style.display') get display() {
    return this.inline ? 'inline-flex' : 'flex';
  }

  /**
   * Formats the size input adding a 'px' suffix
   *
   * @returns Returns a string with the size in px
   */
  get fontSize(): string {
    return this.size + 'px';
  }

  /**
   * Compares the variant passed with an enum to return a valid color variant.
   *
   * @returns Returns a string with the icon color variant
   */
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

  /**
   * Constructor for safe-icon component
   */
  constructor() {}

  ngOnInit(): void {}
}
