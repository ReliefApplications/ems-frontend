import {
  Component,
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
import { PeopleFieldValue } from '../people-dropdown/people-dropdown.component';

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
  @Input() placeholder = 'Begin typing and select';
  @Input() searchDebounce = 500;
  @Input() minSearchLength = 2;
  @Input() initialSelection: PeopleFieldValue[] = [];

  @Output() selectionChange = new EventEmitter<PeopleFieldValue[]>();

  control = new FormControl();
  data: PeopleFieldValue[] = [];
  selectedPeople: PeopleFieldValue[] = [];
  private filter$ = new Subject<string>();
  public filterDisplay$ = this.filter$.asObservable().pipe(startWith(''));
  public loading = false;

  private commonServices = inject(CommonServicesService);

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
          console.log('Filtering people with:', filter);
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

  onValueChange(value: any): void {
    this.selectedPeople = value;
    this.selectionChange.emit(this.selectedPeople);
  }

  handleFilter(value: string): void {
    if (value.length >= this.minSearchLength) {
      this.loading = true;
    }
    this.filter$.next(value);
  }

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
