import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ContentChildren,
  QueryList,
  AfterViewInit,
  OnDestroy,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOptionComponent } from './components/select-option.component';
import { Subject, startWith, takeUntil } from 'rxjs';

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
export class SelectMenuComponent
  implements ControlValueAccessor, AfterViewInit, OnDestroy
{
  // Tells if the select menu should allow multi selection
  @Input() multiselect = false;
  // Tells if the select menu should be disabled
  @Input() disabled = false;
  // Any custom template provided for display
  @Input()
  customTemplate!: TemplateRef<any>;

  // Emits when the list is opened
  @Output() opened = new EventEmitter<void>();
  // Emits when the list is closed
  @Output() closed = new EventEmitter<void>();
  // Emits the list of the selected options
  @Output() selectedOption = new EventEmitter<string[]>();

  @ContentChildren(SelectOptionComponent, { descendants: true })
  optionList!: QueryList<SelectOptionComponent>;

  // Array to store the values selected
  public selectedValues: any[] = [];
  // True if the box is focused, false otherwise
  public listBoxFocused = false;
  // Text to be displayed in the trigger when some selections are made
  public displayTrigger = '';

  private destroy$ = new Subject<void>();
  private clickOutsideListener!: any;
  //Control access value functions
  onChange!: (value: any) => void;
  onTouch!: () => void;

  /**
   * Ui Select constructor
   *
   * @param el Host element reference
   * @param renderer Renderer2
   */
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.clickOutsideListener = this.renderer.listen(
      window,
      'click',
      (event) => {
        if (!this.el.nativeElement.contains(event.target)) {
          this.closeListBox();
        }
      }
    );
    this.optionList.forEach((option: SelectOptionComponent) => {
      option.optionClick.pipe(takeUntil(this.destroy$)).subscribe({
        next: (isSelected: boolean) => {
          this.updateSelectedValues(option, isSelected);
          this.onChangeFunction();
        },
      });
    });
    // Initialize any selected values
    this.optionList?.changes
      .pipe(startWith(this.optionList), takeUntil(this.destroy$))
      .subscribe({
        next: (options: QueryList<SelectOptionComponent>) => {
          options.forEach((option) => {
            if (this.selectedValues.includes(option.value)) {
              option.selected = true;
            } else {
              option.selected = false;
            }
          });
        },
      });
  }

  /**
   * Write new value
   *
   * @param value value set from parent form control
   */
  writeValue(value: string[]): void {
    if (value) {
      this.selectedValues = [...value];
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
    // Emit the list of values selected as an output
    this.setDisplayTriggerText();
    // Manage control access value
    if (this.onChange && this.onTouch) {
      this.onChange(this.selectedValues);
      this.onTouch();
    }

    this.selectedOption.emit(this.selectedValues);
    // If no multiselect, close list after selection
    if (!this.multiselect) {
      this.closeListBox();
    }
  }

  /**
   * Opens or closes the list when the trigger component is clicked (+ make the corresponding output emissions)
   */
  public dealListBox() {
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

  /** Builds the text displayed from selected options */
  private setDisplayTriggerText() {
    // Adapt the text to be displayed in the trigger if no custom template for display is provided
    if (this.selectedValues?.length) {
      if (!this.customTemplate) {
        if (this.selectedValues.length === 1) {
          this.displayTrigger = this.selectedValues[0];
        } else if (this.selectedValues.length >= 1) {
          this.displayTrigger =
            this.selectedValues[0] +
            ' (+' +
            (this.selectedValues.length - 1) +
            ' others)';
        } else {
          this.displayTrigger = '';
        }
      }
    }
  }

  /** Closes the listbox if a click is made outside of the component */
  private closeListBox() {
    //If the click was not made on one of the options or children of the component, close list box
    this.closed.emit();
    this.listBoxFocused = false;
  }

  /**
   * Updated the form control value on optionClick event
   *
   * @param {SelectOptionComponent} selectedOption option clicked
   * @param {boolean} selected if the option as selected or unselected
   */
  private updateSelectedValues(
    selectedOption: SelectOptionComponent,
    selected: boolean
  ): void {
    if (selected) {
      if (!this.multiselect) {
        // Reset any other selected option
        this.optionList.forEach((option: SelectOptionComponent) => {
          if (selectedOption.value !== option.value) {
            option.selected = false;
          }
        });
        this.selectedValues = [selectedOption.value];
      } else {
        this.selectedValues = [...this.selectedValues, selectedOption.value];
      }
    } else {
      const index = this.selectedValues?.indexOf(selectedOption.value) ?? 0;
      this.selectedValues?.splice(index, 1);
    }
  }

  ngOnDestroy(): void {
    if (this.clickOutsideListener) {
      this.clickOutsideListener();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
