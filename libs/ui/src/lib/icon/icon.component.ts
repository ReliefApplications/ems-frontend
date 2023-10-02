import { Component, Input } from '@angular/core';
import { Variant } from '../types/variant';
import { Category } from '../types/category';

/**
 * UI Icon Component
 * Display an icon with a given category and variant.
 */
@Component({
  selector: 'ui-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  /** The name of the icon. */
  @Input() icon = '';
  /** The category of the icon. */
  @Input() category: Category = 'primary';
  /** The variant or style of the icon. */
  @Input() variant: Variant = 'default';
  /** The size of the icon. */
  @Input() size = 24;
  /** Boolean indicating whether the icon is outlined. */
  @Input() isOutlined = false;

  /**
   * Formats the size input adding a 'px' suffix
   *
   * @returns Returns a string with the size in px
   */
  get fontSize(): string {
    return this.size + 'px';
  }

  /**
   * Resolve icon class by given category and variant
   *
   * @returns Returns a string array with the current variant and category class
   */
  get iconVariantAndCategory(): string[] {
    const classes = [];
    classes.push(
      this.category === 'secondary' || this.variant === 'light'
        ? 'icon-light'
        : this.variant === 'primary'
        ? 'icon-primary'
        : this.variant === 'success'
        ? 'icon-success'
        : this.variant === 'grey'
        ? 'icon-grey'
        : this.variant === 'danger'
        ? 'icon-danger'
        : this.variant === 'warning'
        ? 'icon-warning'
        : ''
    );
    return classes;
  }
}
