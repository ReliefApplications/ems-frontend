import { Component, forwardRef, Input, OnInit, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IContentType } from '../../models/page.model';

/** A provider for the ControlValueAccessor interface. */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SafeContentChoiceComponent),
  multi: true,
};

/**
 * This component is used to choose the type of content (form, workflow, dashboard etc.)
 * when creating a new page in an application or a new step in a workflow
 */
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
  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   */
  constructor() {}

  ngOnInit(): void {}

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
