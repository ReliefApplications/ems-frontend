import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, takeUntil } from 'rxjs/operators';

/**
 * Custom tagbox component to use in the app
 */
@Component({
  selector: 'safe-tagbox',
  templateUrl: './tagbox.component.html',
  styleUrls: ['./tagbox.component.scss'],
})
export class SafeTagboxComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
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
  public inputControl: AbstractControl = new FormControl();
  public showInput = true;
  public choicesEmpty = false;

  // === OUTPUT CONTROL ===
  @Input() parentControl!: AbstractControl;

  /**
   * Constructor for safe-tagbox component
   */
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.choices$
      .pipe(
        tap((choices: any[]) => {
          // For each values emitted by the choices stream we first update the empty state
          this.choicesEmpty = choices.length === 0;
          // Then we update the selected choices
          this.selectedChoices = this.choicesEmpty
            ? []
            : this.getSelectedChoices(choices);
          // And then set the available choices
          this.setAvailableChoices(choices);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.setUpChoicesListeners();
  }

  /**
   * Set up the listeners for the choices
   */
  private setUpChoicesListeners() {
    // Focus test input when it reappears after removing a selected choice.
    this.availableChoices
      .pipe(takeUntil(this.destroy$))
      .subscribe((availableChoices: any[]) => {
        if (!this.choicesEmpty) {
          if (!this.showInput && availableChoices.length > 0) {
            this.showInput = true;
            window.requestAnimationFrame(() => {
              this.textInput?.nativeElement.focus();
            });
          } else {
            this.showInput = availableChoices.length > 0;
          }
          this.filteredChoices = of(availableChoices);
        }
      });

    // Update available choices when search value or tags value changes
    this.inputControl.valueChanges
      .pipe(
        map((value: any) => {
          if (typeof value === 'string') {
            this.filteredChoices = of(
              this.filterChoices(this.currentChoices, value)
            );
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
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
   * Get selected choices items from the selected ones in the parent control
   * @param choices Array of choices from to get the selected ones
   * @returns The selected choices
   */
  private getSelectedChoices(choices: any[]): any[] {
    return this.parentControl.value.map((value: string) =>
      choices.find((choice) => value === choice[this.valueKey])
    );
  }

  /**
   * Updates the available choices list stream from the given choices using the current selected ones
   * @param choices Array of choices from whom to update the availability of choices to select
   */
  private setAvailableChoices(choices: any[]): void {
    const notSelectedChoices = choices.filter(
      (choice) =>
        !this.selectedChoices.some(
          (x) => x[this.valueKey] === choice[this.valueKey]
        )
    );
    this.availableChoices.next(this.orderChoicesDesc(notSelectedChoices));
  }

  /**
   * Sorts given choices in ascendant order by the value of they displayKey
   * @param choices Choices to sort
   * @returns Sorted choices
   */
  private orderChoicesDesc(choices: any[]): any[] {
    return choices.sort((a: any, b: any) =>
      a[this.displayKey] > b[this.displayKey] ? 1 : -1
    );
  }

  /**
   * Casts the inputControl to a FormControl
   *
   * @returns Returns the inputControls as a FormControl
   */
  get inputFormControl(): FormControl {
    return this.inputControl as FormControl;
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
      this.parentControl.setValue(
        this.selectedChoices.map((x) => x[this.valueKey])
      );
      this.availableChoices.next(
        this.currentChoices.filter((x) => x[this.displayKey] !== value)
      );
    }

    event.chipInput?.clear();
    this.inputControl.setValue('', { emitEvent: false });
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
      this.availableChoices.next(
        this.orderChoicesDesc([
          ...this.currentChoices,
          this.selectedChoices[index],
        ])
      );
      this.selectedChoices.splice(index, 1);
      this.parentControl.setValue(
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
    this.parentControl.setValue(
      this.selectedChoices.map((x) => x[this.valueKey])
    );
    this.availableChoices.next(
      this.currentChoices.filter(
        (x) => x[this.valueKey] !== event.option.value[this.valueKey]
      )
    );
    if (this.textInput) {
      this.textInput.nativeElement.value = '';
      this.inputControl.setValue('', { emitEvent: false });
    }
  }
}
