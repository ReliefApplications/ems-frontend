import { Component, forwardRef, Input, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IContentType } from '../../models/page.model';

/** A provider for the ControlValueAccessor interface. */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ContentChoiceComponent),
  multi: true,
};

/**
 * This component is used to choose the type of content (form, workflow, dashboard etc.)
 * when creating a new page in an application or a new step in a workflow
 */
@Component({
  selector: 'shared-content-choice',
  templateUrl: './content-choice.component.html',
  styleUrls: ['./content-choice.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class ContentChoiceComponent implements ControlValueAccessor {
  /** Input decorator for contentTypes. */
  @Input() contentTypes?: IContentType[];
  /** Holds selected content type. */
  selected!: string;
  /** Holds control's disabled state. */
  disabled = false;
  /** Called when control is touched. */
  private onTouched!: () => void;
  /** Called when control value changes. */
  private onChanged!: (value: string) => void;

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
  public registerOnChange(fn: (value: string) => void): void {
    this.onChanged = fn;
  }

  /**
   * Register new method to call when control touch state change
   *
   * @param fn callback function
   */
  public registerOnTouched(fn: () => void): void {
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
