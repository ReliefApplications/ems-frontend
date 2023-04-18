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
  @Input() size: Size = Size.MEDIUM;
  @Input() variant: Variant = Variant.DEFAULT;
  @Input() category: Category = Category.PRIMARY;

  spinnerSize = Size;
  spinnerVariant = Variant;
  spinnerCategory = Category;
}
