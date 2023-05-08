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

  /** @returns general resolved classes and variant for icon*/
  get resolveIconClasses(): string[] {
    const classes = [];
    classes.push(
      this.variant === Variant.LIGHT
        ? 'icon-light'
        : this.variant === Variant.PRIMARY || this.variant === Variant.DEFAULT
        ? 'icon-primary'
        : this.variant === Variant.SUCCESS
        ? 'icon-success'
        : this.variant === Variant.GREY
        ? 'icon-grey'
        : 'icon-danger'
    );

    return classes;
  }
}
