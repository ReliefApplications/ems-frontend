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
  @Input() inline = false;
  @Input() category: Category = Category.PRIMARY;
  @Input() variant: Variant = Variant.DEFAULT;
  @Input() size = 24;

  iconVariant = Variant;
  iconCategory = Category;

  /**
   * Formats the size input adding a 'px' suffix
   *
   * @returns Returns a string with the size in px
   */
  get fontSize(): string {
    return this.size + 'px';
  }
}
