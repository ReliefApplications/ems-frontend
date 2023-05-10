import {
  Component,
  forwardRef,
  Input,
  Provider,
  ViewChild,
  EventEmitter,
  OnInit
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
export class TextareaComponent implements ControlValueAccessor, OnInit{
  @Input() value: any = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() name!: string;
  /**
   * Set minimal rows for the textarea
   *
   * If the minimal rows given is greater than the current max row values, or no max row values was provided
   * then we set the minimal rows to the max rows value
   *
   * @param rows row number
   */
  @Input() set minRows(rows: number) {
    if (rows) {
      this.minRowsNumber = rows;
      if (rows > this.maxRows) {
        this.maxRows = rows;
      }
    }
  }
  @Input() maxRows = 5;

  minRowsNumber = 2;
  valueChange: EventEmitter<boolean> = new EventEmitter();
  onTouched!: () => void;
  onChanged!: (value: string) => void;

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  ngOnInit(): void {
    console.log(this.value);
    console.log(this.label);
    console.log(this.placeholder);
    console.log(this.name);
    console.log(this.minRows);
    console.log(this.maxRows);
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
   * @param value text
   */
  writeValue(value: string): void {
    this.value = value;
    console.log('writeValue =', this.value);
  }

  /**
   * Detect text change
   *
   * @param e HTML event containing target
   */
  onTextChange(e: Event): void {
    this.value = (e.target as HTMLTextAreaElement).value;
    if (this.onTouched && this.onChanged) {
      this.onTouched();
      this.onChanged(this.value);
    }
    this.valueChange.emit(this.value);
    console.log(this.value);
  }
}
