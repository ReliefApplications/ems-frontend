import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  UntypedFormControl,
} from '@angular/forms';
import {
  MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent,
  MatLegacyAutocompleteTrigger as MatAutocompleteTrigger,
} from '@angular/material/legacy-autocomplete';
import { MatLegacyChipInputEvent as MatChipInputEvent } from '@angular/material/legacy-chips';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

/**
 * Custom tagbox component to use in the app
 */
@Component({
  selector: 'safe-tagbox',
  templateUrl: './tagbox.component.html',
  styleUrls: ['./tagbox.component.scss'],
})
export class SafeTagboxComponent implements OnInit {
  // === CHOICES ===
  @Input() public choices$!: Observable<any[]>;
  @Input() public displayKey = 'name';
  @Input() public valueKey = 'name';
  public availableChoices = new BehaviorSubject<any[]>([]);
  public selectedChoices: any[] = [];
  public filteredChoices?: Observable<any[]>;

  // === TAGBOX ===
  @Input() public label!: any;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('textInput') private textInput?: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger)
  private autoTrigger?: MatAutocompleteTrigger;
  public inputControl: AbstractControl = new UntypedFormControl();
  public showInput = true;
  public choicesEmpty = false;

  // === OUTPUT CONTROL ===
  @Input() formControl!: FormControl;

  ngOnInit(): void {
    this.choices$.subscribe((choices: any[]) => {
      this.choicesEmpty = choices.length === 0;
      this.selectedChoices = this.choicesEmpty
        ? []
        : this.formControl.value
            .map((value: string) =>
              choices.find((choice) => value === choice[this.valueKey])
            )
            .filter((x: any) => x);
      this.availableChoices.next(
        choices.filter(
          (choice) =>
            !this.selectedChoices.some(
              (x) => x[this.valueKey] === choice[this.valueKey]
            )
        )
      );
      // Set up filtered choices for the autocomplete
      this.filteredChoices = merge(
        this.inputControl.valueChanges,
        this.availableChoices.asObservable()
      ).pipe(
        startWith(null),
        map((value: any) => {
          if (value) {
            if (typeof value === 'string') {
              return this.filterChoices(this.currentChoices, value);
            } else if (Array.isArray(value)) {
              if (
                this.inputControl.value &&
                typeof this.inputControl.value === 'string'
              ) {
                return this.filterChoices(value, this.inputControl.value);
              } else {
                return [...value];
              }
            }
          }
          return [...this.currentChoices];
        }),
        map((value: any[]) =>
          value.sort((a: any, b: any) =>
            a[this.displayKey] > b[this.displayKey] ? 1 : -1
          )
        )
      );
      // Focus test input when it reappears after removing a selected choice.
      this.availableChoices.subscribe((value) => {
        if (!this.choicesEmpty) {
          if (!this.showInput && value.length > 0) {
            this.showInput = true;
            window.requestAnimationFrame(() =>
              this.textInput?.nativeElement.focus()
            );
          } else {
            this.showInput = value.length > 0;
          }
        }
      });
    });
  }

  /**
   * Filter passed choices by displayKeys using passed string.
   *
   * @param choices array to filter.
   * @param value string used to filter.
   * @returns Returns the filtered choices as an array.
   */
  private filterChoices(choices: any, value: string): any[] {
    return choices.filter((choice: any) =>
      choice[this.displayKey].toLowerCase().includes(value.toLowerCase())
    );
  }

  /**
   * Casts the inputControl to a FormControl
   *
   * @returns Returns the inputControls as a FormControl
   */
  get inputFormControl(): UntypedFormControl {
    return this.inputControl as UntypedFormControl;
  }

  /**
   * Gets the value from availableChoices FormGroup
   *
   * @returns Returns the availableChoices as a plain object
   */
  get currentChoices(): any[] {
    return this.availableChoices.value;
  }

  /**
   * Display function necessary for the autocomplete in order to display selected choice.
   *
   * @param choice Field to display.
   * @returns Returns a string containing the name of the field
   */
  public displayName(choice: any): string {
    return choice && choice[this.displayKey] ? choice[this.displayKey] : choice;
  }

  /**
   * Add a new selected choice if possible from text input.
   *
   * @param event Chip event with the text input.
   */
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (
      value &&
      this.currentChoices.some((x) => x[this.displayKey] === value)
    ) {
      this.selectedChoices.push(
        this.currentChoices.find((x) => x[this.displayKey] === value)
      );
      this.formControl.setValue(
        this.selectedChoices.map((x) => x[this.valueKey])
      );
      this.availableChoices.next(
        this.currentChoices.filter((x) => x[this.displayKey] !== value)
      );
    }

    event.chipInput?.clear();
    this.inputControl.setValue('');
  }

  /**
   * Remove a selected choice from the chip list.
   *
   * @param choice Choice to remove.
   */
  remove(choice: any): void {
    const index = this.selectedChoices.findIndex(
      (x) => x[this.valueKey] === choice[this.valueKey]
    );

    if (index >= 0) {
      this.availableChoices.next([
        ...this.currentChoices,
        this.selectedChoices[index],
      ]);
      this.selectedChoices.splice(index, 1);
      this.formControl.setValue(
        this.selectedChoices.map((x) => x[this.valueKey])
      );
    }
  }

  /**
   * Add a new selected choice if possible from autocompletion selection.
   *
   * @param event Autocomplete event with the selected choice.
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    window.requestAnimationFrame(() => this.autoTrigger?.openPanel());
    this.selectedChoices.push(
      this.currentChoices.find(
        (x) => x[this.valueKey] === event.option.value[this.valueKey]
      )
    );
    this.formControl.setValue(
      this.selectedChoices.map((x) => x[this.valueKey])
    );
    this.availableChoices.next(
      this.currentChoices.filter(
        (x) => x[this.valueKey] !== event.option.value[this.valueKey]
      )
    );
    if (this.textInput) {
      this.textInput.nativeElement.value = '';
      this.inputControl.setValue('');
    }
  }
}
