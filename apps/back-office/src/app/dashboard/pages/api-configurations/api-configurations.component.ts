import { Component, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  ApiConfiguration,
  SafeConfirmService,
  SafeUnsubscribeComponent,
} from '@oort-front/safe';
import {
  GetApiConfigurationsQueryResponse,
  GET_API_CONFIGURATIONS,
} from './graphql/queries';
import {
  AddApiConfigurationMutationResponse,
  ADD_API_CONFIGURATION,
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
import { TableSort, UIPageChangeEvent } from '@oort-front/ui';
import { SnackbarService } from '@oort-front/ui';

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
  implements OnInit
{
  // === DATA ===
  public loading = true;
  private apiConfigurationsQuery!: QueryRef<GetApiConfigurationsQueryResponse>;
  displayedColumns = ['name', 'status', 'authType', 'actions'];
  dataSource = new Array<ApiConfiguration>();
  filteredDataSources = new Array<ApiConfiguration>();
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
   * @param dialog Dialog service
   * @param snackBar Shared snackbar service
   * @param confirmService Shared confirm service
   * @param router Angular router
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private confirmService: SafeConfirmService,
    private router: Router,
    private translate: TranslateService // private uiTableWrapper: TableWrapperDirective
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
    this.pageInfo.pageIndex = e.pageIndex;
    // Checks if with new page/size more data needs to be fetched
    if (
      ((e.pageIndex > e.previousPageIndex &&
        e.pageIndex * this.pageInfo.pageSize >=
          this.cachedApiConfigurations.length) ||
        e.pageSize > this.pageInfo.pageSize) &&
      e.totalItems > this.cachedApiConfigurations.length
    ) {
      // Sets the new fetch quantity of data needed as the page size
      // If the fetch is for a new page the page size is used
      let first = e.pageSize;
      // If the fetch is for a new page size, the old page size is subtracted from the new one
      if (e.pageSize > this.pageInfo.pageSize) {
        first -= this.pageInfo.pageSize;
      }
      this.pageInfo.pageSize = first;
      this.fetchApiConfigurations();
    } else {
      this.dataSource = this.cachedApiConfigurations.slice(
        e.pageSize * this.pageInfo.pageIndex,
        e.pageSize * (this.pageInfo.pageIndex + 1)
      );
      this.filteredDataSources = this.dataSource;
    }
    this.pageInfo.pageSize = e.pageSize;
  }

  /**
   * Frontend filtering.
   */
  private filterPredicate(): void {
    this.filteredDataSources = this.dataSource.filter(
      (data: any) =>
        (this.searchText.trim().length === 0 ||
          (this.searchText.trim().length > 0 &&
            data.name.toLowerCase().includes(this.searchText.trim()))) &&
        (this.statusFilter.trim().length === 0 ||
          (this.statusFilter.trim().length > 0 &&
            data.status.toLowerCase().includes(this.statusFilter.trim())))
    );
  }

  /**
   * Applies the filter to the data source.
   *
   * @param column Column to filter on.
   * @param event Value of the filter.
   */
  applyFilter(column: string, event: any): void {
    if (column === 'status') {
      this.statusFilter = event ?? '';
    } else {
      this.searchText = event
        ? event.target.value.trim().toLowerCase()
        : this.searchText;
    }
    this.filterPredicate();
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
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.apollo
          .mutate<AddApiConfigurationMutationResponse>({
            mutation: ADD_API_CONFIGURATION,
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
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
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
                this.dataSource = this.dataSource.filter(
                  (x) => x.id !== element.id
                );
                this.filteredDataSources = this.dataSource;
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
    const mappedValues = data.apiConfigurations.edges.map((x) => x.node);
    this.cachedApiConfigurations = updateQueryUniqueValues(
      this.cachedApiConfigurations,
      mappedValues
    );
    // then slice the array to correctly match the items in the current page
    this.dataSource = this.cachedApiConfigurations.slice(
      this.pageInfo.pageSize * this.pageInfo.pageIndex,
      this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
    );
    this.pageInfo.length = data.apiConfigurations.totalCount;
    this.pageInfo.endCursor = data.apiConfigurations.pageInfo.endCursor;
    this.loading = loading;
    this.filterPredicate();
  }

  /**
   * Handle sort change.
   *
   * @param event sort event
   */
  onSort(event: TableSort): void {
    // We change the sort for the current value
    this.sort = event;
    this.fetchApiConfigurations(true);
  }

  /**
   * Update api configurations query.
   *
   * @param refetch erase previous query results
   */
  private fetchApiConfigurations(refetch?: boolean): void {
    this.loading = true;
    const variables = {
      first: this.pageInfo.pageSize,
      afterCursor: refetch ? null : this.pageInfo.endCursor,
      sortField: this.sort?.sortDirection && this.sort.active,
      sortOrder: this.sort?.sortDirection,
    };
    const cachedValues: GetApiConfigurationsQueryResponse = getCachedValues(
      this.apollo.client,
      GET_API_CONFIGURATIONS,
      variables
    );
    if (refetch) {
      this.cachedApiConfigurations = [];
      this.pageInfo.pageIndex = 0;
    }
    if (cachedValues) {
      this.updateValues(cachedValues, false);
    } else {
      if (refetch) {
        // Rebuild the query
        this.apiConfigurationsQuery.refetch(variables);
      } else {
        // Fetch more records
        this.apiConfigurationsQuery
          .fetchMore({
            variables,
          })
          .then(
            (results: ApolloQueryResult<GetApiConfigurationsQueryResponse>) => {
              this.updateValues(results.data, results.loading);
            }
          );
      }
    }
  }
}
