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
  useExisting: forwardRef(() => PaletteControlComponent),
  multi: true,
};

/**
 * Palette form control.
 */
@Component({
  selector: 'shared-palette-control',
  templateUrl: './palette-control.component.html',
  styleUrls: ['./palette-control.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class PaletteControlComponent implements ControlValueAccessor {
  /** Input decorator for formControl. */
  @Input() formControl!: UntypedFormControl;
  /** Input decorator for formControlName. */
  @Input() formControlName!: string;
  /** Private function to handle touch events. */
  private onTouched!: () => void;
  /** Private function to handle change events. */
  private onChanged!: (value: string[]) => void;
  /** Array to hold the value. */
  public value: string[] = [];
  /** Array to hold the colors. */
  public colors: string[] = [];
  /** Boolean to track the disabled state of the control. */
  public disabled = false;

  /**
   * Register change of the control
   *
   * @param fn callback
   */
  public registerOnChange(fn: (value: string[]) => void): void {
    this.onChanged = fn;
  }

  /**
   * Register touch event
   *
   * @param fn callback
   */
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Write new value
   *
   * @param value list of colors
   */
  writeValue(value: string[]): void {
    this.value = JSON.parse(JSON.stringify(value));
    this.colors = JSON.parse(JSON.stringify(value));
  }

  /**
   * Set disabled state
   *
   * @param isDisabled is control disabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Detect color change
   *
   * @param e new color
   * @param i index of color
   */
  onColorChange(e: any, i: number): void {
    this.onTouched();
    this.value[i] = e;
  }

  /**
   * Close the control
   */
  onClose(): void {
    this.onChanged(this.value);
  }

  /**
   * Reorder colors
   *
   * @param e reorder event
   */
  onReorder(e: any): void {
    this.onTouched();
    this.colors[e.previousContainer.data.index] = e.container.data.item;
    this.colors[e.container.data.index] = e.previousContainer.data.item;
    this.onChanged(this.colors);
  }
}
