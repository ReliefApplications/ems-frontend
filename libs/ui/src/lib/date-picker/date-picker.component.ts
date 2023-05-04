import { Component, Input, Provider, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** A provider for the ControlValueAccessor interface. */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatePickerComponent),
  multi: true,
};

/**
 * UI Datepicker component
 */
@Component({
  selector: 'ui-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() placeholder = 'Select a date';
  @Input() isRange = false;
  selectedValue: any;
  showPanel = false;
  disabled = false;
  onChange!: (value: any) => void;
  onTouch!: () => void;

  public range = {
    start: new Date(2018, 10, 10),
    end: new Date(2018, 10, 20),
  };

  /**
   * Write value of control.
   *
   * @param value new value
   */
  writeValue(value: any): void {
    this.selectedValue = value;
  }

  /**
   * Register new method to call when control state change
   *
   * @param fn callback function
   */
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Register new method to call when control touch state change
   *
   * @param fn callback function
   */
  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  /**
   * Handles the selection of a content
   *
   * @param value selected date
   */
  public handleChange(value: any) {
    this.range.start = value;
    console.log(this.range);
    console.log(value);
    if (this.onTouch && this.onChange) {
      this.onTouch();
      this.onChange(value);
    }
  }

  /**
   * Set disabled state of the control
   *
   * @param isDisabled is control disabled
   */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Set class for today date in calendar
   *
   * @param date Date
   * @returns today class
   */
  public isToday(date: Date) {
    return new Date().getDate() === date.getDate() ? 'today' : '';
  }
}
