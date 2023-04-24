import {
  Component,
  EventEmitter,
  Input,
  Provider,
  forwardRef,
} from '@angular/core';
import { ToggleType } from './enums/toggle-type.enum';
import { ToggleLabel } from './interfaces/toggle-label.interface';
import { ToggleIcon } from './interfaces/toggle-icon.interface';
import { Variant } from '../shared/variant.enum';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** A provider for the ControlValueAccessor interface. */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ToggleComponent),
  multi: true,
};

/**
 * UI Toggle component
 */
@Component({
  selector: 'ui-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class ToggleComponent implements ControlValueAccessor {
  @Input() type: ToggleType = ToggleType.SIMPLE;
  @Input() icon!: ToggleIcon;
  @Input() label!: ToggleLabel;
  @Input() variant: Variant = Variant.PRIMARY;

  toggleTypes = ToggleType;
  toggleVariant = Variant;

  value = false;
  disabled = false;
  valueChange: EventEmitter<boolean> = new EventEmitter();

  onChange!: (value: boolean) => void;
  onTouch!: () => void;

  /** @returns general toggle classes and variant */
  get toggleClasses(): string[] {
    const classes = [];
    // Disable state
    classes.push(this.disabled ? 'opacity-70' : '');
    // Variants
    classes.push('focus-' + this.variant);
    if (this.type === this.toggleTypes.SIMPLE) {
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
    const classes = [];
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
    this.onTouch();
    this.value = !this.value;
    this.onChange(this.value);
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
   * Set disabled state of the control
   *
   * @param isDisabled is control disabled
   */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
