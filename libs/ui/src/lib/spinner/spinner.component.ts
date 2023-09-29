import { Component, Input } from '@angular/core';
import { Size } from '../types/size';
import { Variant } from '../types/variant';
import { Category } from '../types/category';

/**
 * UI Spinner component
 * Spinner is a UI component that displays a loading indicator.
 */
@Component({
  selector: 'ui-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  /** The size of the spinner. */
  @Input() size: Size = 'large';
  /** The variant or style of the spinner. */
  @Input() variant: Variant = 'default';
  /** The category of the spinner. */
  @Input() category: Category = 'primary';

  /** @returns general resolved classes and variant for spinner*/
  get resolveSpinnerClasses(): string[] {
    const classes = [];
    classes.push('spinner-' + this.size);
    classes.push(
      this.category === 'secondary' || this.variant === 'light'
        ? 'spinner-light'
        : this.variant === 'default' || this.variant === 'primary'
        ? 'spinner-primary'
        : this.variant == 'danger'
        ? 'spinner-danger'
        : this.variant === 'grey'
        ? 'spinner-grey'
        : 'spinner-success'
    );
    return classes;
  }
}
