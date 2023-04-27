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
  @Output() selectedOption = new EventEmitter<any[]>();

  selectionControl = new FormControl();
  listBoxFocused = false;
  triggerIsString = false;
  displayTrigger = '';

  onChange!: (value: number) => void;
  onTouch!: () => void;

  ngOnInit() {
    //See if the input selectTriggerTemplate is text or template
    if (typeof this.selectTriggerTemplate === 'string') {
      this.triggerIsString = true;
      console.log(this.triggerIsString);
    } else {
      this.triggerIsString = false;
      console.log(this.triggerIsString);
      console.log(this.selectTriggerTemplate);
    }
    //Initial value for selectionControl to avoid error in html ngIf
    this.selectionControl.setValue([]);
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
    this.selectedOption.emit(this.selectionControl.value);
    if (this.selectionControl.value.length > 1) {
      this.displayTrigger =
        this.selectionControl.value[0] +
        ' (+' +
        (this.selectionControl.value.length - 1) +
        ' others)';
    } else if (this.selectionControl.value.length == 1) {
      this.displayTrigger = this.selectionControl.value[0];
    } else {
      this.displayTrigger = '';
    }
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
    } else if (this.disabled) {
      console.log('This toolbox is disabled.');
    } else {
      this.opened.emit(true);
      this.closed.emit(false);
      this.listBoxFocused = true;
    }
  }
}
