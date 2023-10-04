import { Component, Input } from '@angular/core';
import { Variant } from '../types/variant';

/**
 * UI Radio button component
 * Display a radio button with a given variant.
 */
@Component({
  selector: 'ui-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
})
export class RadioComponent {
  /** The name of the radio button. */
  @Input() name = '';
  /** The value of the radio button. */
  @Input() value: string | boolean = '';
  /** Boolean indicating whether the radio button is disabled. */
  @Input() disabled = false;
  /** Boolean indicating whether the radio button is required. */
  @Input() required = false;
  /** Boolean indicating whether the radio button is checked. */
  @Input() checked = false;
  /** Aria label for accessibility. */
  @Input() ariaLabelledby = '';
  /** The variant or style of the radio button. */
  @Input() variant: Variant = 'default';

  /**
   * Getter resolving the variant classes
   *
   * @returns resolved classes
   */
  get getVariant(): string[] {
    const classes = [
      this.variant === 'default'
        ? 'radio-primary'
        : this.variant === 'light'
        ? 'radio-grey'
        : 'radio-' + this.variant,
    ];
    if (this.disabled) {
      classes.push('opacity-70 bg-gray-300 pointer-events-none');
    }
    return classes;
  }
}
