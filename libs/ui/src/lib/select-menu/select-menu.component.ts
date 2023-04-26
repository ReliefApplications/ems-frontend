import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

/**
 *
 */
@Component({
  selector: 'ui-select-menu',
  templateUrl: './select-menu.component.html',
  styleUrls: ['./select-menu.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectMenuComponent),
      multi: true,
    },
  ],
})
export class SelectMenuComponent implements ControlValueAccessor {
  //Inputs
  @Input() multiselect = false;
  @Input() options: Array<any> = [];
  @Input() selectTriggerTemplate!: TemplateRef<any> | string;
  @Input() disabled = false;
  @Input() required = false;

  //Outputs
  @Output() opened = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<boolean>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSelectOption = new EventEmitter<any>();

  selectionControl = new FormControl();
  listBoxFocused = false;

  //Values selected
  val!: any;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: any = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouch: any = () => {};

  /**
   * Set value of control access value
   */
  set value(val: any) {
    if (val !== undefined && this.val !== val) {
      this.val = val;
      this.onChange(val);
      this.onTouch(val);
    }
  }

  /**
   * Actually change the value of value
   *
   * @param value
   * value to replace
   */
  writeValue(value: any): void {
    this.value = value;
  }

  /**
   * Record on change
   *
   * @param fn
   * event that took place
   */
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  /**
   * Record on touch
   *
   * @param fn
   * event that took place
   */
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  // openListBox() {
  //   this.opened.emit(true);
  //   this.closed.emit(false);
  //   this.listBoxFocused = true;
  //   console.log('open');
  // }

  closeListBox() {
    this.opened.emit(false);
    this.closed.emit(true);
    this.listBoxFocused = false;
    console.log('close');
  }

  dealListBox() {
    if (this.listBoxFocused) {
      this.opened.emit(false);
      this.closed.emit(true);
      this.listBoxFocused = false;
    } else {
      this.opened.emit(true);
      this.closed.emit(false);
      this.listBoxFocused = true;
    }
    console.log('deal');
  }
}
