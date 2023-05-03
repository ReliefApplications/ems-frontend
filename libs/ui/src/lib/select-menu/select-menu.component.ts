import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  HostListener,
  TemplateRef,
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
export class SelectMenuComponent implements ControlValueAccessor {
  /**
   * Tells if the select menu should allow multi selection
   */
  @Input() multiselect = false;
  /**
   * Gives the list of options the component must display
   */
  @Input() options: Array<any> = [];
  /**
   * Label placed in the selection
   */
  @Input() label = '';
  /**
   * Tells if the select menu should be disabled
   */
  @Input() disabled = false;
  /**
   * Any custom template provided for display
   */
  @Input()
  customTemplate!: TemplateRef<any>;
  /**
   * Emits when the list is opened
   */
  @Output() opened = new EventEmitter<void>();
  /**
   * Emits when the list is closed
   */
  @Output() closed = new EventEmitter<void>();
  /**
   * Emits the list of the selected options
   */
  @Output() selectedOption = new EventEmitter<any[]>();

  // Form control to get the values selected
  selectionControl = new FormControl(new Array<any>());
  // True if the box is focused, false otherwise
  listBoxFocused = false;
  // Text to be displayed in the trigger when some selections are made
  displayTrigger = '';

  //Control access value functions
  onChange!: (value: any) => void;
  onTouch!: () => void;

  /**
   * Check the focusout to automatically close the select list
   *
   * @param event focusout event
   */
  @HostListener('focusout', ['$event'])
  onFocusout(event: any) {
    if (
      event?.relatedTarget === null ||
      event?.relatedTarget?.role !== 'option'
    ) {
      this.closeListBox();
    }
  }

  /**
   * Write new value
   *
   * @param value value set from parent form control
   */
  writeValue(value: any): void {
    if (value) {
      this.selectionControl.setValue([...value], { emitEvent: false });
      this.setDisplayTriggerText();
    }
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
    if (this.selectionControl.value) {
      // Emit the list of values selected as an output
      this.selectedOption.emit(this.selectionControl.value ?? []);
      this.setDisplayTriggerText();
      // Manage control access value
      if (this.onChange && this.onTouch) {
        this.onChange(this.selectionControl.value);
        this.onTouch();
      }
    }
    // If no multiselect, close list after selection
    if (!this.multiselect) {
      this.closeListBox();
    }
  }

  /**
   * Builds the text displayed from selected options
   */
  private setDisplayTriggerText() {
    // Adapt the text to be displayed in the trigger if no custom template for display is provided
    if (this.selectionControl?.value) {
      if (!this.customTemplate) {
        if (this.selectionControl.value.length === 1) {
          this.displayTrigger = this.selectionControl.value[0];
        } else if (this.selectionControl.value.length >= 1) {
          this.displayTrigger =
            this.selectionControl.value[0] +
            ' (+' +
            (this.selectionControl.value.length - 1) +
            ' others)';
        } else {
          this.displayTrigger = '';
        }
      }
    }
  }

  /**
   * Closes the listbox if a click is made outside of the component
   */
  private closeListBox() {
    //If the click was not made on one of the options or children of the component, close list box
    this.closed.emit();
    this.listBoxFocused = false;
  }

  /**
   * Opens or closes the list when the trigger component is clicked (+ make the corresponding output emissions)
   */
  dealListBox() {
    //Do nothing if the box is disabled
    if (this.disabled) {
      return;
    }
    // Open the box + emit outputs
    if (this.listBoxFocused) {
      this.closeListBox();
    }
    //Close the box + emit outputs
    else {
      if (!this.listBoxFocused) {
        this.opened.emit();
        this.listBoxFocused = true;
      }
    }
  }
}
