import {
  Directive,
  AfterContentInit,
  Input,
  HostListener,
  QueryList,
  forwardRef,
  Provider,
  ContentChildren,
  Output,
  EventEmitter,
} from '@angular/core';
import { RadioComponent } from './radio.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Control value accessor
 */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioGroupDirective),
  multi: true,
};

/**
 * UI Radio group directive
 *
 * It groups all child radios into a group
 */
@Directive({
  selector: '[uiRadioGroupDirective]',
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class RadioGroupDirective
  implements AfterContentInit, ControlValueAccessor
{
  @Input() uiRadioGroupDirective!: string;
  @ContentChildren(RadioComponent) radioComponents!: QueryList<RadioComponent>;
  // If radio group with no form control is added we want to get radio selection as well
  @Output() groupValueChange = new EventEmitter<any>();

  private groupValue: any;

  onTouched!: () => void;
  onChanged!: (value: string) => void;

  ngAfterContentInit() {
    this.radioComponents.toArray().forEach((val: any) => {
      if (!this.onTouched && !this.onChanged && val.checked) {
        this.groupValue = val.value;
        this.groupValueChange.emit(this.groupValue);
      }
      val.name = this.uiRadioGroupDirective;
    });
  }

  /**
   * Register change of the control
   *
   * @param fn callback
   */
  public registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  /**
   * Register touch event
   *
   * @param fn callback
   */
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Write new value
   *
   * @param value input
   */
  writeValue(value: string): void {
    this.groupValue = value;
  }

  /**
   * Handles the change event callback of radio button childs
   *
   * @param event Event on radio selection change
   */
  @HostListener('change', ['$event']) onOptionChange(event: Event) {
    this.groupValue = (event.target as HTMLInputElement).value;
    if (this.groupValue === 'true' || this.groupValue === 'false') {
      this.groupValue = this.groupValue === 'true' ? true : false;
    }
    if (this.onTouched && this.onChanged) {
      this.onChanged(this.groupValue);
      this.onTouched();
    } else {
      this.groupValueChange.emit(this.groupValue);
    }
  }
}
