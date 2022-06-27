import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  ApiConfiguration,
  PermissionsManagement,
  PermissionType,
  SafeAuthService,
  SafeConfirmModalComponent,
  SafeSnackBarService,
} from '@safe/builder';
import { Subscription } from 'rxjs';
import {
  GetApiConfigurationsQueryResponse,
  GET_API_CONFIGURATIONS,
} from '../../../graphql/queries';
import { AddApiConfigurationComponent } from './components/add-api-configuration/add-api-configuration.component';
import {
  AddApiConfigurationMutationResponse,
  ADD_API_CONFIGURATIION,
  DeleteApiConfigurationMutationResponse,
  DELETE_API_CONFIGURATION,
} from '../../../graphql/mutations';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

const ITEMS_PER_PAGE = 10;

@Component({
  selector: 'app-api-configurations',
  templateUrl: './api-configurations.component.html',
  styleUrls: ['./api-configurations.component.scss'],
})
export class ApiConfigurationsComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  // === DATA ===
  public loading = true;
  private apiConfigurationsQuery!: QueryRef<GetApiConfigurationsQueryResponse>;
  displayedColumns = ['name', 'status', 'authType', 'actions'];
  dataSource = new MatTableDataSource<ApiConfiguration>([]);
  public cachedApiConfigurations: ApiConfiguration[] = [];

  // === PERMISSIONS ===
  canAdd = false;
  private authSubscription?: Subscription;

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

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

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

    this.apiConfigurationsQuery.valueChanges.subscribe((res) => {
      this.cachedApiConfigurations = res.data.apiConfigurations.edges.map(
        (x) => x.node
      );
      this.dataSource.data = this.cachedApiConfigurations.slice(
        this.pageInfo.pageSize * this.pageInfo.pageIndex,
        this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
      );
      this.pageInfo.length = res.data.apiConfigurations.totalCount;
      this.pageInfo.endCursor = res.data.apiConfigurations.pageInfo.endCursor;
      this.loading = res.loading;
      this.filterPredicate();
    });

    this.authSubscription = this.authService.user$.subscribe(() => {
      this.canAdd = this.authService.userHasClaim(
        PermissionsManagement.getRightFromPath(
          this.router.url,
          PermissionType.create
        )
      );
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
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prev;
          }
          return Object.assign({}, prev, {
            apiConfigurations: {
              edges: [
                ...prev.apiConfigurations.edges,
                ...fetchMoreResult.apiConfigurations.edges,
              ],
              pageInfo: fetchMoreResult.apiConfigurations.pageInfo,
              totalCount: fetchMoreResult.apiConfigurations.totalCount,
            },
          });
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
          .subscribe(
            (res) => {
              if (res.errors) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'common.notifications.objectNotCreated',
                    {
                      type: this.translate.instant(
                        'common.apiConfiguration.one'
                      ),
                      error: res.errors[0].message,
                    }
                  ),
                  { error: true }
                );
              } else {
                if (res.data) {
                  this.router.navigate([
                    '/settings/apiconfigurations',
                    res.data.addApiConfiguration.id,
                  ]);
                }
              }
            },
            (err) => {
              this.snackBar.openSnackBar(err.message, { error: true });
            }
          );
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
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: this.translate.instant(
          'components.apiConfiguration.delete.title'
        ),
        content: this.translate.instant(
          'components.apiConfiguration.delete.confirmationMessage',
          {
            name: element.name,
          }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        cancelText: this.translate.instant('components.confirmModal.cancel'),
        confirmColor: 'warn',
      },
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

  /**
   * Removes all subscriptions.
   */
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
