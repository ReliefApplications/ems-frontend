import { Component, Input } from '@angular/core';
import { Variant } from '../shared/variant.enum';

/**
 * UI Icon Component
 */
@Component({
  selector: 'ui-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  @Input() icon = '';
  @Input() inline = false;
  @Input() variant: Variant = Variant.DEFAULT;
  @Input() size = 24;

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
      case Variant.PRIMARY: {
        return 'primary';
      }
      case Variant.DANGER: {
        return 'warn';
      }
      default: {
        return '';
      }
    }
  }
}
