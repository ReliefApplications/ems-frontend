import {
  Component,
  forwardRef,
  Input,
  Provider,
  NgZone,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';

/**
 * Control value accessor
 */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextareaComponent),
  multi: true,
};

@Component({
  selector: 'ui-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() value: any = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() name!: string;

  private onTouched!: any;
  private onChanged!: any;

  constructor(private _ngZone: NgZone) {}

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
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
   * @param value text
   */
  writeValue(value: string): void {
    this.value = value;
  }

  /**
   * Detect text change
   *
   * @param e new text
   */

  onTextChange(e: any): void {
    this.onTouched();
    this.value = e;
  }
}
