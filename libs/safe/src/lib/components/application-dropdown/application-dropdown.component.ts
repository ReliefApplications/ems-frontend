import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Application } from '../../models/application.model';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  GetApplicationsQueryResponse,
  GET_APPLICATIONS,
} from './graphql/queries';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { updateQueryUniqueValues } from '../../utils/update-queries';
import { DOCUMENT } from '@angular/common';

/**
 * A constant that is used to set the number of items to be displayed on the page.
 */
const ITEMS_PER_PAGE = 10;

/**
 * This is a component used to show a dropdown form where the user can choose an application
 */
@Component({
  selector: 'safe-application-dropdown',
  templateUrl: './application-dropdown.component.html',
  styleUrls: ['./application-dropdown.component.scss'],
})
export class SafeApplicationDropdownComponent
  extends SafeUnsubscribeComponent
  implements OnInit, OnDestroy
{
  @Input() value = [];
  @Output() choice: EventEmitter<string> = new EventEmitter<string>();

  public selectedApplications: Application[] = [];
  private applications = new BehaviorSubject<Application[]>([]);
  public applications$!: Observable<Application[]>;
  private cachedApplications: Application[] = [];
  private applicationsQuery!: QueryRef<GetApplicationsQueryResponse>;
  private scrollListener!: any;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  private loading = true;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param apollo This is the Apollo service that we'll use to make our GraphQL
   * queries.
   * @param document Document
   * @param renderer Renderer2
   */
  constructor(
    private apollo: Apollo,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
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
    this.choice.emit(e);
  }

  /**
   * Adds scroll listener to select.
   *
   */
  onOpenSelect(): void {
    const panel = this.document.getElementById('optionList');
    if (panel) {
      if (this.scrollListener) {
        this.scrollListener();
      }
      this.scrollListener = this.renderer.listen(
        panel,
        'scroll',
        (event: any) => this.loadOnScroll(event)
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
      if (!this.loading && this.pageInfo?.hasNextPage) {
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

  /**
   * Update application data value
   *
   * @param data query response data
   * @param loading loading status
   */
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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.scrollListener) {
      this.scrollListener();
    }
  }
}
