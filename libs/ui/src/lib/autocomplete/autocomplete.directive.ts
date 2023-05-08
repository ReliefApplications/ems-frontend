import {
  Directive,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  Renderer2,
  HostListener,
  AfterContentInit,
  OnDestroy,
  TemplateRef,
  QueryList,
  Optional,
  Self,
} from '@angular/core';
import { AutocompleteComponent } from './autocomplete.component';
import { isEqual } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { OptionComponent } from '../option/option.component';
import { NgControl } from '@angular/forms';

/**
 * UI Autocomplete directive
 */
@Directive({
  selector: '[uiAutocomplete]',
})
export class AutocompleteDirective
  implements OnInit, AfterContentInit, OnDestroy
{
  @Input('uiAutocomplete')
  autocompletePanel!: TemplateRef<AutocompleteComponent>;

  @Input() autocompleteDisplayKey?: string;

  @Output() opened: EventEmitter<void> = new EventEmitter();
  @Output() closed: EventEmitter<void> = new EventEmitter();
  @Output() optionSelected: EventEmitter<string> = new EventEmitter();

  private inputElement!: HTMLInputElement;
  private selectedOption!: any;
  private inputEventListener!: any;
  private outsideClickListener!: any;
  private destroy$ = new Subject<void>();
  private control!: NgControl;

  /**
   * Get the value from the option to set in the input host element
   * Could be a plain value or an object
   *
   * @param option Option from autocomplete list item
   * @returns The option value needed to set in the host input
   */
  getOptionValue = (option: OptionComponent) =>
    this.autocompleteDisplayKey
      ? option.value[this.autocompleteDisplayKey]
      : option.value;

  /**
   * Get options
   *
   * @returns all the options that are not parent group
   */
  getNotGroupOptionList = () =>
    (
      (this.autocompletePanel as any).options as QueryList<OptionComponent>
    ).filter((option: OptionComponent) => !option.isGroup);

  /**
   * UI Autocomplete directive
   *
   * @param control NgControl
   * @param el Element reference where the directive is attached
   * @param renderer Renderer2
   */
  constructor(
    @Self() @Optional() control: NgControl,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.control = control;
    this.inputElement = el.nativeElement as HTMLInputElement;
  }

  /** Check the click event into the input to automatically close the select list */
  @HostListener('click')
  onClick() {
    if (!(this.autocompletePanel as any).openPanel) {
      this.highLightSelectedOption();
      this.openAutocompletePanel();
    }
  }

  ngOnInit(): void {
    // outside click event for the autocomplete and input panel
    this.outsideClickListener = this.renderer.listen(
      'window',
      'click',
      (ev: Event) => {
        if (
          (this.autocompletePanel as any).openPanel &&
          !this.el.nativeElement.contains(ev.target)
        ) {
          this.closeAutocompletePanel();
        }
      }
    );
    // Add a listener to the input element to unset selected option if input value changes and there is already a selected option
    this.inputEventListener = this.renderer.listen(
      this.inputElement,
      'input',
      () => {
        if (
          this.selectedOption &&
          !isEqual(
            this.autocompleteDisplayKey
              ? this.selectedOption[this.autocompleteDisplayKey]
              : this.selectedOption,
            this.inputElement.value
          )
        ) {
          this.selectedOption = null;
          this.highLightSelectedOption();
        }
      }
    );
  }

  ngAfterContentInit(): void {
    if (this.control?.control?.value) {
      this.selectedOption = this.control.control.value;
      const inputValue = this.getOptionValue({
        value: this.selectedOption,
      } as OptionComponent);
      this.renderer.setProperty(this.inputElement, 'value', inputValue);
      this.highLightSelectedOption();
    }
    // Create default autocomplete panel with all options
    this.setAutocompletePanel();
  }

  /**
   * Open autocomplete panel and emit opened event
   */
  private openAutocompletePanel() {
    (this.autocompletePanel as any).openPanel = true;
    this.opened.emit();
  }

  /**
   * Close autocomplete panel and emit closed event
   */
  private closeAutocompletePanel() {
    (this.autocompletePanel as any).openPanel = false;
    this.closed.emit();
  }

  /** Creates the autocomplete panel with the options list */
  private setAutocompletePanel(): void {
    // Get value from input
    // const searchText = this.inputElement.value;

    // Filter the options based on the search text, if no search text, display all options
    // const filteredOptions = searchText
    //   ? this.filterAutocompleteOptions(
    //       [...(this.autocompletePanel as any).options],
    //       searchText
    //     )
    //   : [...(this.autocompletePanel as any).options];

    // Create the autocomplete panel items
    this.setAutocompletePanelItemsListener();
  }

  /**
   * Recursively creates li elements to the options
   */
  private setAutocompletePanelItemsListener(): void {
    // Highlight selected option
    this.highLightSelectedOption();
    this.getNotGroupOptionList().forEach((option: OptionComponent) => {
      option.itemClick.pipe(takeUntil(this.destroy$)).subscribe({
        next: (isSelected: boolean) => {
          const inputValue = isSelected ? this.getOptionValue(option) : '';
          if (isSelected) {
            this.selectedOption = option.value;
          } else {
            this.selectedOption = null;
          }
          if (this.control?.control) {
            this.control.control.setValue(this.selectedOption);
          }
          this.optionSelected.emit(this.selectedOption);
          this.renderer.setProperty(this.inputElement, 'value', inputValue);
        },
      });
    });
  }

  /**
   * Updates highlight of items in autocomplete list
   */
  private highLightSelectedOption() {
    this.getNotGroupOptionList().forEach((option: OptionComponent) => {
      // Highlight selected option
      if (isEqual(this.selectedOption, option.value)) {
        option.selected = true;
      } else {
        option.selected = false;
      }
    });
  }

  /**
   * Recursively filter the original options list based on the displayKey and return the matching options
   */
  // private filterAutocompleteOptions(searchText: string) {}

  ngOnDestroy(): void {
    if (this.inputEventListener) {
      this.inputEventListener();
    }
    if (this.outsideClickListener) {
      this.outsideClickListener();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
