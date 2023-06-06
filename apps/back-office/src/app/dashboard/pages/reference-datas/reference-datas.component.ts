import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  ReferenceData,
  SafeAuthService,
  SafeConfirmService,
  SafeSnackBarService,
  SafeUnsubscribeComponent,
} from '@oort-front/safe';
import {
  GetReferenceDatasQueryResponse,
  GET_REFERENCE_DATAS,
} from './graphql/queries';
import {
  AddReferenceDataMutationResponse,
  ADD_REFERENCE_DATA,
  DeleteReferenceDataMutationResponse,
  DELETE_REFERENCE_DATA,
} from './graphql/mutations';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../../../utils/update-queries';
import { ApolloQueryResult } from '@apollo/client';

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
  extends SafeUnsubscribeComponent
  implements OnInit, AfterViewInit
{
  // === DATA ===
  public loading = true;
  private referenceDatasQuery!: QueryRef<GetReferenceDatasQueryResponse>;
  displayedColumns = [
    'name',
    'type',
    'apiConfiguration',
    'modifiedAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<ReferenceData>([]);
  public cachedReferenceDatas: ReferenceData[] = [];

  // === SORTING ===
  @ViewChild(MatSort) sort?: MatSort;

  // === FILTERS ===
  public searchText = '';
  public filter: any;
  public filterLoading = false;

  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: '',
  };

  /**
   * List of Reference data page.
   *
   * @param apollo Apollo service
   * @param dialog Material dialog service
   * @param snackBar Shared snackbar service
   * @param authService Shared authentication service
   * @param confirmService Shared confirm service
   * @param router Angular router
   * @param translate Angular translation service
   */
  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    private confirmService: SafeConfirmService,
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
      this.apollo.watchQuery<GetReferenceDatasQueryResponse>({
        query: GET_REFERENCE_DATAS,
        variables: {
          first: ITEMS_PER_PAGE,
          afterCursor: this.pageInfo.endCursor,
        },
      });

    this.referenceDatasQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data, loading }) => {
        this.updateValues(data, loading);
      });
  }

  /**
   * Handles page event.
   *
   * @param e page event.
   */
  onPage(e: any): void {
    this.pageInfo.pageIndex = e.pageIndex;
    // Checks if with new page/size more data needs to be fetched
    if (
      ((e.pageIndex > e.previousPageIndex &&
        e.pageIndex * this.pageInfo.pageSize >=
          this.cachedReferenceDatas.length) ||
        e.pageSize > this.pageInfo.pageSize) &&
      e.length > this.cachedReferenceDatas.length
    ) {
      // Sets the new fetch quantity of data needed as the page size
      // If the fetch is for a new page the page size is used
      let neededSize = e.pageSize;
      // If the fetch is for a new page size, the old page size is substracted from the new one
      if (e.pageSize > this.pageInfo.pageSize) {
        neededSize -= this.pageInfo.pageSize;
      }
      this.loading = true;
      const variables = {
        first: neededSize,
        afterCursor: this.pageInfo.endCursor,
      };
      const cachedValues: GetReferenceDatasQueryResponse = getCachedValues(
        this.apollo.client,
        GET_REFERENCE_DATAS,
        variables
      );
      if (cachedValues) {
        this.updateValues(cachedValues, false);
      } else {
        this.referenceDatasQuery
          .fetchMore({ variables })
          .then((results) => this.updateValues(results.data, results.loading));
      }
    } else {
      this.dataSource.data = this.cachedReferenceDatas.slice(
        e.pageSize * this.pageInfo.pageIndex,
        e.pageSize * (this.pageInfo.pageIndex + 1)
      );
    }
    this.pageInfo.pageSize = e.pageSize;
  }

  /**
   * Filter data query
   *
   * @param filter Filter to apply
   */
  onFilter(filter: any) {
    this.filterLoading = true;
    this.cachedReferenceDatas = [];
    this.pageInfo.pageIndex = 0;
    this.filter = filter;
    this.referenceDatasQuery
      .fetchMore({
        variables: {
          first: this.pageInfo.pageSize,
          filter: this.filter,
        },
      })
      .then((results: ApolloQueryResult<GetReferenceDatasQueryResponse>) => {
        this.updateValues(results.data, false);
      });
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
    dialogRef.afterClosed().subscribe((value) => {
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
      confirmColor: 'warn',
    });
    dialogRef.afterClosed().subscribe((value) => {
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
                this.dataSource.data = this.dataSource.data.filter(
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
   * Sets the sort in the view.
   */
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort || null;
  }

  /**
   * Update ref data value
   *
   * @param data query response data
   * @param loading loading status
   */
  private updateValues(data: GetReferenceDatasQueryResponse, loading: boolean) {
    this.cachedReferenceDatas = updateQueryUniqueValues(
      this.cachedReferenceDatas,
      data.referenceDatas.edges.map((x) => x.node)
    );
    this.dataSource.data = this.cachedReferenceDatas.slice(
      this.pageInfo.pageSize * this.pageInfo.pageIndex,
      this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
    );
    this.pageInfo.length = data.referenceDatas.totalCount;
    this.pageInfo.endCursor = data.referenceDatas.pageInfo.endCursor;
    this.loading = loading;
    this.filterLoading = false;
  }
}
