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
   * Get options
   *
   * @returns all the options that are parent group
   */
  getGroupOptionList = () =>
    (
      (this.autocompletePanel as any).options as QueryList<OptionComponent>
    ).filter((option: OptionComponent) => option.isGroup);

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
      (event: Event) => {
        if (
          this.selectedOption &&
          !isEqual(
            this.getOptionValue({
              value: this.selectedOption,
            } as OptionComponent),
            this.inputElement.value
          )
        ) {
          this.selectedOption = null;
          this.highLightSelectedOption();
        }
        this.filterAutocompleteOptions(
          (event.target as HTMLInputElement).value
        );
      }
    );
  }

  ngAfterContentInit(): void {
    // Check if form control exists and contains any value
    if (this.control?.control?.value) {
      this.selectedOption = this.control.control.value;
      const optionToInputValue = this.getOptionValue({
        value: this.selectedOption,
      } as OptionComponent);
      this.renderer.setProperty(this.inputElement, 'value', optionToInputValue);
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
    const searchText = this.inputElement.value;

    // Create the autocomplete panel items
    this.setAutocompletePanelItemsListener();

    // Filter the options based on the search text, if no search text, display all options
    this.filterAutocompleteOptions(searchText);
  }

  /**
   * Recursively creates li elements to the options
   */
  private setAutocompletePanelItemsListener(): void {
    // Highlight selected option
    this.highLightSelectedOption();
    // Listen to clickable elements in the list
    this.getNotGroupOptionList().forEach((option: OptionComponent) => {
      option.itemClick.pipe(takeUntil(this.destroy$)).subscribe({
        next: (isSelected: boolean) => {
          const optionToInputValue = isSelected
            ? this.getOptionValue(option)
            : '';
          if (isSelected) {
            this.selectedOption = option.value;
          } else {
            this.selectedOption = null;
          }
          if (this.control?.control) {
            this.control.control.setValue(this.selectedOption);
          }
          this.renderer.setProperty(
            this.inputElement,
            'value',
            optionToInputValue
          );
          this.optionSelected.emit(this.selectedOption);
          this.filterAutocompleteOptions(optionToInputValue);
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
   * Filter autocomplete list options by given text
   *
   * @param searchText value from autocomplete input
   */
  private filterAutocompleteOptions(searchText: string) {
    // Display/Hide selectable values from autocomplete list
    this.getNotGroupOptionList().forEach((option) => {
      if (
        this.getOptionValue(option)
          .toLowerCase()
          .includes(searchText.toLowerCase())
      ) {
        option.display = true;
      } else {
        option.display = false;
      }
    });
    // Display /Hide parent values from autocomplete list
    this.getGroupOptionList().forEach((option) => {
      if (option.options.toArray().every((option) => !option.display)) {
        option.display = false;
      } else {
        option.display = true;
      }
    });
  }

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
