import { Component, Input } from '@angular/core';
import { Variant } from '../shared/variant.enum';
import { Category } from '../shared/category.enum';

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
  @Input() category: Category = Category.PRIMARY;
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
   * Resolve icon class by given category and variant
   *
   * @returns Returns a string array with the current variant and category class
   */
  get iconVariantAndCategory(): string[] {
    const classes = [];
    classes.push(
      this.category === Category.SECONDARY || this.variant === Variant.LIGHT
        ? 'icon-light'
        : this.variant === Variant.PRIMARY
        ? 'icon-primary'
        : this.variant === Variant.SUCCESS
        ? 'icon-success'
        : this.variant === Variant.GREY
        ? 'icon-grey'
        : this.variant === Variant.DANGER
        ? 'icon-danger'
        : ''
    );
    return classes;
  }
}
