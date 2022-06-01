import { Component, forwardRef, Input, OnInit, Provider } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Subject } from 'rxjs';

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

  constructor() {}

  ngOnInit(): void {}

  public registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: string[]): void {
    this.value = JSON.parse(JSON.stringify(value));
    this.colors = JSON.parse(JSON.stringify(value));
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onColorChange(e: any, i: number): void {
    this.onTouched();
    this.value[i] = e;
  }

  onClose(e: any): void {
    this.onChanged(this.value);
  }

  onReorder(e: any): void {
    this.onTouched();
    this.colors[e.previousContainer.data.index] = e.container.data.item;
    this.colors[e.container.data.index] = e.previousContainer.data.item;
    this.onChanged(this.colors);
  }
}
