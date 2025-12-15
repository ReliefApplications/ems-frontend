import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  of,
  takeUntil,
  tap,
  startWith,
} from 'rxjs';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { CommonServicesService } from '../../../services/common-services/common-services.service';
import { People } from '../people.type';

/**
 * People Dropdown Component
 */
@Component({
  selector: 'shared-people-dropdown',
  standalone: true,
  imports: [CommonModule, ComboBoxModule, ReactiveFormsModule],
  templateUrl: './people-dropdown.component.html',
  styleUrls: ['./people-dropdown.component.scss'],
})
export class PeopleDropdownComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges
{
  /** Placeholder text */
  @Input() placeholder = 'Begin typing and select';
  /** Search debounce time in milliseconds */
  @Input() searchDebounce = 500;
  /** Minimum search length to trigger search */
  @Input() minSearchLength = 2;
  /** Initial selected person */
  @Input() initialSelection: People | null = null;
  /** Emits when the selected person changes */
  @Output() selectionChange = new EventEmitter<People | null>();
  /** Form control for the dropdown */
  control = new FormControl();
  /** List of people to display in the dropdown */
  data: People[] = [];
  /** Currently selected person */
  selectedPerson: People | null = null;
  /** Subject to handle filter input */
  private filter$ = new Subject<string>();
  /** Observable for filter display */
  public filterDisplay$ = this.filter$.asObservable().pipe(startWith(''));
  /** Loading state */
  public loading = false;
  /** Common services connector */
  private commonServices = inject(CommonServicesService);
  /** Element reference */
  public elementRef = inject(ElementRef);

  ngOnInit(): void {
    if (this.initialSelection) {
      this.selectedPerson = {
        ...this.initialSelection,
        displayLabel: this.formatDisplayLabel(this.initialSelection),
      };
      this.control.setValue(this.selectedPerson);
      this.data = [this.selectedPerson];
    }

    this.filter$
      .pipe(
        debounceTime(this.searchDebounce),
        distinctUntilChanged(),
        switchMap((filter) => {
          if (filter.length >= this.minSearchLength) {
            this.loading = true;
            return this.commonServices.searchAzureUsers(filter).pipe(
              catchError(() => of({ value: [] })),
              tap((results: any) => {
                this.data = results.value.map((user: any) => ({
                  userid: user.userId,
                  firstname: user.firstName,
                  lastname: user.lastName,
                  emailaddress: user.emailAddress,
                  displayLabel: this.formatDisplayLabel(user),
                }));
                this.loading = false;
              })
            );
          }
          this.data = [];
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialSelection'] && this.initialSelection) {
      this.selectedPerson = {
        ...this.initialSelection,
        displayLabel: this.formatDisplayLabel(this.initialSelection),
      };
      this.control.setValue(this.selectedPerson, { emitEvent: false });
      this.data = [this.selectedPerson];
    }
  }

  /**
   * Handle selection change
   *
   * @param value New value
   */
  onSelectionChange(value: People): void {
    this.selectedPerson = value;
    this.data = [this.selectedPerson];
    this.selectionChange.emit(this.selectedPerson);
  }

  /**
   * Handle filter input
   *
   * @param value New filter
   */
  handleFilter(value: string): void {
    if (value.length >= this.minSearchLength) {
      this.loading = true;
    }
    this.filter$.next(value);
  }

  /**
   * Format display label for a user
   *
   * @param user User object
   * @returns Formatted display label
   */
  private formatDisplayLabel(user: any): string {
    // FIX: Check for both lowercase (Interface) and CamelCase (API) just in case,
    // but prefer the interface keys.
    const firstName = user.firstname || user.firstName || '';
    const lastName = user.lastname || user.lastName || '';
    const email = user.emailaddress || user.emailAddress;

    const name = [firstName, lastName].filter(Boolean).join(' ').trim();
    if (email) {
      return name ? `${name} (${email})` : email;
    }
    return name || user.userid || '';
  }
}
