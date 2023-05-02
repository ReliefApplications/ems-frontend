import { Component, Input } from '@angular/core';
import { Variant } from '../shared/variant.enum';

/**
 * UI Radio button component
 */
@Component({
  selector: 'ui-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
})
export class RadioComponent {
  @Input() name = '';
  @Input() value = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() checked = false;
  @Input() ariaLabelledby = '';
  @Input() variant: Variant = Variant.DEFAULT;

  /**
   * Getter resolving the variant classes
   *
   * @returns resolved classes
   */
  get getVariant(): string[] {
    const classes = [
      this.variant === Variant.DEFAULT
        ? 'radio-primary'
        : this.variant === Variant.LIGHT
        ? 'radio-grey'
        : 'radio-' + this.variant,
    ];
    return classes;
  }
}
