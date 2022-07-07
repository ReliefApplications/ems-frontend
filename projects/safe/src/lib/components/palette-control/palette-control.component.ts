import { Component, forwardRef, Input, OnInit, Provider } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Subject } from 'rxjs';

/**
 *
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
   *
   */
  constructor() {}

  ngOnInit(): void {}

  /**
   *
   * @param fn
   */
  public registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  /**
   *
   * @param fn
   */
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   *
   * @param value
   */
  writeValue(value: string[]): void {
    this.value = JSON.parse(JSON.stringify(value));
    this.colors = JSON.parse(JSON.stringify(value));
  }

  /**
   *
   * @param isDisabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   *
   * @param e
   * @param i
   */
  onColorChange(e: any, i: number): void {
    this.onTouched();
    this.value[i] = e;
  }

  /**
   *
   * @param e
   */
  onClose(e: any): void {
    this.onChanged(this.value);
  }

  /**
   *
   * @param e
   */
  onReorder(e: any): void {
    this.onTouched();
    this.colors[e.previousContainer.data.index] = e.container.data.item;
    this.colors[e.container.data.index] = e.previousContainer.data.item;
    this.onChanged(this.colors);
  }
}
