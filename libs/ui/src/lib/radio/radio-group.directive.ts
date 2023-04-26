import {
  Directive,
  AfterContentInit,
  Input,
  HostListener,
  QueryList,
  forwardRef,
  Provider,
  ContentChildren,
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

@Directive({
  selector: '[uiRadioGroupDirective]',
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class RadioGroupDirective
  implements AfterContentInit, ControlValueAccessor
{
  @Input() uiRadioGroupDirective!: string;
  @ContentChildren(RadioComponent) radioComponents!: QueryList<RadioComponent>;
  @Input() groupValue: any;

  onTouched!: () => void;
  onChanged!: (value: string) => void;

  ngAfterContentInit() {
    this.radioComponents.toArray().forEach((val: any) => {
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
    console.log('registerOnChange');
  }

  /**
   * Register touch event
   *
   * @param fn callback
   */
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
    console.log('registerOnTouched');
  }

  /**
   * Write new value
   *
   * @param value input
   */
  writeValue(value: string): void {
    this.groupValue = value;
  }

  @HostListener('change', ['$event']) onOptionChange(event: Event) {
    const eventTarget = event.target as HTMLInputElement;
    this.groupValue = eventTarget.value;
    if (this.onTouched && this.onChanged) {
      console.log(this.groupValue);
      this.onTouched();
      this.onChanged(this.groupValue);
    }
  }
}
