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
  Injector,
} from '@angular/core';
import { RadioComponent } from './radio.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgControl } from '@angular/forms';

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

  public formControl!: NgControl;
  private groupValue: any;

  disabled = false;
  onTouched!: () => void;
  onChanged!: (value: string) => void;

  /**
   * Creates an instance of RadioGroupDirective.
   *
   * @param injector Angular injector
   */
  constructor(private injector: Injector) {}

  ngAfterContentInit() {
    this.formControl = this.injector.get(NgControl);
    this.radioComponents.forEach(
      (radio: RadioComponent) =>
        (radio.checked = radio.value === this.formControl?.control?.value)
    );

    this.radioComponents.forEach((radio: RadioComponent) => {
      radio.radioClick.subscribe((value: boolean) => {
        this.radioComponents.forEach(
          (r: RadioComponent) => (r.checked = r.value === value)
        );
      });
    });
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
   * Set disabled state of the control
   *
   * @param isDisabled is control disabled
   */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    // Disable/enable radios when form control disabled status changes
    this.radioComponents?.forEach((radio: RadioComponent) => {
      radio.disabled = isDisabled;
    });
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
