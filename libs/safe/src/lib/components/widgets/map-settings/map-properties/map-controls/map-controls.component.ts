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

  private onTouched!: any;
  private onChanged!: any;
  private disabled = false;

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
  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  /**
   * Register touch event
   *
   * @param fn callback
   */
  registerOnTouched(fn: any): void {
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
