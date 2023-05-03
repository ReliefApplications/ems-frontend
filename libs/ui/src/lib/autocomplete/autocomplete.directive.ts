import { Directive, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AutocompleteOptions } from './interfaces/autocomplete-options.interface';

/**
 * UI Autocomplete directive
 */
@Directive({
  selector: '[uiAutocomplete]',
})
export class AutocompleteDirective implements OnInit {
  @Input('uiAutocompleteOptions') options: AutocompleteOptions[] = [];

  @Output() opened: EventEmitter<void> = new EventEmitter();
  @Output() closed: EventEmitter<void> = new EventEmitter();
  @Output() optionSelected: EventEmitter<string> = new EventEmitter();

  private panelOpened = false;
  private inputElement!: HTMLInputElement;
  private autocompletePanel!: HTMLUListElement;
  private selectedLabel?: string;

  ngOnInit(): void {
    // Find the input element to attach the autocomplete panel to
    this.inputElement = document.querySelector(
      '[uiAutocomplete]'
    ) as HTMLInputElement;
    // Create the autocomplete panel element
    this.autocompletePanel = document.createElement('ul');
    this.autocompletePanel.classList.add(
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
      'py-1'
    );

    // Add a listener to the input element to show the autocomplete panel and filter the options
    this.inputElement.addEventListener('input', () => {
      if (this.selectedLabel !== this.inputElement.value)
        this.selectedLabel = undefined;
      this.setAutocompletePanel();
    });

    // Hide the autocomplete panel when clicking outside the input element
    document.addEventListener('click', (event) => {
      if (!this.inputElement.contains(event.target as Node)) {
        this.autocompletePanel.remove();
        this.panelOpened = false;
        this.closed.emit();
      } else if (!this.panelOpened) {
        // Or display the panel when clicking on it for the first time
        this.panelOpened = true;
        this.opened.emit();
        this.setAutocompletePanel();
      }
    });
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

    // Show the autocomplete panel
    if (filteredOptions.length > 0) {
      this.inputElement.parentNode?.appendChild(this.autocompletePanel);
    } else {
      this.autocompletePanel.remove();
    }
  }

  /**
   * Recursively creates li elements to the options
   *
   * @param options array of AutocompleteOptions
   * @param  parentElement the parent HTML element to attach the generated li elements
   */
  private setAutocompletePanelItems(
    options: AutocompleteOptions[],
    parentElement: HTMLElement
  ): void {
    options.forEach((option: AutocompleteOptions) => {
      const listItem = document.createElement('li');
      listItem.innerText = option.label;
      listItem.classList.add('text-gray-900', 'relative', 'pl-2');
      // If options is not the group's parent allow click
      if (!option.children) {
        listItem.classList.add('cursor-pointer', 'hover:bg-primary-100');
      }
      // Highlight selected option
      if (this.selectedLabel === listItem.innerText) {
        listItem.classList.add('bg-primary-200');
      }
      listItem.addEventListener('click', () => {
        if (!option.children) {
          this.selectedLabel = option.label;
          this.optionSelected.emit(option.label);
          this.inputElement.value = option.label;
          this.inputElement.dispatchEvent(new Event('input'));
        }
      });
      parentElement.appendChild(listItem);

      // If the option has children, a nested ul element is created
      // and the createAutocompletePanelItems() is recursively called
      if (option.children && option.children.length > 0) {
        const nestedList = document.createElement('ul');
        nestedList.classList.add('pl-4', 'py-1');
        listItem.appendChild(nestedList);
        this.setAutocompletePanelItems(option.children, nestedList);
      }
    });
  }

  /**
   * Recursively filter the original options list based on the label and return the matching options
   *
   * @param options autocomplete options original list
   * @param searchText text typed in the input
   * @returns filtered options that match the search text
   */
  private filterAutocompleteOptions(
    options: AutocompleteOptions[],
    searchText: string
  ): AutocompleteOptions[] {
    const filteredOptions: AutocompleteOptions[] = [];
    options.forEach((option: AutocompleteOptions) => {
      const filteredOption: AutocompleteOptions = { label: option.label };
      if (option.children && option.children.length > 0) {
        const filteredChildren = this.filterAutocompleteOptions(
          option.children,
          searchText
        );
        if (filteredChildren.length > 0) {
          filteredOption.children = filteredChildren;
        }
      }
      if (
        option.label.toLowerCase().includes(searchText.toLowerCase()) ||
        (filteredOption.children && filteredOption.children.length > 0)
      ) {
        filteredOptions.push(filteredOption);
      }
    });
    return filteredOptions;
  }
}
