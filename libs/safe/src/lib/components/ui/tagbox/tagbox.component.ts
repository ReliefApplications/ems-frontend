import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';

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
  public availableChoices: any[] = [];
  public selectedChoices: any[] = [];
  public filteredChoices: any[] = [];

  // === TAGBOX ===
  @Input() public label!: any;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('textInput') private textInput?: ElementRef<HTMLInputElement>;

  public choicesEmpty = false;
  public inputControl: FormControl = new UntypedFormControl({
    value: '',
    disabled: this.choicesEmpty,
  });
  public showInput = false;

  // === OUTPUT CONTROL ===
  @Input() control!: FormControl;

  /**
   * Tagbox constructor
   */
  constructor() {
    super();
  }

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
