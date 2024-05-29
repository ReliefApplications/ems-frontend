import { Component, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  AddApiConfigurationMutationResponse,
  ApiConfiguration,
  ConfirmService,
  UnsubscribeComponent,
  ApiConfigurationsQueryResponse,
  DeleteApiConfigurationMutationResponse,
  getCachedValues,
  updateQueryUniqueValues,
} from '@oort-front/shared';
import {
  ADD_API_CONFIGURATION,
  DELETE_API_CONFIGURATION,
} from './graphql/mutations';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { ApolloQueryResult } from '@apollo/client';
import {
  TableSort,
  UIPageChangeEvent,
  handleTablePageEvent,
} from '@oort-front/ui';
import { SnackbarService } from '@oort-front/ui';
import { GET_API_CONFIGURATIONS } from './graphql/queries';
import { FormBuilder } from '@angular/forms';

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
  extends UnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  /** Loading state */
  public loading = true;
  /** Updating state */
  public updating = false;
  /** Query reference */
  private apiConfigurationsQuery!: QueryRef<ApiConfigurationsQueryResponse>;
  /** Columns to display */
  displayedColumns = ['name', 'status', 'authType', 'actions'];
  /** Data source */
  dataSource = new Array<ApiConfiguration>();
  /** Cached data */
  public cachedApiConfigurations: ApiConfiguration[] = [];

  // === SORTING ===
  /** Sort object */
  private sort!: TableSort;

  // === FILTERS ===
  /** Filter object */
  public filter: any = {
    filters: [],
    logic: 'and',
  };
  /** Filter form */
  form = this.fb.group({});
  /** Show filter */
  public showFilters = false;

  /** Page info */
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
   * @param fb Angular Form Builder
   */
  constructor(
    private apollo: Apollo,
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private confirmService: ConfirmService,
    private router: Router,
    private translate: TranslateService, // private uiTableWrapper: TableWrapperDirective
    private fb: FormBuilder
  ) {
    super();
  }

  /**
   * Creates the API configuration query, and subscribes to the query changes.
   */
  ngOnInit(): void {
    this.apiConfigurationsQuery =
      this.apollo.watchQuery<ApiConfigurationsQueryResponse>({
        query: GET_API_CONFIGURATIONS,
        variables: {
          first: ITEMS_PER_PAGE,
          afterCursor: this.pageInfo.endCursor,
          filter: this.filter,
          sortField: this.sort?.sortDirection && this.sort.active,
          sortOrder: this.sort?.sortDirection,
        },
      });

    this.apiConfigurationsQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (results: ApolloQueryResult<ApiConfigurationsQueryResponse>) => {
          this.updateValues(results.data, results.loading);
        }
      );
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
      this.cachedApiConfigurations
    );
    if (cachedData && cachedData.length === this.pageInfo.pageSize) {
      this.dataSource = cachedData;
    } else {
      this.fetchApiConfigurations();
    }
  }

  /**
   * Applies the filter to the data source.
   *
   * @param event event value of the filter.
   */
  applyFilter(event: any): void {
    this.filter = event;
    this.fetchApiConfigurations(true);
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
    data: ApiConfigurationsQueryResponse,
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
    this.updating = false;
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
    this.updating = true;
    const variables = {
      first: this.pageInfo.pageSize,
      afterCursor: refetch ? null : this.pageInfo.endCursor,
      filter: this.filter,
      sortField: this.sort?.sortDirection && this.sort.active,
      sortOrder: this.sort?.sortDirection,
    };
    const cachedValues: ApiConfigurationsQueryResponse = getCachedValues(
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
            (results: ApolloQueryResult<ApiConfigurationsQueryResponse>) => {
              this.updateValues(results.data, results.loading);
            }
          );
      }
    }
  }
}
