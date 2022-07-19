import { Component, forwardRef, Input, OnInit, Provider } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Subject } from 'rxjs';

/**
 * Control value accessor
 */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SafePaletteControlComponent),
  multi: true,
};

/**
 * Palette form control.
 */
@Component({
  selector: 'safe-palette-control',
  templateUrl: './palette-control.component.html',
  styleUrls: ['./palette-control.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class SafePaletteControlComponent
  implements OnInit, ControlValueAccessor
{
  @Input() formControl!: FormControl;

  @Input() formControlName!: string;

  private onTouched!: any;
  private onChanged!: any;

  public value: string[] = [];
  public colors: string[] = [];
  public disabled = false;

  /**
   * Constructor for the palette control component
   */
  constructor() {}

  ngOnInit(): void {}

  /**
   * Registers the last changed color
   *
   * @param fn Changed color
   */
  public registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  /**
   * Registers the last touched color
   *
   * @param fn Touched color
   */
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Saves the values as JSON
   *
   * @param value Array of colors
   */
  writeValue(value: string[]): void {
    this.value = JSON.parse(JSON.stringify(value));
    this.colors = JSON.parse(JSON.stringify(value));
  }

  /**
   * Changes the disabled state of the palette
   *
   * @param isDisabled Boolean with the disabled value.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Manages the color changes in the palette
   *
   * @param e Color change event
   * @param i Index of the color to change
   */
  onColorChange(e: any, i: number): void {
    this.onTouched();
    this.value[i] = e;
  }

  /**
   * Closes the palette control
   *
   * @param e Closing event
   */
  onClose(e: any): void {
    this.onChanged(this.value);
  }

  /**
   * Manages the reordirg of colors in the palette
   *
   * @param e Reordering event
   */
  onReorder(e: any): void {
    this.onTouched();
    this.colors[e.previousContainer.data.index] = e.container.data.item;
    this.colors[e.container.data.index] = e.previousContainer.data.item;
    this.onChanged(this.colors);
  }
}
