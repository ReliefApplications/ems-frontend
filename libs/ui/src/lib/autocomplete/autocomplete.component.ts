import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ElementRef,
  HostListener,
  Provider,
  forwardRef,
} from '@angular/core';
import { AutocompleteOptions } from './interfaces/autocomplete-options.interface';
import {
  FormControl,
  Validators,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

/** A provider for the ControlValueAccessor interface. */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AutocompleteComponent),
  multi: true,
};

/**
 * UI Autocomplete component
 */
@Component({
  selector: 'ui-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class AutocompleteComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder = '';
  @Input() required = false;
  @Input() options!: AutocompleteOptions[];

  @Output() opened: EventEmitter<boolean> = new EventEmitter();
  @Output() closed: EventEmitter<boolean> = new EventEmitter();
  @Output() selectOption: EventEmitter<AutocompleteOptions> =
    new EventEmitter();
  disabled = false;

  public formControl = new FormControl('');
  public filteredOptions!: AutocompleteOptions[];
  public open = false;
  public optionSelected: AutocompleteOptions = { label: '' };

  onChange!: (value: string) => void;
  onTouch!: () => void;

  /**
   * Listen to click event on the document to close the panel when clicking outside.
   *
   * @param event Mouse event
   */
  @HostListener('document:click', ['$event'])
  clickOut(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && this.open) {
      this.open = false;
      this.closed.emit(true);
    }
  }

  /**
   * Creates an instance of AutocompleteComponent.
   *
   * @param elementRef shared element ref service
   */
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.filteredOptions = [...this.options];
    if (this.required) this.formControl.addValidators(Validators.required);
    if (this.disabled) this.formControl.disable();
    this.formControl.valueChanges.subscribe((searchText) => {
      if (searchText) {
        this.filteredOptions = this.filterAutocompleteOptions(
          [...this.options],
          searchText
        );
        if (this.onTouch && this.onChange) {
          this.onTouch();
          this.onChange(searchText);
        }
      } else {
        if (this.optionSelected) this.optionSelected.selected = false;
        this.filteredOptions = this.options;
      }
    });
  }

  /**
   * Handles the selection of a option
   *
   * @param value selected option
   */
  public onSelect(value: AutocompleteOptions): void {
    value.selected = true;
    if (this.optionSelected) {
      this.optionSelected.selected = false;
    }
    this.open = false;
    this.optionSelected = value;
    this.closed.emit(true);
    if (this.onTouch && this.onChange) {
      this.onTouch();
      this.onChange(value.label);
    }
    this.selectOption.emit(value);
  }

  /** Handles the panel opening */
  public onOpen(): void {
    if (!this.open) {
      this.open = true;
      this.opened.emit(true);
    }
  }

  /**
   * Write value of control.
   *
   * @param value new value
   */
  public writeValue(value: string): void {
    this.optionSelected.label = value;
  }

  /**
   * Register new method to call when control state change
   *
   * @param fn callback function
   */
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Register new method to call when control touch state change
   *
   * @param fn callback function
   */
  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  /**
   * Set disabled state of the control
   *
   * @param isDisabled is control disabled
   */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
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
      const filteredOption: AutocompleteOptions = {
        label: option.label,
        selected: option.selected ?? false,
      };
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
