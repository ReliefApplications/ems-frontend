import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  ApiConfiguration,
  SafeAuthService,
  SafeConfirmService,
  SafeSnackBarService,
  SafeUnsubscribeComponent,
} from '@safe/builder';
import {
  GetApiConfigurationsQueryResponse,
  GET_API_CONFIGURATIONS,
} from './graphql/queries';
import { AddApiConfigurationComponent } from './components/add-api-configuration/add-api-configuration.component';
import {
  AddApiConfigurationMutationResponse,
  ADD_API_CONFIGURATIION,
  DeleteApiConfigurationMutationResponse,
  DELETE_API_CONFIGURATION,
} from './graphql/mutations';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

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
  @ViewChild(MatSort) sort?: MatSort;

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
   * @param authService Shared authentication service
   * @param confirmService Shared confirm service
   * @param router Angular router
   * @param translate Angular translate service
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
   * Creates the API configuration query, and subscribes to the query changes.
   */
  ngOnInit(): void {
    this.apiConfigurationsQuery =
      this.apollo.watchQuery<GetApiConfigurationsQueryResponse>({
        query: GET_API_CONFIGURATIONS,
        variables: {
          first: ITEMS_PER_PAGE,
        },
      });

    this.apiConfigurationsQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data, loading }) => {
        this.cachedApiConfigurations = data.apiConfigurations.edges.map(
          (x) => x.node
        );
        this.dataSource.data = this.cachedApiConfigurations.slice(
          this.pageInfo.pageSize * this.pageInfo.pageIndex,
          this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
        );
        this.pageInfo.length = data.apiConfigurations.totalCount;
        this.pageInfo.endCursor = data.apiConfigurations.pageInfo.endCursor;
        this.loading = loading;
        this.filterPredicate();
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
      (e.pageIndex > e.previousPageIndex ||
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
      this.apiConfigurationsQuery.fetchMore({
        variables: {
          first: neededSize,
          afterCursor: this.pageInfo.endCursor,
        },
      });
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
      this.statusFilter = !!event.value ? event.value.trim().toLowerCase() : '';
    } else {
      this.searchText = !!event
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
  onAdd(): void {
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
                      type: this.translate.instant(
                        'common.apiConfiguration.one'
                      ),
                      error: errors[0].message,
                    }
                  ),
                  { error: true }
                );
              } else {
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
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.apollo
          .mutate<DeleteApiConfigurationMutationResponse>({
            mutation: DELETE_API_CONFIGURATION,
            variables: {
              id: element.id,
            },
          })
          .subscribe((res) => {
            if (res && !res.errors) {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectDeleted', {
                  value: this.translate.instant('common.apiConfiguration.one'),
                })
              );
              this.dataSource.data = this.dataSource.data.filter(
                (x) => x.id !== element.id
              );
            }
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
}
