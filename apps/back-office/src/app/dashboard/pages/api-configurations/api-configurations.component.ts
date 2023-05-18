import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  ApiConfiguration,
  SafeConfirmService,
  SafeSnackBarService,
  SafeUnsubscribeComponent,
} from '@oort-front/safe';
import {
  GetApiConfigurationsQueryResponse,
  GET_API_CONFIGURATIONS,
} from './graphql/queries';
import {
  AddApiConfigurationMutationResponse,
  ADD_API_CONFIGURATIION,
  DeleteApiConfigurationMutationResponse,
  DELETE_API_CONFIGURATION,
} from './graphql/mutations';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../../../utils/update-queries';
import { ApolloQueryResult } from '@apollo/client';
import { TableSort } from '@oort-front/ui';

/** Default items per page for pagination. */
const ITEMS_PER_PAGE = 10;

/**
 * API configurations page component.
 */
@Component({
  selector: 'app-api-configurations',
  templateUrl: './api-configurations.component.html',
  styleUrls: ['./api-configurations.component.scss'],
})
export class ApiConfigurationsComponent
  extends SafeUnsubscribeComponent
  implements OnInit, AfterViewInit
{
  // === DATA ===
  public loading = true;
  private apiConfigurationsQuery!: QueryRef<GetApiConfigurationsQueryResponse>;
  displayedColumns = ['name', 'status', 'authType', 'actions'];
  dataSource = new MatTableDataSource<ApiConfiguration>([]);
  public cachedApiConfigurations: ApiConfiguration[] = [];

  // === SORTING ===
  sort?: TableSort;

  // === FILTERS ===
  public showFilters = false;
  public searchText = '';
  public statusFilter = '';

  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: '',
  };

  /**
   * API configurations page component
   *
   * @param apollo Apollo service
   * @param dialog Material dialog service
   * @param snackBar Shared snackbar service
   * @param confirmService Shared confirm service
   * @param router Angular router
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private confirmService: SafeConfirmService,
    private router: Router,
    private translate: TranslateService
  ) {
    super();
  }

  /**
   * Creates the API configuration query, and subscribes to the query changes.
   */
  ngOnInit(): void {
    this.apiConfigurationsQuery =
      this.apollo.watchQuery<GetApiConfigurationsQueryResponse>({
        query: GET_API_CONFIGURATIONS,
        variables: {
          first: ITEMS_PER_PAGE,
          afterCursor: this.pageInfo.endCursor,
        },
      });

    this.apiConfigurationsQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((results) => {
        this.updateValues(results.data, results.loading);
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
          this.cachedApiConfigurations.length) ||
        e.pageSize > this.pageInfo.pageSize) &&
      e.length > this.cachedApiConfigurations.length
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
      const cachedValues: GetApiConfigurationsQueryResponse = getCachedValues(
        this.apollo.client,
        GET_API_CONFIGURATIONS,
        variables
      );
      if (cachedValues) {
        this.updateValues(cachedValues, false);
      } else {
        this.apiConfigurationsQuery
          .fetchMore({ variables })
          .then(
            (results: ApolloQueryResult<GetApiConfigurationsQueryResponse>) => {
              this.updateValues(results.data, results.loading);
            }
          );
      }
    } else {
      this.dataSource.data = this.cachedApiConfigurations.slice(
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
      (this.searchText.trim().length === 0 ||
        (this.searchText.trim().length > 0 &&
          data.name.toLowerCase().includes(this.searchText.trim()))) &&
      (this.statusFilter.trim().length === 0 ||
        (this.statusFilter.trim().length > 0 &&
          data.status.toLowerCase().includes(this.statusFilter.trim())));
  }

  /**
   * Applies the filter to the data source.
   *
   * @param column Column to filter on.
   * @param event Value of the filter.
   */
  applyFilter(column: string, event: any): void {
    if (column === 'status') {
      this.statusFilter = event.value ? event.value.trim().toLowerCase() : '';
    } else {
      this.searchText = event
        ? event.target.value.trim().toLowerCase()
        : this.searchText;
    }
    this.dataSource.filter = '##';
  }

  /**
   * Removes all the filters.
   */
  clearAllFilters(): void {
    this.searchText = '';
    this.statusFilter = '';
    this.applyFilter('', null);
  }

  /**
   * Displays the AddApiConfiguration modal.
   * Creates a new apiConfiguration on closed if result.
   */
  async onAdd(): Promise<void> {
    const { AddApiConfigurationComponent } = await import(
      './components/add-api-configuration/add-api-configuration.component'
    );
    const dialogRef = this.dialog.open(AddApiConfigurationComponent);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.apollo
          .mutate<AddApiConfigurationMutationResponse>({
            mutation: ADD_API_CONFIGURATIION,
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
                        .instant('common.apiConfiguration.one')
                        .toLowerCase(),
                      error: errors ? errors[0].message : '',
                    }
                  ),
                  { error: true }
                );
              } else {
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectCreated', {
                    type: this.translate
                      .instant('common.apiConfiguration.one')
                      .toLowerCase(),
                    value: data?.addApiConfiguration.name,
                  })
                );
                if (data) {
                  this.router.navigate([
                    '/settings/apiconfigurations',
                    data.addApiConfiguration.id,
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
   * Removes an apiConfiguration if authorized.
   *
   * @param element API config to delete.
   * @param e click event.
   */
  onDelete(element: any, e: any): void {
    e.stopPropagation();
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('components.apiConfiguration.delete.title'),
      content: this.translate.instant(
        'components.apiConfiguration.delete.confirmationMessage',
        {
          name: element.name,
        }
      ),
      confirmText: this.translate.instant('components.confirmModal.delete'),
      confirmColor: 'warn',
    });
    dialogRef.afterClosed().subscribe((value: any) => {
      if (value) {
        this.apollo
          .mutate<DeleteApiConfigurationMutationResponse>({
            mutation: DELETE_API_CONFIGURATION,
            variables: {
              id: element.id,
            },
          })
          .subscribe({
            next: (res) => {
              if (res && !res.errors) {
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectDeleted', {
                    value: this.translate.instant(
                      'common.apiConfiguration.one'
                    ),
                  })
                );
                this.dataSource.data = this.dataSource.data.filter(
                  (x) => x.id !== element.id
                );
              } else {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'common.notifications.objectNotDeleted',
                    {
                      value: this.translate.instant(
                        'common.apiConfiguration.one'
                      ),
                      error: res.errors ? res.errors[0].message : '',
                    }
                  ),
                  { error: true }
                );
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
   * Updates local list with given data
   *
   * @param data New values to update forms
   * @param loading Loading state
   */
  private updateValues(
    data: GetApiConfigurationsQueryResponse,
    loading: boolean
  ): void {
    this.cachedApiConfigurations = updateQueryUniqueValues(
      this.cachedApiConfigurations,
      data.apiConfigurations.edges.map((x) => x.node)
    );
    this.dataSource.data = this.cachedApiConfigurations.slice(
      this.pageInfo.pageSize * this.pageInfo.pageIndex,
      this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
    );
    console.log('source date update values :');
    console.log(this.dataSource.data);
    this.pageInfo.length = data.apiConfigurations.totalCount;
    this.pageInfo.endCursor = data.apiConfigurations.pageInfo.endCursor;
    this.loading = loading;
    this.filterPredicate();
  }
  /**
   * Sets the sort in the view.
   */
  ngAfterViewInit(): void {
    // this.dataSource.sort.direction = (TableHeaderSortDirective)this.sort?.sortDirection;
    console.log('Sort not working cause no equivalent for MatTableDataSource');
  }

  /**
   * Handle sort change.
   *
   * @param event sort event
   */
  onSort(event: TableSort): void {
    this.sort = event;
    // this.fetchAPIConfigurations(true);
    if (this.sort.sortDirection !== '') {
      this.dataSource.data = this.dataSource.data.sort((row1, row2) => {
        let compareValue = 0;
        if (this.sort?.active === 'name') {
          const row1Value = row1.name;
          const row2Value = row2.name;
          if (typeof row1Value === 'string') {
            compareValue = (row1Value as string).localeCompare(
              row2Value as string
            );
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
        } else if (this.sort?.active === 'status') {
          const row1Value = row1.status;
          const row2Value = row2.status;
          compareValue = (row1Value as string).localeCompare(
            row2Value as string
          );
          if (compareValue !== undefined) {
            if (this.sort?.sortDirection === 'asc') {
              return compareValue as number;
            } else if (this.sort?.sortDirection === 'desc') {
              return compareValue === 1 ? -1 : (1 as number);
            }
            return compareValue as number;
          } else {
            return compareValue;
          }
        } else if (this.sort?.active === 'authType') {
          const row1Value = row1.authType;
          const row2Value = row2.authType;
          compareValue = (row1Value as string).localeCompare(
            row2Value as string
          );
          if (compareValue !== undefined) {
            if (this.sort?.sortDirection === 'asc') {
              return compareValue as number;
            } else if (this.sort?.sortDirection === 'desc') {
              return compareValue === 1 ? -1 : (1 as number);
            }
            return compareValue as number;
          } else {
            return compareValue;
          }
        } else {
          return compareValue;
        }
      });
    }
  }

  // /**
  //  * Update forms query.
  //  *
  //  * @param refetch erase previous query results
  //  */
  // private fetchAPIConfigurations(refetch?: boolean): void {
  //   console.log('I was there');

  //   const variables = {
  //     first: this.pageInfo.pageSize,
  //     afterCursor: refetch ? null : this.pageInfo.endCursor,
  //     sortField:
  //       (this.sort?.sortDirection && this.sort.active) !== ''
  //         ? this.sort?.sortDirection && this.sort.active
  //         : 'name',
  //     sortOrder: this.sort?.sortDirection,
  //   };

  //   console.log(variables.sortField);
  //   console.log(variables.sortOrder);

  //   const cachedValues: GetApiConfigurationsQueryResponse = getCachedValues(
  //     this.apollo.client,
  //     GET_API_CONFIGURATIONS,
  //     variables
  //   );
  //   console.log(cachedValues);
  //   if (refetch) {
  //     this.cachedApiConfigurations = [];
  //     this.pageInfo.pageIndex = 0;
  //     console.log('A');
  //   }
  //   if (cachedValues) {
  //     this.updateValues(cachedValues, false);
  //     console.log('B');
  //   } else {
  //     if (refetch) {
  //       this.apiConfigurationsQuery.refetch(variables);
  //       console.log('D');
  //     } else {
  //       console.log('E');
  //       this.apiConfigurationsQuery
  //         .fetchMore({
  //           variables,
  //         })
  //         .then(
  //           (results: ApolloQueryResult<GetApiConfigurationsQueryResponse>) => {
  //             console.log('F');
  //             this.updateValues(results.data, results.loading);
  //           }
  //         );
  //     }
  //   }
  // }
}
