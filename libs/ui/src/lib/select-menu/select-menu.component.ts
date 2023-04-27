import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  OnInit,
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
export class SelectMenuComponent implements OnInit, ControlValueAccessor {
  //Inputs
  @Input() multiselect = false;
  @Input() options: Array<any> = [];
  @Input() selectTriggerTemplate: TemplateRef<any> | string = '';
  @Input() disabled = false;
  @Input() required = false;

  //Outputs
  @Output() opened = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<boolean>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSelectOption = new EventEmitter<any>();

  selectionControl = new FormControl();
  listBoxFocused = false;
  isTemplate = false;

  onChange!: (value: number) => void;
  onTouch!: () => void;

  ngOnInit() {
    if (typeof this.selectTriggerTemplate === typeof TemplateRef<any>) {
      this.isTemplate = true;
    } else {
      this.isTemplate = false;
    }
  }

  /**
   * Set value of control access value
   */
  // set value(val: any) {
  //   if (val !== undefined && this.val !== val) {
  //     this.val = val;
  //     this.onChange(val);
  //     this.onTouch(val);
  //   }
  // }

  /**
   * Actually change the value of value
   * value to replace
   */
  writeValue(): void {
    this.onChangeFunction();
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

  onChangeFunction() {
    this.onSelectOption;
    if (this.onChange && this.onTouch) {
      this.onChange(this.selectionControl.value);
      this.onTouch();
    }
  }

  closeListBox(relatedTarget: any) {
    if (relatedTarget === null) {
      this.opened.emit(false);
      this.closed.emit(true);
      this.listBoxFocused = false;
    } else if (relatedTarget.role !== 'option') {
      this.opened.emit(false);
      this.closed.emit(true);
      this.listBoxFocused = false;
    }
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
