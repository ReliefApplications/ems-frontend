import { Component, Input } from '@angular/core';
import { Size } from '../shared/size.enum';
import { Variant } from '../shared/variant.enum';
import { Category } from '../shared/category.enum';

/**
 * UI Spinner component
 */
@Component({
  selector: 'ui-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  @Input() size: Size | string = Size.LARGE;
  @Input() variant: Variant = Variant.DEFAULT;
  @Input() category: Category = Category.PRIMARY;

  spinnerSize = Size;
  spinnerVariant = Variant;
  spinnerCategory = Category;

  /** @returns general resolved classes and variant for spinner*/
  get resolveSpinnerClasses(): string[] {
    const classes = [];
    classes.push('spinner-' + this.size);
    classes.push(
      this.category === Category.SECONDARY || this.variant === Variant.LIGHT
        ? 'spinner-light'
        : this.variant === Variant.DEFAULT || this.variant === Variant.PRIMARY
        ? 'spinner-primary'
        : this.variant == Variant.DANGER
        ? 'spinner-danger'
        : this.variant === Variant.GREY
        ? 'spinner-grey'
        : 'spinner-success'
    );
    return classes;
  }
}
