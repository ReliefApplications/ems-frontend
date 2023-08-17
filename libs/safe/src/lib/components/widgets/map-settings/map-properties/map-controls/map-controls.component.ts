import { Component, forwardRef, Provider, Input } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  UntypedFormGroup,
} from '@angular/forms';

/**
 * Control value accessor
 */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MapControlsComponent),
  multi: true,
};

/**
 * Map controls form control
 */
@Component({
  selector: 'safe-map-controls',
  templateUrl: './map-controls.component.html',
  styleUrls: ['./map-controls.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class MapControlsComponent implements ControlValueAccessor {
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  private disabled = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched = () => {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  private onChanged = (_: any) => {};

  /**
   * Write new value
   *
   * @param value cron expression
   */
  writeValue(value: any): void {
    this.form.setValue(value);
  }

  /**
   * Register change of the control
   *
   * @param fn callback
   */
  registerOnChange(fn: (_: any) => void): void {
    this.onChanged = fn;
  }

  /**
   * Register touch event
   *
   * @param fn callback
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Set disabled state
   *
   * @param isDisabled is control disabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
