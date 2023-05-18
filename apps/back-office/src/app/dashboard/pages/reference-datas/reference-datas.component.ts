import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
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
import { TableSort } from '@oort-front/ui';

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
  implements OnInit
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
  sort?: TableSort;

  // === FILTERS ===
  public searchText = '';

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
   * Frontend filtering.
   */
  private filterPredicate(): void {
    this.dataSource.filterPredicate = (data: any) =>
      this.searchText.trim().length === 0 ||
      (this.searchText.trim().length > 0 &&
        data.name.toLowerCase().includes(this.searchText.trim()));
  }

  /**
   * Applies the filter to the data source.
   *
   * @param column Column to filter on.
   * @param event Value of the filter.
   */
  applyFilter(column: string, event: any): void {
    this.searchText = event
      ? event.target.value.trim().toLowerCase()
      : this.searchText;
    this.dataSource.filter = '##';
  }

  /**
   * Removes all the filters.
   */
  clearAllFilters(): void {
    this.searchText = '';
    this.applyFilter('', null);
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
   * Handle sort change.
   *
   * @param event sort event
   */
  onSort(event: TableSort): void {
    this.sort = event;
    if (this.sort.sortDirection !== '') {
      this.dataSource.data = this.dataSource.data.sort((row1, row2) => {
        return this.compare(row1, row2);
      });
    }
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
    this.filterPredicate();
  }

  /**
   * Compares two rows of API configuration table and give a compare value in order to sort them
   *
   * @param row1 row 1
   * @param row2 row 2
   * @returns the compare value
   */
  compare(row1: ReferenceData, row2: ReferenceData): number {
    //Initializes compare value
    let compareValue = 0;
    //If the sort is on Name, compare names
    if (this.sort?.active === 'name') {
      const row1Value = row1.name;
      const row2Value = row2.name;
      if (typeof row1Value === 'string') {
        compareValue = (row1Value as string).localeCompare(row2Value as string);
      } else {
        if (row1Value !== undefined && row2Value !== undefined) {
          compareValue = Number((row1Value as string) > row2Value);
        }
      }
      if (this.sort?.sortDirection === 'asc') {
        return compareValue;
      } else if (this.sort?.sortDirection === 'desc') {
        return compareValue === 1 ? -1 : 1;
      }
      return compareValue;
    }
    //If the sort is on type, compare type
    else if (this.sort?.active === 'type') {
      const row1Value = row1.type;
      const row2Value = row2.type;
      if (row1Value !== null && row1Value !== undefined) {
        if (row2Value !== null) {
          compareValue = (row1Value as string).localeCompare(
            row2Value as string
          );
        } else {
          return -1;
        }
      } else {
        return 1;
      }
      if (compareValue !== undefined) {
        if (this.sort?.sortDirection === 'asc') {
          return compareValue as number;
        } else if (this.sort?.sortDirection === 'desc') {
          return compareValue === 1 ? -1 : 1;
        }
        return compareValue as number;
      } else {
        return compareValue;
      }
    }
    //If the sort is on Modified on, compare Modified On
    else if (this.sort?.active === 'modifiedAt') {
      const row1Value = row1.modifiedAt;
      const row2Value = row2.modifiedAt;
      compareValue = (row1Value as string).localeCompare(row2Value as string);
      if (compareValue !== undefined) {
        if (this.sort?.sortDirection === 'asc') {
          return compareValue as number;
        } else if (this.sort?.sortDirection === 'desc') {
          return compareValue === 1 ? -1 : 1;
        }
        return compareValue as number;
      } else {
        return compareValue;
      }
    }
    //If the sort is on api configuration, compare api configurations
    else if (this.sort?.active === 'apiConfiguration') {
      const row1Value = row1.apiConfiguration?.name;
      const row2Value = row2.apiConfiguration?.name;
      if (row1Value !== null && row1Value !== undefined) {
        if (row2Value !== null) {
          compareValue = (row1Value as string).localeCompare(
            row2Value as string
          );
        } else {
          return -1;
        }
      } else {
        return 1;
      }
      if (compareValue !== undefined) {
        if (this.sort?.sortDirection === 'asc') {
          return compareValue as number;
        } else if (this.sort?.sortDirection === 'desc') {
          return compareValue === 1 ? -1 : 1;
        }
        return compareValue as number;
      } else {
        return compareValue;
      }
    }
    //Else, it returns 0 so no change is made to the list
    else {
      return compareValue;
    }
  }
}
