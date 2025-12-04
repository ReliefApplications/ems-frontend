import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { GraphQLSelectModule } from '@oort-front/ui';
import { Apollo, ApolloBase, QueryRef } from 'apollo-angular';
import { Subject, takeUntil } from 'rxjs';
import { GET_PEOPLE_BY_ID, SEARCH_PEOPLE } from './graphql/queries';
import {
  GetPeopleByIdResponse,
  People,
  SearchPeopleQueryResponse,
  SearchPeopleVars,
} from '../../../models/people.model';

/** Default placeholder text */
const DEFAULT_PLACEHOLDER = 'Begin typing and select';
/** Default page size */
const ITEMS_PER_PAGE = 10;
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
 * Dropdown component to search/select a person
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    GraphQLSelectModule,
  ],
  selector: 'shared-people-dropdown',
  templateUrl: './people-dropdown.component.html',
  styleUrls: ['./people-dropdown.component.scss'],
})
export class PeopleDropdownComponent implements OnInit, OnDestroy {
  /** Initial selected userid or full PeopleFieldValue */
  @Input() initialSelectionID: string | PeopleFieldValue | null = null;
  /** Emits full people data when selection changes (includes metadata for grid/export) */
  @Output() selectionChange = new EventEmitter<PeopleFieldValue | null>();

  /** Backing control for selected value */
  public control = new FormControl<string | null>(null);
  /** GraphQLSelect query */
  public query!: QueryRef<SearchPeopleQueryResponse, SearchPeopleVars>;
  /** Initial selection */
  public initialSelection: People[] = [];
  /** CS named client */
  private csClient: ApolloBase;
  /** Destroy notifier */
  private destroy$ = new Subject<void>();
  /** Cache of loaded people for lookup on selection */
  private peopleCache: Map<string, People> = new Map();

  /** Placeholder, debounce, page size, and minimum search length (configurable via People Settings) */
  public placeholder = DEFAULT_PLACEHOLDER;
  /** Debounce in ms before triggering search */
  public searchDebounce = DEBOUNCE_TIME;
  /** Page size per request */
  public pageSize = ITEMS_PER_PAGE;
  /** Minimum characters required to trigger search */
  public minSearchLength = MIN_SEARCH_LENGTH;

  /**
   * Display formatter for the select
   *
   * @param p Person item
   * @returns The visible option label
   */
  public displayFormatter = (p: People): string => {
    const name = [p.firstname, p.lastname].filter(Boolean).join(' ').trim();
    if (p.emailaddress) {
      return name ? `${name} (${p.emailaddress})` : p.emailaddress;
    }
    return name;
  };

  /**
   * Component to pick users from the list of users
   *
   * @param apollo Apollo client
   */
  constructor(private apollo: Apollo) {
    this.csClient = this.apollo.use('csClient');
  }

  ngOnInit(): void {
    // Emit selection changes with full person data
    this.control.valueChanges
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((userid) => {
        if (!userid) {
          this.selectionChange.emit(null);
          return;
        }
        // Look up the full person data from cache
        const person = this.peopleCache.get(userid);
        if (person) {
          this.selectionChange.emit({
            userid: person.userid,
            firstname: person.firstname,
            lastname: person.lastname,
            emailaddress: person.emailaddress,
          });
        } else {
          // Fallback: emit just the userid if not in cache
          this.selectionChange.emit({ userid });
        }
      });

    // Load initial selection if provided
    const initialId = this.getInitialUserId();
    if (initialId) {
      this.csClient
        .query<GetPeopleByIdResponse>({
          query: GET_PEOPLE_BY_ID,
          variables: { ids: [initialId] },
          fetchPolicy: 'no-cache',
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          const user = (data.users ?? [])[0];
          if (user) {
            this.initialSelection = [user];
            this.peopleCache.set(user.userid, user);
            this.control.setValue(user.userid, { emitEvent: false });
          }
        });
    }
  }

  /**
   * Gets the initial userid from either a string or PeopleFieldValue
   *
   * @returns The userid string or null
   */
  private getInitialUserId(): string | null {
    if (!this.initialSelectionID) {
      return null;
    }
    if (typeof this.initialSelectionID === 'string') {
      return this.initialSelectionID;
    }
    return this.initialSelectionID.userid;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handles search updates from the text input.
   *
   * @param searchValue New search value
   */
  public onSearchChange(searchValue: string): void {
    const trimmed = (searchValue || '').trim();
    if (trimmed.length < this.minSearchLength) {
      if (this.query) {
        const emptyFilter = JSON.stringify({ OR: [{ firstname_like: '' }] });
        this.query.refetch({ filter: emptyFilter, first: 1, skip: 0 });
      }
      return;
    }
    const filter = JSON.stringify({
      OR: [
        { firstname_like: trimmed },
        { lastname_like: trimmed },
        { emailaddress_like: trimmed },
      ],
    });
    if (!this.query) {
      this.query = this.csClient.watchQuery<
        SearchPeopleQueryResponse,
        SearchPeopleVars
      >({
        query: SEARCH_PEOPLE,
        variables: { filter, first: this.pageSize, skip: 0 },
        fetchPolicy: 'no-cache',
      });
      // Subscribe to cache people as they are loaded
      this.query.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          this.cachePeople(data?.users || []);
        });
    } else {
      this.query.refetch({ filter, first: this.pageSize, skip: 0 });
    }
  }

  /**
   * Caches people data for lookup when selection changes
   *
   * @param people List of people to cache
   */
  private cachePeople(people: People[]): void {
    for (const person of people) {
      this.peopleCache.set(person.userid, person);
    }
  }
}
