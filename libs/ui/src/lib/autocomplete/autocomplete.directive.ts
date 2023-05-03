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
} from '@angular/core';

/**
 * UI Autocomplete directive
 */
@Directive({
  selector: '[uiAutocomplete]',
  exportAs: '[uiAutocomplete]',
})
export class AutocompleteDirective implements OnInit, AfterContentInit {
  @Input('uiAutocomplete') options: any[] = [];
  @Input() public displayKey!: string;
  @Input() public childrenKey!: string;

  @Output() opened: EventEmitter<void> = new EventEmitter();
  @Output() closed: EventEmitter<void> = new EventEmitter();
  @Output() optionSelected: EventEmitter<string> = new EventEmitter();

  private panelOpened = false;
  private inputElement!: HTMLInputElement;
  private autocompletePanel!: HTMLUListElement;
  private selectedOption?: string;

  private autocompleteClasses = [
    'z-10',
    'p-1',
    'max-h-60',
    'w-full',
    'overflow-auto',
    'mt-2',
    'rounded-md',
    'bg-white',
    'py-1',
    'ring-1',
    'ring-black',
    'ring-opacity-5',
    'focus:outline-none',
    'sm:text-sm',
    'py-1',
    'hidden',
  ] as const;

  private autocompleteItemClasses = [
    'text-gray-900',
    'relative',
    'pl-2',
  ] as const;

  /**
   * UI Autocomplete directive
   *
   * @param el Element reference where the directive is attached
   * @param renderer Renderer2
   */
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.inputElement = el.nativeElement as HTMLInputElement;
  }

  /** Check the blur to automatically close the select list */
  @HostListener('blur', ['$event'])
  onBlur() {
    // Hide the autocomplete panel when clicking outside the input element
    if (this.panelOpened) {
      setTimeout(() => {
        this.hideAutocompletePanel();
        this.panelOpened = false;
        this.closed.emit();
      }, 300);
    }
  }

  /** Check the click event into the input to automatically close the select list */
  @HostListener('click', ['$event'])
  onClick() {
    if (!this.panelOpened) {
      this.showAutocompletePanel();
      this.panelOpened = true;
      this.opened.emit();
    }
  }

  ngOnInit(): void {
    // Create the autocomplete panel element
    this.autocompletePanel = this.renderer.createElement('ul');
    this.autocompleteClasses.forEach((auClass) => {
      this.renderer.addClass(this.autocompletePanel, auClass);
    });
    this.renderer.appendChild(
      this.inputElement.parentNode,
      this.autocompletePanel
    );

    // Add a listener to the input element to show the autocomplete panel and filter the options
    this.inputElement.addEventListener('input', () => {
      if (this.selectedOption !== this.inputElement.value) {
        this.selectedOption = undefined;
      }
      this.setAutocompletePanel();
    });
  }

  ngAfterContentInit(): void {
    this.selectedOption = this.inputElement.value ?? undefined;
    // Create default autocomplete panel with all options
    this.setAutocompletePanel();
  }

  /** Creates the autocomplete panel with the options list */
  private setAutocompletePanel(): void {
    // Clear the previous autocomplete panel items
    this.autocompletePanel.innerHTML = '';
    // Get value from input
    const searchText = this.inputElement.value;

    // Filter the options based on the search text, if no search text, display all options
    const filteredOptions = searchText
      ? this.filterAutocompleteOptions([...this.options], searchText)
      : [...this.options];

    // Create the autocomplete panel items
    this.setAutocompletePanelItems(filteredOptions, this.autocompletePanel);
  }

  /** Display the autocomplete panel */
  private showAutocompletePanel() {
    this.renderer.removeClass(this.autocompletePanel, 'hidden');
    this.renderer.addClass(this.autocompletePanel, 'block');
  }

  /** Hide the autocomplete panel  */
  private hideAutocompletePanel() {
    this.renderer.removeClass(this.autocompletePanel, 'block');
    this.renderer.addClass(this.autocompletePanel, 'hidden');
  }

  /**
   * Recursively creates li elements to the options
   *
   * @param options array of options
   * @param  parentElement the parent HTML element to attach the generated li elements
   */
  private setAutocompletePanelItems(
    options: any[],
    parentElement: HTMLElement
  ): void {
    options.forEach((option: any) => {
      const listItem = this.renderer.createElement('li');
      this.renderer.setProperty(listItem, 'innerText', option[this.displayKey]);
      this.autocompleteItemClasses.forEach((auiClass) => {
        this.renderer.addClass(listItem, auiClass);
      });
      // If options is not the group's parent allow click
      if (!option[this.childrenKey]) {
        this.renderer.addClass(listItem, 'cursor-pointer');
        this.renderer.addClass(listItem, 'hover:bg-primary-100');
      }
      // Highlight selected option
      if (this.selectedOption === listItem.innerText) {
        this.renderer.addClass(listItem, 'bg-primary-200');
      }
      listItem.addEventListener('click', () => {
        if (!option[this.childrenKey]) {
          this.selectedOption = option[this.displayKey];
          this.renderer.setProperty(
            this.inputElement,
            'value',
            option[this.displayKey]
          );
          this.inputElement.dispatchEvent(new Event('input'));
        }
      });
      this.renderer.appendChild(parentElement, listItem);

      // If the option has children, a nested ul element is created
      // and the createAutocompletePanelItems() is recursively called
      if (option[this.childrenKey] && option[this.childrenKey].length > 0) {
        const nestedList = this.renderer.createElement('ul');
        this.renderer.addClass(nestedList, 'pl-4');
        this.renderer.addClass(nestedList, 'py-1');
        this.renderer.appendChild(listItem, nestedList);
        this.setAutocompletePanelItems(option[this.childrenKey], nestedList);
      }
    });
  }

  /**
   * Recursively filter the original options list based on the displayKey and return the matching options
   *
   * @param options autocomplete options original list
   * @param searchText text typed in the input
   * @returns filtered options that match the search text
   */
  private filterAutocompleteOptions(options: any[], searchText: string): any[] {
    const filteredOptions: any[] = [];
    options.forEach((option: any) => {
      const filteredOption: any = {
        [this.displayKey]: option[this.displayKey],
      };
      if (option[this.childrenKey] && option[this.childrenKey].length > 0) {
        const filteredChildren = this.filterAutocompleteOptions(
          option[this.childrenKey],
          searchText
        );
        if (filteredChildren.length > 0) {
          filteredOption[this.childrenKey] = filteredChildren;
        }
      }
      if (
        option[this.displayKey]
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        (filteredOption[this.childrenKey] &&
          filteredOption[this.childrenKey].length > 0)
      ) {
        filteredOptions.push(filteredOption);
      }
    });
    return filteredOptions;
  }
}
