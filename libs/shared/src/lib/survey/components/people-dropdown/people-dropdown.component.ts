import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  SelectMenuModule,
  SelectOptionModule,
  SpinnerModule,
  ButtonModule,
  IconModule,
} from '@oort-front/ui';
import { Apollo, ApolloBase } from 'apollo-angular';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { GET_PEOPLE_BY_ID } from './graphql/queries';
import { GetPeopleByIdResponse, People } from '../../../models/people.model';
import { CommonServicesService } from '../../../services/common-services/common-services.service';

/** Default placeholder text */
const DEFAULT_PLACEHOLDER = 'Begin typing and select';
/** Default characters to trigger a search */
const MIN_SEARCH_LENGTH = 2;
/** Debounce time for search */
const DEBOUNCE_TIME = 500;

/**
 * Value stored for a people field - includes userid and display metadata
 */
export interface PeopleFieldValue {
  userid: string;
  firstname?: string;
  lastname?: string;
  emailaddress?: string;
}

/**
 * Formats a person's display text as "FirstName LastName (email)"
 *
 * @param person The person data
 * @returns Formatted display string
 */
export function formatPersonDisplay(person: PeopleFieldValue | People): string {
  const firstName = person.firstname || '';
  const lastName = person.lastname || '';
  const email = person.emailaddress || '';
  const name = [firstName, lastName].filter(Boolean).join(' ').trim();
  if (email) {
    return name ? `${name} (${email})` : email;
  }
  return name || person.userid || '';
}

/**
 * Dropdown component to search/select a person (single select)
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SelectMenuModule,
    SelectOptionModule,
    SpinnerModule,
    ButtonModule,
    IconModule,
  ],
  selector: 'shared-people-dropdown',
  templateUrl: './people-dropdown.component.html',
  styleUrls: ['./people-dropdown.component.scss'],
})
export class PeopleDropdownComponent implements OnInit, OnChanges, OnDestroy {
  /** Initial selected value (can be userid string or full PeopleFieldValue) */
  @Input() initialSelection: string | PeopleFieldValue | null = null;
  /** Emits full people data when selection changes */
  @Output() selectionChange = new EventEmitter<PeopleFieldValue | null>();

  /** Backing control for selected value (stores userid) */
  public control = new FormControl<string | null>(null);
  /** Search control for filtering */
  public searchControl = new FormControl<string>('', { nonNullable: true });
  /** Available options from search */
  public options: People[] = [];
  /** Selected person for display */
  public selectedPerson: People | null = null;
  /** Loading state */
  public loading = false;
  /** CS named client for GraphQL */
  private csClient: ApolloBase;
  /** Destroy notifier */
  private destroy$ = new Subject<void>();
  /** Cache of loaded people for lookup */
  private peopleCache: Map<string, People> = new Map();

  /** Placeholder text */
  public placeholder = DEFAULT_PLACEHOLDER;
  /** Debounce in ms before triggering search */
  public searchDebounce = DEBOUNCE_TIME;
  /** Minimum characters required to trigger search */
  public minSearchLength = MIN_SEARCH_LENGTH;

  /**
   * Constructor
   *
   * @param apollo Apollo client for GraphQL
   * @param commonServicesService Common Services for REST API
   * @param cdr Change detector
   */
  constructor(
    private apollo: Apollo,
    private commonServicesService: CommonServicesService,
    private cdr: ChangeDetectorRef
  ) {
    this.csClient = this.apollo.use('csClient');
  }

  ngOnInit(): void {
    // Setup search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.searchDebounce),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.onSearch(value);
      });

    // Emit selection changes with full person data
    this.control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((userid) => {
        if (!userid) {
          this.selectedPerson = null;
          this.selectionChange.emit(null);
          return;
        }
        const person = this.peopleCache.get(userid);
        if (person) {
          this.selectedPerson = person;
          this.selectionChange.emit({
            userid: person.userid,
            firstname: person.firstname,
            lastname: person.lastname,
            emailaddress: person.emailaddress,
          });
        } else {
          this.selectionChange.emit({ userid });
        }
        this.cdr.detectChanges();
      });

    // Load initial selection
    this.loadInitialSelection();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['initialSelection'] &&
      !changes['initialSelection'].firstChange
    ) {
      this.loadInitialSelection();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads initial selection if provided
   */
  private loadInitialSelection(): void {
    if (!this.initialSelection) {
      return;
    }

    if (
      typeof this.initialSelection === 'object' &&
      this.initialSelection.userid
    ) {
      const person: People = {
        userid: this.initialSelection.userid,
        firstname: this.initialSelection.firstname,
        lastname: this.initialSelection.lastname,
        emailaddress: this.initialSelection.emailaddress,
      };
      this.cachePeople([person]);
      this.selectedPerson = person;
      this.options = [person];
      this.control.setValue(person.userid, { emitEvent: false });
      this.cdr.detectChanges();
      return;
    }

    const initialId =
      typeof this.initialSelection === 'string'
        ? this.initialSelection
        : this.initialSelection.userid;

    if (!initialId) {
      return;
    }

    this.loading = true;
    this.csClient
      .query<GetPeopleByIdResponse>({
        query: GET_PEOPLE_BY_ID,
        variables: { ids: [initialId] },
        fetchPolicy: 'no-cache',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data }) => {
          const user = (data.users ?? [])[0];
          if (user) {
            this.cachePeople([user]);
            this.selectedPerson = user;
            this.options = [user];
            this.control.setValue(user.userid, { emitEvent: false });
          }
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  /**
   * Performs search via REST API
   *
   * @param searchText Search text
   */
  private onSearch(searchText: string): void {
    const trimmed = (searchText || '').trim();
    if (trimmed.length < this.minSearchLength) {
      // Keep selected person in options if present
      this.options = this.selectedPerson ? [this.selectedPerson] : [];
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.commonServicesService
      .searchAzureUsers(trimmed)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const rawUsers = response?.value || [];
          const users: People[] = rawUsers.map((u: any) => ({
            userid: u.userId,
            firstname: u.firstName,
            lastname: u.lastName,
            emailaddress: u.emailAddress,
          }));
          this.cachePeople(users);
          // Include selected person if not in results
          if (
            this.selectedPerson &&
            !users.find((u) => u.userid === this.selectedPerson?.userid)
          ) {
            this.options = [this.selectedPerson, ...users];
          } else {
            this.options = users;
          }
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.options = this.selectedPerson ? [this.selectedPerson] : [];
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  /**
   * Caches people for lookup
   *
   * @param people People to cache
   */
  private cachePeople(people: People[]): void {
    for (const person of people) {
      this.peopleCache.set(person.userid, person);
    }
  }

  /**
   * Gets display text for a person
   *
   * @param person Person to format
   * @returns Display string
   */
  public getDisplayText(person: People): string {
    return formatPersonDisplay(person);
  }

  /**
   * Clears the search input
   */
  public clearSearch(): void {
    this.searchControl.setValue('');
  }

  /**
   * Called when select opens
   */
  public onSelectOpen(): void {
    // Focus search input if needed
  }

  /**
   * Called when select closes
   */
  public onSelectClose(): void {
    this.searchControl.setValue('');
  }
}
