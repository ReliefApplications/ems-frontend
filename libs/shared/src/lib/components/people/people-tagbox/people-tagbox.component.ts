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
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
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
 * People Tagbox Component
 */
@Component({
  selector: 'shared-people-tagbox',
  standalone: true,
  imports: [CommonModule, MultiSelectModule, ReactiveFormsModule],
  templateUrl: './people-tagbox.component.html',
  styleUrls: ['./people-tagbox.component.scss'],
})
export class PeopleTagboxComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges
{
  /** Placeholder text */
  @Input() placeholder = 'Begin typing and select';
  /** Search debounce time in milliseconds */
  @Input() searchDebounce = 500;
  /** Minimum search length to trigger search */
  @Input() minSearchLength = 2;
  /** Initial selected people */
  @Input() initialSelection: People[] = [];
  /** Emits when the selected person changes */
  @Output() selectionChange = new EventEmitter<People[]>();
  /** Form control for the tagbox */
  control = new FormControl();
  /** List of people to display in the tagbox */
  data: People[] = [];
  /** Currently selected people */
  selectedPeople: People[] = [];
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
    if (this.initialSelection?.length) {
      this.selectedPeople = this.initialSelection.map((p) => ({
        ...p,
        displayLabel: this.formatDisplayLabel(p),
      }));
      this.control.setValue(this.selectedPeople);
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
          } else {
            this.data = [];
          }
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialSelection'] && this.initialSelection) {
      this.selectedPeople = this.initialSelection.map((p) => ({
        ...p,
        displayLabel: this.formatDisplayLabel(p),
      }));
      this.control.setValue(this.selectedPeople, { emitEvent: false });
    }
  }

  /**
   * Handle value change
   *
   * @param value New value
   */
  onValueChange(value: People[]): void {
    this.selectedPeople = value;
    this.selectionChange.emit(this.selectedPeople);
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
