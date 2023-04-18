import { Component, Input } from '@angular/core';
import { Size } from '../shared/size.enum';
import { Variant } from '../shared/variant.enum';

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

  spinnerSize = Size;
  spinnerVariant = Variant;
}
