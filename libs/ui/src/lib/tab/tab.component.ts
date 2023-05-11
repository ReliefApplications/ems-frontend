import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Variant } from '../shared/variant.enum';

/**
 * UI Tab Component : It is not usable without being inside a navigation tab
 */
@Component({
  selector: 'ui-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent {
  @Input() label!: string;
  @ViewChild('button')
  button!: ElementRef;

  variant: Variant = Variant.DEFAULT;
  vertical = false;
  selected = false;

  /** @returns general resolved classes and variant for tab*/
  get resolveTabClasses(): string[] {
    const classes = [];
    if (this.vertical) {
      classes.push('ui-tab__vertical');
      if (this.selected) {
        classes.push('bg-gray-100');
        classes.push('text-gray-700');
      }
    } else {
      classes.push('ui-tab__horizontal');
      if (this.selected) {
        classes.push(
          'ui-tab__' +
            (this.variant === Variant.DEFAULT
              ? Variant.PRIMARY
              : this.variant === Variant.LIGHT
              ? Variant.GREY
              : this.variant)
        );
      }
    }
    return classes;
  }
}
