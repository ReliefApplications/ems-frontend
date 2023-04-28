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
 * UI Select Menu component
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
  /**
   * Tells if the select menu should allow multi selection
   */
  @Input() multiselect = false;
  /**
   * Gives the list of options the component must display
   */
  @Input() options: Array<any> = [];
  /**
   * Gives the template that will serve as a trigger (or a simple string if the pre-made trigger is to be used)
   */
  @Input() selectTriggerTemplate: TemplateRef<any> | string = '';
  /**
   * Tells if the select menu should be disabled
   */
  @Input() disabled = false;

  //Outputs
  /**
   * Emits true when the list is opened, false when closed
   */
  @Output() opened = new EventEmitter<boolean>();
  /**
   * Emits true when the list is closed, false when opened
   */
  @Output() closed = new EventEmitter<boolean>();
  /**
   * Emits the list of the selected options
   */
  @Output() selectedOption = new EventEmitter<any[]>();

  // Form control to get the values selected
  selectionControl = new FormControl();
  // True if the box is focused, false otherwise
  listBoxFocused = false;
  // True if the trigger input is a string, false otherwise
  triggerIsString = false;
  // Text to be displayed in the trigger when some selections are made
  displayTrigger = '';

  //Control access value functions
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

  /**
   * Emit selectedOption output, change trigger text and deal with control access value when an element of the list is clicked
   */
  onChangeFunction() {
    // Emit the list of values selected as an output
    this.selectedOption.emit(this.selectionControl.value);
    // Adapt the text to be displayed in the trigger
    if (this.selectionControl.value.length > 2) {
      this.displayTrigger =
        this.selectionControl.value[0] +
        ' (+' +
        (this.selectionControl.value.length - 1) +
        ' others)';
    } else if (this.selectionControl.value.length == 2) {
      this.displayTrigger =
        this.selectionControl.value[0] +
        ' (+' +
        (this.selectionControl.value.length - 1) +
        ' other)';
    } else if (this.selectionControl.value.length == 1) {
      this.displayTrigger = this.selectionControl.value[0];
    } else {
      this.displayTrigger = '';
    }
    // Manage control access value
    if (this.onChange && this.onTouch) {
      this.onChange(this.selectionControl.value);
      this.onTouch();
    }
  }

  /**
   * Closes the listbox if a click is made outside of the component
   *
   * @param relatedTarget target where the click happened
   */
  closeListBox(relatedTarget: any) {
    //If the click was not made on one of the options or children of the component, close list box
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

  /**
   * Opens or closes the list when the trigger component is clicked (+ make the corresponding output emissions)
   */
  dealListBox() {
    // Open the box + emit outputs
    if (this.listBoxFocused) {
      this.opened.emit(false);
      this.closed.emit(true);
      this.listBoxFocused = false;
    }
    //Do nothing if the box is disabled
    else if (this.disabled) {
      console.log('This toolbox is disabled.');
    }
    //Close the box + emit outputs
    else {
      this.opened.emit(true);
      this.closed.emit(false);
      this.listBoxFocused = true;
    }
  }
}
