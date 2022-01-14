import { Component, forwardRef, Input, OnInit, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IContentType } from '../../models/page.model';

const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SafeContentChoiceComponent),
  multi: true,
};

@Component({
  selector: 'safe-content-choice',
  templateUrl: './content-choice.component.html',
  styleUrls: ['./content-choice.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class SafeContentChoiceComponent
  implements OnInit, ControlValueAccessor
{
  @Input() contentTypes?: IContentType[];

  selected!: string;
  disabled = false;
  private onTouched!: any;
  private onChanged!: any;

  constructor() {}

  ngOnInit(): void {}

  public onSelect(value: string): void {
    this.onTouched();
    this.selected = value;
    this.onChanged(value);
  }

  public writeValue(value: string): void {
    this.selected = value;
  }

  public registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
