import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Application } from '../../models/application.model';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  MAT_LEGACY_SELECT_SCROLL_STRATEGY as MAT_SELECT_SCROLL_STRATEGY,
  MatLegacySelect as MatSelect,
} from '@angular/material/legacy-select';
import {
  GetApplicationsQueryResponse,
  GET_APPLICATIONS,
} from './graphql/queries';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { updateQueryUniqueValues } from '../../utils/update-queries';

/**
 * A constant that is used to set the number of items to be displayed on the page.
 */
const ITEMS_PER_PAGE = 10;

/**
 * Scroll Factory for material select, provided by the component.
 *
 * @param overlay material overlay
 * @returns Strategy to prevent scrolling if user sees overlay.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  const block = () => overlay.scrollStrategies.block();
  return block;
}

/**
 * This is a component used to show a dropdown form where the user can choose an application
 */
@Component({
  selector: 'safe-application-dropdown',
  templateUrl: './application-dropdown.component.html',
  styleUrls: ['./application-dropdown.component.scss'],
  providers: [
    {
      provide: MAT_SELECT_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
  ],
})
export class SafeApplicationDropdownComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() value = [];
  @Output() choice: EventEmitter<string> = new EventEmitter<string>();

  public selectedApplications: Application[] = [];
  private applications = new BehaviorSubject<Application[]>([]);
  public applications$!: Observable<Application[]>;
  private cachedApplications: Application[] = [];
  private applicationsQuery!: QueryRef<GetApplicationsQueryResponse>;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  private loading = true;

  @ViewChild('applicationSelect') applicationSelect?: MatSelect;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param apollo This is the Apollo service that we'll use to make our GraphQL
   * queries.
   */
  constructor(private apollo: Apollo) {
    super();
  }

  ngOnInit(): void {
    if (Array.isArray(this.value) && this.value.length > 0) {
      this.apollo
        .query<GetApplicationsQueryResponse>({
          query: GET_APPLICATIONS,
          variables: {
            filter: {
              logic: 'and',
              filters: [{ field: 'ids', operator: 'in', value: this.value }],
              // ids: this.value
            },
          },
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          this.selectedApplications = data.applications.edges.map(
            (x) => x.node
          );
        });
    }

    this.applicationsQuery =
      this.apollo.watchQuery<GetApplicationsQueryResponse>({
        query: GET_APPLICATIONS,
        variables: {
          first: ITEMS_PER_PAGE,
          sortField: 'name',
          sortOrder: 'asc',
        },
      });

    this.applications$ = this.applications.asObservable();
    this.applicationsQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data, loading }) => {
        this.updateValues(data, loading);
      });
  }

  /**
   * Emits the selected resource id.
   *
   * @param e select event.
   */
  onSelect(e: any): void {
    this.choice.emit(e.value);
  }

  /**
   * Adds scroll listener to select.
   *
   * @param e open select event.
   */
  onOpenSelect(e: any): void {
    if (e && this.applicationSelect) {
      const panel = this.applicationSelect.panel.nativeElement;
      panel.addEventListener('scroll', (event: any) =>
        this.loadOnScroll(event)
      );
    }
  }

  /**
   * Fetches more resources on scroll.
   *
   * @param e scroll event.
   */
  private loadOnScroll(e: any): void {
    if (
      e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop) <
      50
    ) {
      if (!this.loading && this.pageInfo.hasNextPage) {
        this.loading = true;
        this.applicationsQuery
          .fetchMore({
            variables: {
              first: ITEMS_PER_PAGE,
              afterCursor: this.pageInfo.endCursor,
            },
          })
          .then((results) => this.updateValues(results.data, results.loading));
      }
    }
  }

  private updateValues(data: GetApplicationsQueryResponse, loading: boolean) {
    this.cachedApplications = updateQueryUniqueValues(
      this.cachedApplications,
      data.applications.edges.map((x) => x.node)
    );
    this.applications.next(this.cachedApplications);
    if (this.selectedApplications.length > 0) {
      const applicationsIds = this.applications.getValue().map((x) => x.id);
      this.selectedApplications = this.selectedApplications.filter(
        (x) => applicationsIds.indexOf(x.id) < 0
      );
    }
    this.pageInfo = data.applications.pageInfo;
    this.loading = loading;
  }
}
