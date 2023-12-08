import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';

/**
 * Custom tagbox component to use in the app
 */
@Component({
  selector: 'shared-tagbox',
  templateUrl: './tagbox.component.html',
  styleUrls: ['./tagbox.component.scss'],
})
export class TagboxComponent extends UnsubscribeComponent implements OnInit {
  // === CHOICES ===
  /** Observable of choices */
  @Input() public choices$!: Observable<any[]>;
  /** Display key */
  @Input() public displayKey = 'name';
  /** Value key */
  @Input() public valueKey = 'name';
  /** Available choices */
  public availableChoices: any[] = [];
  /** Selected choices */
  public selectedChoices: any[] = [];
  /** Filtered choices */
  public filteredChoices: any[] = [];

  // === TAGBOX ===
  /** Label */
  @Input() public label!: any;
  /** Separator key codes */
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  /** Text input element reference */
  @ViewChild('textInput') private textInput?: ElementRef<HTMLInputElement>;
  /** Choices empty status */
  public choicesEmpty = false;
  /** Input control */
  public inputControl: FormControl = new UntypedFormControl({
    value: '',
    disabled: this.choicesEmpty,
  });
  /** Input visibility status */
  public showInput = false;

  // === OUTPUT CONTROL ===
  /** Output control */
  @Input() control!: FormControl;

  /**
   * Tagbox constructor
   */
  constructor() {
    super();
  }

  /** OnInit lifecycle hook. */
  ngOnInit(): void {
    this.choices$.pipe(takeUntil(this.destroy$)).subscribe((choices: any[]) => {
      this.choicesEmpty = choices.length === 0;
      if (this.choicesEmpty) {
        this.inputControl.disable();
      } else {
        this.inputControl.enable();
      }
      this.selectedChoices = this.choicesEmpty
        ? []
        : this.control.value
            .map((value: string) =>
              choices.find((choice) => value === choice[this.valueKey])
            )
            .filter((x: any) => x);
      this.availableChoices = choices.filter(
        (choice) =>
          !this.selectedChoices.some(
            (x) => x[this.valueKey] === choice[this.valueKey]
          )
      );
      this.inputControl.valueChanges
        .pipe(startWith(''), takeUntil(this.destroy$))
        .subscribe({
          next: (value: string) => {
            this.filteredChoices = this.filterChoices(
              this.availableChoices,
              value
            ).sort((a: any, b: any) =>
              a[this.displayKey] > b[this.displayKey] ? 1 : -1
            );
            this.showInput = true;
          },
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
  add(event: string | any): void {
    const value = event[this.displayKey] ?? event;
    if (
      value &&
      this.availableChoices.some((x) => x[this.displayKey] === value)
    ) {
      this.selectedChoices.push(
        this.availableChoices.find((x) => x[this.displayKey] === value)
      );
      this.control.setValue(this.selectedChoices.map((x) => x[this.valueKey]));
      this.filteredChoices = this.availableChoices.filter(
        (choice) =>
          !this.selectedChoices.find(
            (x) => x[this.valueKey] === choice[this.valueKey]
          )
      );
    }
    this.inputControl.setValue('', { emitEvent: false });
    setTimeout(() => {
      window.requestAnimationFrame(() => this.textInput?.nativeElement.focus());
    }, 10);
  }

  /**
   * Remove a selected choice from the chip list.
   *
   * @param choice Choice to remove.
   */
  remove(choice: any): void {
    if (choice) {
      this.selectedChoices = this.selectedChoices.filter(
        (x) => x[this.valueKey] !== choice[this.valueKey]
      );
      this.filteredChoices = this.availableChoices.filter(
        (choice) =>
          !this.selectedChoices.find(
            (x) => x[this.valueKey] === choice[this.valueKey]
          )
      );
      this.control.setValue(this.selectedChoices.map((x) => x[this.valueKey]));
    }
  }
}
