import {
  Component,
  EventEmitter,
  Input,
  Provider,
  forwardRef,
} from '@angular/core';
import { ToggleType } from './types/toggle-type';
import { ToggleIcon } from './interfaces/toggle-icon.interface';
import { Variant } from '../types/variant';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** A provider for the ControlValueAccessor interface. */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ToggleComponent),
  multi: true,
};

/**
 * UI Toggle component
 * Toggle is a UI component that allows users to switch between two mutually exclusive options (checked or unchecked, on or off) through a single click or tap.
 */
@Component({
  selector: 'ui-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class ToggleComponent implements ControlValueAccessor {
  /** The type of the toggle. */
  @Input() type: ToggleType = 'short';
  /** The icon of the toggle. */
  @Input() icon!: ToggleIcon;
  /** The position of the label for the toggle. */
  @Input() labelPosition: 'right' | 'left' = 'right';
  /** The variant or style of the toggle. */
  @Input() variant: Variant = 'primary';
  /** The value of the toggle. */
  value = false;
  /** Boolean indicating whether the toggle is disabled. */
  disabled = false;
  /** Event emitter for value changes. */
  valueChange: EventEmitter<boolean> = new EventEmitter();
  /** Function to handle value changes. */
  onChange!: (value: boolean) => void;
  /** Function to handle touch events. */
  onTouch!: () => void;

  /** @returns general toggle classes and variant */
  get toggleClasses(): string[] {
    const classes: string[] = [];
    // Disable state
    classes.push(this.disabled ? 'opacity-70' : '');
    // Space from button to label depending on label position
    classes.push(this.labelPosition === 'left' ? 'ml-3' : 'mr-3');
    // Order of button depending on label position
    classes.push(this.labelPosition === 'left' ? 'order-2' : 'order-1');
    // Variants
    classes.push('focus-' + this.variant);
    if (this.type === 'simple') {
      classes.push('button-simple');
      if (!this.value) {
        classes.push('bg-gray-200');
      } else {
        classes.push('toggle-' + this.variant);
      }
    } else {
      classes.push('button-short');
    }
    return classes;
  }

  /** @returns shot toggle classes and variant */
  get shortToggleClasses(): string[] {
    const classes: string[] = [];
    if (!this.value) {
      classes.push('bg-gray-200');
    } else {
      classes.push('toggle-' + this.variant);
    }
    return classes;
  }

  /**
   * Handles the selection of a content
   *
   */
  public onSelect(): void {
    this.value = !this.value;
    if (this.onTouch && this.onChange) {
      this.onTouch();
      this.onChange(this.value);
    }
    this.valueChange.emit(this.value);
  }

  /**
   * Write value of control.
   *
   * @param value new value
   */
  public writeValue(value: boolean): void {
    this.value = value;
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
