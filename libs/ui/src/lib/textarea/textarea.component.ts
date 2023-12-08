import {
  Component,
  forwardRef,
  Input,
  Provider,
  ViewChild,
  EventEmitter,
  Optional,
  Self,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FocusableDirective } from '@progress/kendo-angular-grid';

/**
 * Control value accessor
 */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextareaComponent),
  multi: true,
};

/**
 * UI Textarea component.
 * Long text, that can be displayed on multiple lines. Ideal for comments, description.
 */
@Component({
  selector: 'ui-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class TextareaComponent implements ControlValueAccessor {
  /** Value of the textarea. */
  @Input() value = '';
  /** Placeholder text for the textarea. */
  @Input() placeholder = '';
  /** Name of the textarea. */
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

  /** Maximum number of rows that the textarea can display. */
  @Input() maxRows = 5;

  /**
   * UI Textarea component.
   * Long text, that can be displayed on multiple lines. Ideal for comments, description.
   *
   * @param kendoFocus FocusableDirective
   */
  constructor(@Self() @Optional() public kendoFocus: FocusableDirective) {}

  /** The minimum number of rows in the textarea. */
  minRowsNumber = 2;
  /** Event emitter for value changes. */
  valueChange: EventEmitter<boolean> = new EventEmitter();
  disabled = false;
  /** Function to handle touch events. */
  onTouched!: () => void;
  /** Function to handle value changes. */
  onChanged!: (value: string) => void;
  /** Reference to the autosize directive. */
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  /**
   * Register change of the control
   *
   * @param fn callback
   */
  public registerOnChange(fn: (value: string) => void): void {
    this.onChanged = fn;
  }

  /**
   * Register touch event
   *
   * @param fn callback
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

  /**
   * Write new value
   *
   * @param value text
   */
  writeValue(value: string): void {
    this.value = value;
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
    this.valueChange.emit(!!this.value);
  }
}
