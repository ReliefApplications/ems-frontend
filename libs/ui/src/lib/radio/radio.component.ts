import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  Provider,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Control value accessor
 */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioComponent),
  multi: true,
};
@Component({
  selector: 'ui-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class RadioComponent implements ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() disabled = false;
  @Input() required = false;
  @Input() ariaLabelledby = '';
  @Input() name = '';
  @Input() value = '';
  @Input() checked = false;
  @Output() SelectOption: EventEmitter<any> = new EventEmitter();

  onTouched!: () => void;
  onChanged!: (value: string) => void;

  onOptionChange(val: any): void {
    this.value = val;
    if (this.onTouched && this.onChanged) {
      this.onTouched();
      this.onChanged(this.value);
    }
    this.SelectOption.emit(this.value);
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
    this.value = value;
  }
}
