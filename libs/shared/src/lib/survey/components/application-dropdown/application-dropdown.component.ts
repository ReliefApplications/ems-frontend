import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  Application,
  ApplicationsApplicationNodesQueryResponse,
} from '../../../models/application.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GET_APPLICATIONS } from './graphql/queries';
import { takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { QuestionAngular } from 'survey-angular-ui';
import { QuestionOwnerApplicationsDropdownModel } from './application-dropdown.model';
import { updateQueryUniqueValues } from '../../../utils/update-queries';
import { SelectMenuComponent } from '@oort-front/ui';

/**
 * A constant that is used to set the number of items to be displayed on the page.
 */
const ITEMS_PER_PAGE = 10;

/**
 * This is a component used to show a dropdown form where the user can choose an application
 */
@Component({
  selector: 'shared-application-dropdown',
  templateUrl: './application-dropdown.component.html',
  styleUrls: ['./application-dropdown.component.scss'],
})
export class ApplicationDropdownComponent
  extends QuestionAngular<QuestionOwnerApplicationsDropdownModel>
  implements OnInit, OnDestroy
{
  public selectedApplications: Application[] = [];
  public applications$!: Observable<Application[]>;
  private applications = new BehaviorSubject<Application[]>([]);
  private cachedApplications: Application[] = [];
  private applicationsQuery!: QueryRef<ApplicationsApplicationNodesQueryResponse>;
  private scrollListener!: any;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  private loading = true;
  private destroy$: Subject<void> = new Subject<void>();

  @ViewChild(SelectMenuComponent, { static: true })
  selectMenu!: SelectMenuComponent;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param {Document} document Current document object of the client
   * @param {ChangeDetectorRef} changeDetectorRef - Angular - This is angular change detector ref of the component instance needed for the survey AngularQuestion class
   * @param {ViewContainerRef} viewContainerRef - Angular - This is angular view container ref of the component instance needed for the survey AngularQuestion class
   * @param {Renderer2} renderer - Angular - Renderer2 utilities
   * @param {Apollo} apollo - Apollo - This is the Apollo service that we'll use to make our GraphQL queries.
   */
  constructor(
    @Inject(DOCUMENT) private document: Document,
    changeDetectorRef: ChangeDetectorRef,
    viewContainerRef: ViewContainerRef,
    private renderer: Renderer2,
    private apollo: Apollo
  ) {
    super(changeDetectorRef, viewContainerRef);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    // Listen to select menu UI event in order to update UI
    this.selectMenu.triggerUIChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasChanged: boolean) => {
        if (hasChanged) {
          this.detectChangesUI();
        }
      });
    if (
      Array.isArray(this.model.obj.applications) &&
      this.model.obj.applications.length > 0
    ) {
      this.apollo
        .query<ApplicationsApplicationNodesQueryResponse>({
          query: GET_APPLICATIONS,
          variables: {
            filter: {
              logic: 'and',
              filters: [
                {
                  field: 'ids',
                  operator: 'in',
                  value: this.model.obj.applications,
                },
              ],
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
      this.apollo.watchQuery<ApplicationsApplicationNodesQueryResponse>({
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
  private updateValues(
    data: ApplicationsApplicationNodesQueryResponse,
    loading: boolean
  ) {
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
    this.detectChangesUI();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
    if (this.scrollListener) {
      this.scrollListener();
    }
  }

  /**
   * Trigger change detection manually for survey property grid editor questions
   */
  detectChangesUI(): void {
    this.changeDetectorRef.detectChanges();
  }
}
