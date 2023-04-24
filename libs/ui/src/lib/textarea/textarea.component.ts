import {
  Component,
  forwardRef,
  Input,
  Provider,
  ViewChild,
  EventEmitter
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

/**
 * Control value accessor
 */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextareaComponent),
  multi: true,
};

/**
 * UI Textarea component
 */
@Component({
  selector: 'ui-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class TextareaComponent
  implements ControlValueAccessor
{
  @Input() value: any = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() name!: string;

  valueChange: EventEmitter<boolean> = new EventEmitter();
  private onTouched!: () => void;
  private onChanged!: (value: string) => void;
 
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  /**
   * Register change of the control
   *
   * @param fn callback
   */
  public registerOnChange(fn: any): void {
    console.log("registerOnchange");
    this.onChanged = fn;
  }

  /**
   * Register touch event
   *
   * @param fn callback
   */
  public registerOnTouched(fn: any): void {
    console.log("registerOnTouched");
    this.onTouched = fn;
  }

  /**
   * Write new value
   *
   * @param value text
   */
  writeValue(value: string): void {
    this.value = value;
    console.log("writeValue =", this.value);
  }

  /**
   * Detect text change
   *
   * @param e new text
   */
  onTextChange(e: any): void {
    this.value = e;
    this.onTouched();
    this.onChanged(this.value);
    this.valueChange.emit(this.value);
    console.log("onTextChange = ", this.value);
  }
}
