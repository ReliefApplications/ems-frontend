import { Component, forwardRef, Input, Provider } from '@angular/core';
import {
  ControlValueAccessor,
  UntypedFormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

/**
 * Control value accessor
 */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextareaComponent),
  multi: true,
};

@Component({
  selector: 'ui-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class TextareaComponent implements ControlValueAccessor{
  @Input() value = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() name!: string;
  @Input() dataBind!: string;

  private onTouched!: any;
  private onChanged!: any;

   /**
   * Register change of the control
   *
   * @param fn callback
   */
   public registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  /**
   * Register touch event
   *
   * @param fn callback
   */
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
 * Write new value
 *
 * @param value list of colors
 */
  writeValue(value: string): void {
    this.value = value;
  }
}
