import {
  Component,
  EventEmitter,
  Input,
  Output,
  Provider,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** A provider for the ControlValueAccessor interface. */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true,
};

/**
 * UI Checkbox Component
 */
@Component({
  selector: 'ui-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() checked = false;
  @Input() indeterminate = false;
  @Input() id = '';
  @Input() name = '';
  @Input() label = '';
  @Input() ariaLabel = '';
  @Input() description = '';
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  selected!: string;
  disabled = false;
  private onTouched!: any;
  private onChanged!: any;

  /**
   * Emit value of checkbox on change
   *
   * @param value from checkbox
   */
  onChange(value: any) {
    this.valueChange.emit(value);
  }
  /**
   * Handles the selection of a content
   *
   * @param value The value of the selected content
   */
  public onSelect(value: string): void {
    this.onTouched();
    this.selected = value;
    this.onChanged(value);
  }
  /**
   * Write value of control.
   *
   * @param value new value
   */
  public writeValue(value: string): void {
    this.selected = value;
  }

  /**
   * Register new method to call when control state change
   *
   * @param fn callback function
   */
  public registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  /**
   * Register new method to call when control touch state change
   *
   * @param fn callback function
   */
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Set disabled state of the control
   *
   * @param isDisabled is control disabled
   */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
