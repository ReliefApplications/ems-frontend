import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  AddReferenceDataMutationResponse,
  DeleteReferenceDataMutationResponse,
  ReferenceData,
  ConfirmService,
  UnsubscribeComponent,
  ReferenceDatasQueryResponse,
  getCachedValues,
  updateQueryUniqueValues,
} from '@oort-front/shared';
import { GET_REFERENCE_DATAS } from './graphql/queries';
import { ADD_REFERENCE_DATA, DELETE_REFERENCE_DATA } from './graphql/mutations';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Dialog } from '@angular/cdk/dialog';
import {
  TableSort,
  UIPageChangeEvent,
  handleTablePageEvent,
} from '@oort-front/ui';
import { ApolloQueryResult } from '@apollo/client';
import { SnackbarService } from '@oort-front/ui';

/** Default pagination settings. */
const ITEMS_PER_PAGE = 10;

/**
 * List of Reference data page.
 */
@Component({
  selector: 'app-reference-datas',
  templateUrl: './reference-datas.component.html',
  styleUrls: ['./reference-datas.component.scss'],
})
export class ReferenceDatasComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Loading status */
  public loading = true;
  /** Updating status */
  public updating = false;
  /** Available columns */
  public displayedColumns = [
    'name',
    'type',
    'apiConfiguration',
    'modifiedAt',
    'actions',
  ];
  /** Table data */
  public dataSource = new Array<ReferenceData>();
  /** Cached table data */
  public cachedReferenceDatas: ReferenceData[] = [];
  /** Query filters */
  public filter: any = {
    filters: [],
    logic: 'and',
  };
  /** Pagination info */
  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: '',
  };
  /** Reference data apollo query */
  private referenceDatasQuery!: QueryRef<ReferenceDatasQueryResponse>;
  /** Table sorting */
  private sort!: TableSort;

  /**
   * List of Reference data page.
   *
   * @param apollo Apollo service
   * @param dialog Dialog service
   * @param snackBar Shared snackbar service
   * @param confirmService Shared confirm service
   * @param router Angular router
   * @param translate Angular translation service
   */
  constructor(
    private apollo: Apollo,
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private confirmService: ConfirmService,
    private router: Router,
    private translate: TranslateService
  ) {
    super();
  }

  /**
   * Creates the Reference data query, and subscribes to the query changes.
   */
  ngOnInit(): void {
    this.referenceDatasQuery =
      this.apollo.watchQuery<ReferenceDatasQueryResponse>({
        query: GET_REFERENCE_DATAS,
        variables: {
          first: ITEMS_PER_PAGE,
          afterCursor: this.pageInfo.endCursor,
          filter: this.filter,
          sortField: this.sort?.sortDirection && this.sort.active,
          sortOrder: this.sort?.sortDirection,
        },
      });

    this.referenceDatasQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data, loading }) => {
        this.updateValues(data, loading);
      });

    // Initializing sort to an empty one
    this.sort = {
      active: '',
      sortDirection: '',
    };
  }

  /**
   * Handles page event.
   *
   * @param e page event.
   */
  onPage(e: UIPageChangeEvent): void {
    const cachedData = handleTablePageEvent(
      e,
      this.pageInfo,
      this.cachedReferenceDatas
    );
    if (cachedData && cachedData.length === this.pageInfo.pageSize) {
      this.dataSource = cachedData;
    } else {
      this.fetchReferenceDatas();
    }
  }

  /**
   * Filter data query
   *
   * @param filter Filter to apply
   */
  onFilter(filter: any) {
    this.filter = filter;
    this.fetchReferenceDatas(true);
  }

  /**
   * Displays the AddReferenceData modal.
   * Creates a new reference data on closed if result.
   */
  async onAdd(): Promise<void> {
    const { AddReferenceDataComponent } = await import(
      './add-reference-data/add-reference-data.component'
    );
    const dialogRef = this.dialog.open(AddReferenceDataComponent);
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.apollo
          .mutate<AddReferenceDataMutationResponse>({
            mutation: ADD_REFERENCE_DATA,
            variables: {
              name: value.name,
            },
          })
          .subscribe({
            next: ({ errors, data }) => {
              if (errors) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'common.notifications.objectNotCreated',
                    {
                      type: this.translate
                        .instant('common.referenceData.one')
                        .toLowerCase(),
                      error: errors ? errors[0].message : '',
                    }
                  ),
                  { error: true }
                );
              } else {
                if (data) {
                  this.router.navigate([
                    '/referencedata',
                    data.addReferenceData.id,
                  ]);
                }
              }
            },
            error: (err) => {
              this.snackBar.openSnackBar(err.message, { error: true });
            },
          });
      }
    });
  }

  /**
   * Removes a reference data if authorized.
   *
   * @param element Reference data to delete.
   * @param e click event.
   */
  onDelete(element: any, e: any): void {
    e.stopPropagation();
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('components.referenceData.delete.title'),
      content: this.translate.instant(
        'components.referenceData.delete.confirmationMessage',
        {
          name: element.name,
        }
      ),
      confirmText: this.translate.instant('common.delete'),
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.apollo
          .mutate<DeleteReferenceDataMutationResponse>({
            mutation: DELETE_REFERENCE_DATA,
            variables: {
              id: element.id,
            },
          })
          .subscribe({
            next: (res) => {
              if (res && !res.errors) {
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectDeleted', {
                    value: this.translate.instant('common.referenceData.one'),
                  })
                );
                this.dataSource = this.dataSource.filter(
                  (x) => x.id !== element.id
                );
              } else {
                if (res.errors) {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'common.notifications.objectNotDeleted',
                      {
                        value: this.translate.instant(
                          'common.referenceData.one'
                        ),
                        error: res.errors ? res.errors[0] : '',
                      }
                    ),
                    { error: true }
                  );
                }
              }
            },
            error: (err) => {
              this.snackBar.openSnackBar(err.message, { error: true });
            },
          });
      }
    });
  }

  /**
   * Handle sort change.
   *
   * @param event sort event
   */
  onSort(event: TableSort): void {
    this.sort = event;
    this.fetchReferenceDatas(true);
  }

  /**
   * Update ref data value
   *
   * @param data query response data
   * @param loading loading status
   */
  private updateValues(data: ReferenceDatasQueryResponse, loading: boolean) {
    const mappedValues = data.referenceDatas.edges.map((x) => x.node);
    this.cachedReferenceDatas = updateQueryUniqueValues(
      this.cachedReferenceDatas,
      mappedValues
    );
    this.pageInfo.length = data.referenceDatas.totalCount;
    this.pageInfo.endCursor = data.referenceDatas.pageInfo.endCursor;
    this.dataSource = this.cachedReferenceDatas.slice(
      this.pageInfo.pageSize * this.pageInfo.pageIndex,
      this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
    );
    this.loading = loading;
    this.updating = false;
  }

  /**
   * Update reference datas query.
   *
   * @param refetch erase previous query results
   */
  private fetchReferenceDatas(refetch?: boolean): void {
    this.updating = true;
    const variables = {
      first: this.pageInfo.pageSize,
      afterCursor: refetch ? null : this.pageInfo.endCursor,
      filter: this.filter,
      sortField: this.sort?.sortDirection && this.sort.active,
      sortOrder: this.sort?.sortDirection,
    };
    const cachedValues: ReferenceDatasQueryResponse = getCachedValues(
      this.apollo.client,
      GET_REFERENCE_DATAS,
      variables
    );
    if (refetch) {
      this.cachedReferenceDatas = [];
      this.pageInfo.pageIndex = 0;
    }
    if (cachedValues) {
      this.updateValues(cachedValues, false);
    } else {
      if (refetch) {
        // Rebuild the query
        this.referenceDatasQuery.refetch(variables);
      } else {
        // Fetch more records
        this.referenceDatasQuery
          .fetchMore({
            variables,
          })
          .then((results: ApolloQueryResult<ReferenceDatasQueryResponse>) => {
            this.updateValues(results.data, results.loading);
          });
      }
    }
  }
}
