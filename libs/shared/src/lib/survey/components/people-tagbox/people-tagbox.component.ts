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
import { GET_PEOPLE_BY_ID } from '../people-dropdown/graphql/queries';
import { GetPeopleByIdResponse, People } from '../../../models/people.model';
import { CommonServicesService } from '../../../services/common-services/common-services.service';
import {
  PeopleFieldValue,
  formatPersonDisplay,
} from '../people-dropdown/people-dropdown.component';

/** Default placeholder text */
const DEFAULT_PLACEHOLDER = 'Begin typing and select';
/** Default characters to trigger a search */
const MIN_SEARCH_LENGTH = 2;
/** Debounce time for search */
const DEBOUNCE_TIME = 500;

/**
 * Tagbox component to search/select multiple people (multi-select)
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
  selector: 'shared-people-tagbox',
  templateUrl: './people-tagbox.component.html',
  styleUrls: ['./people-tagbox.component.scss'],
})
export class PeopleTagboxComponent implements OnInit, OnChanges, OnDestroy {
  /** Initial selected values (can be userid strings or full PeopleFieldValue array) */
  @Input() initialSelection: (string | PeopleFieldValue)[] | null = null;
  /** Emits full people data array when selection changes */
  @Output() selectionChange = new EventEmitter<PeopleFieldValue[]>();

  /** Backing control for selected values (stores userids) */
  public control = new FormControl<string[]>([], { nonNullable: true });
  /** Search control for filtering */
  public searchControl = new FormControl<string>('', { nonNullable: true });
  /** Available options from search */
  public options: People[] = [];
  /** Selected people for display */
  public selectedPeople: People[] = [];
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
      .subscribe((rawValues) => {
        const userids = (rawValues || []).filter(
          (v): v is string => typeof v === 'string' && v.length > 0
        );

        const selectedValues: PeopleFieldValue[] = [];
        this.selectedPeople = [];

        for (const userid of userids) {
          const person = this.peopleCache.get(userid);
          if (person) {
            this.selectedPeople.push(person);
            selectedValues.push({
              userid: person.userid,
              firstname: person.firstname,
              lastname: person.lastname,
              emailaddress: person.emailaddress,
            });
          }
        }
        this.selectionChange.emit(selectedValues);
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
    if (!this.initialSelection || !Array.isArray(this.initialSelection)) {
      return;
    }

    const hasFullObjects = this.initialSelection.some(
      (item) => typeof item === 'object' && item.userid && item.firstname
    );

    if (hasFullObjects) {
      const people: People[] = this.initialSelection
        .filter(
          (item): item is PeopleFieldValue =>
            typeof item === 'object' && !!item.userid
        )
        .map((item) => ({
          userid: item.userid,
          firstname: item.firstname,
          lastname: item.lastname,
          emailaddress: item.emailaddress,
        }));

      this.cachePeople(people);
      this.selectedPeople = people;
      this.options = [...people];
      this.control.setValue(
        people.map((p) => p.userid),
        { emitEvent: false }
      );
      this.cdr.detectChanges();
      return;
    }

    const initialIds = this.initialSelection
      .map((item) => (typeof item === 'string' ? item : item.userid))
      .filter((id): id is string => typeof id === 'string' && id.length > 0);

    if (!initialIds.length) {
      return;
    }

    this.loading = true;
    this.csClient
      .query<GetPeopleByIdResponse>({
        query: GET_PEOPLE_BY_ID,
        variables: { ids: initialIds },
        fetchPolicy: 'no-cache',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data }) => {
          const users = data.users ?? [];
          this.cachePeople(users);
          this.selectedPeople = users;
          this.options = [...users];
          this.control.setValue(
            users.map((u) => u.userid),
            { emitEvent: false }
          );
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
      // Keep selected people in options
      this.options = [...this.selectedPeople];
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
          // Merge selected people with search results (avoid duplicates)
          const selectedIds = new Set(this.selectedPeople.map((p) => p.userid));
          const newOptions = [
            ...this.selectedPeople,
            ...users.filter((u) => !selectedIds.has(u.userid)),
          ];
          this.options = newOptions;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.options = [...this.selectedPeople];
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
   * Removes a person from the selection
   *
   * @param userid User ID to remove
   */
  public removePerson(userid: string): void {
    const currentValue = this.control.value;
    const newValue = currentValue.filter(
      (id): id is string => typeof id === 'string' && id !== userid
    );
    this.control.setValue(newValue);
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
