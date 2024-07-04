import {
  Component,
  EventEmitter,
  Input,
  Provider,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Variant } from '../types/variant';

/** A provider for the ControlValueAccessor interface. */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true,
};

/**
 * UI Checkbox Component
 * Checkbox is a UI component that allows users to switch between two mutually exclusive options (checked or unchecked, on or off) through a single click or tap.
 */
@Component({
  selector: 'ui-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class CheckboxComponent implements ControlValueAccessor {
  /** Boolean indicating whether the checkbox is checked. */
  @Input() checked = false;
  /** Boolean indicating whether the checkbox is in an indeterminate state. */
  @Input() indeterminate = false;
  /** Aria label for accessibility. */
  @Input() ariaLabel = '';
  /** Name of the checkbox. */
  @Input() name = '';
  /** Variant of the checkbox. */
  @Input() variant: Variant = 'primary';
  /** Boolean indicating whether the checkbox is disabled. */
  @Input() disabled = false;
  /** Event emitter for value changes. */
  valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  /** Function to handle value changes. */
  onChange!: (value: boolean) => void;
  /** Function to handle touch events. */
  onTouch!: () => void;

  /** @returns shot toggle classes and variant */
  get checkboxClasses(): string[] {
    const classes = [
      this.variant === 'default'
        ? 'checkbox-primary'
        : this.variant === 'light'
        ? 'checkbox-grey'
        : 'checkbox-' + this.variant,
    ];
    return classes;
  }

  /**
   * Handles the selection of a content
   */
  public onSelect() {
    this.checked = !this.checked;
    this.indeterminate = false;
    if (this.onTouch && this.onChange) {
      this.onTouch();
      this.onChange(this.checked);
    }
    this.valueChange.emit(this.checked);
  }

  /**
   * Write value of control.
   *
   * @param value new value
   */
  public writeValue(value: boolean): void {
    this.checked = value;
  }

  /**
   * Register new method to call when control state change
   *
   * @param fn callback function
   */
  public registerOnChange(fn: (value: boolean) => void): void {
    if (!this.onChange) {
      this.onChange = fn;
    }
  }

  /**
   * Register new method to call when control touch state change
   *
   * @param fn callback function
   */
  public registerOnTouched(fn: () => void): void {
    if (!this.onTouch) {
      this.onTouch = fn;
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
}
