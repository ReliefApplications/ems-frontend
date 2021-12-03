import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  ApiConfiguration, NOTIFICATIONS, PermissionsManagement, PermissionType,
  SafeAuthService, SafeConfirmModalComponent, SafeSnackBarService
} from '@safe/builder';
import { Subscription } from 'rxjs';
import { GetApiConfigurationsQueryResponse, GET_API_CONFIGURATIONS } from '../../../graphql/queries';
import { AddApiConfigurationComponent } from './components/add-api-configuration/add-api-configuration.component';
import {
  AddApiConfigurationMutationResponse, ADD_API_CONFIGURATIION,
  DeleteApiConfigurationMutationResponse, DELETE_API_CONFIGURATIION
} from '../../../graphql/mutations';
import { Router } from '@angular/router';

const ITEMS_PER_PAGE = 10;

@Component({
  selector: 'app-api-configurations',
  templateUrl: './api-configurations.component.html',
  styleUrls: ['./api-configurations.component.scss']
})
export class ApiConfigurationsComponent implements OnInit, OnDestroy, AfterViewInit {

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
    endCursor: ''
  };

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.apiConfigurationsQuery = this.apollo.watchQuery<GetApiConfigurationsQueryResponse>({
      query: GET_API_CONFIGURATIONS,
      variables: {
        first: ITEMS_PER_PAGE
      }
    });

    this.apiConfigurationsQuery.valueChanges.subscribe(res => {
      this.cachedApiConfigurations = res.data.apiConfigurations.edges.map(x => x.node);
      this.dataSource.data = this.cachedApiConfigurations.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
      this.pageInfo.length = res.data.apiConfigurations.totalCount;
      this.pageInfo.endCursor = res.data.apiConfigurations.pageInfo.endCursor;
      this.loading = res.loading;
      this.filterPredicate();
    });

    this.authSubscription = this.authService.user.subscribe(() => {
      this.canAdd = this.authService.userHasClaim(PermissionsManagement.getRightFromPath(this.router.url, PermissionType.create));
    });
  }

  /**
   * Handles page event.
   * @param e page event.
   */
  onPage(e: any): void {
    this.pageInfo.pageIndex = e.pageIndex;
    if (e.pageIndex > e.previousPageIndex && e.length > this.cachedApiConfigurations.length) {
      this.apiConfigurationsQuery.fetchMore({
        variables: {
          first: ITEMS_PER_PAGE,
          afterCursor: this.pageInfo.endCursor
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) { return prev; }
          return Object.assign({}, prev, {
            apiConfigurations: {
              edges: [...prev.apiConfigurations.edges, ...fetchMoreResult.apiConfigurations.edges],
              pageInfo: fetchMoreResult.apiConfigurations.pageInfo,
              totalCount: fetchMoreResult.apiConfigurations.totalCount
            }
          });
        }
      });
    } else {
      this.dataSource.data = this.cachedApiConfigurations.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
    }
  }

  private filterPredicate(): void {
    this.dataSource.filterPredicate = (data: any) => {
      return (((this.searchText.trim().length === 0 ||
        (this.searchText.trim().length > 0 && data.name.toLowerCase().includes(this.searchText.trim()))) &&
        (this.statusFilter.trim().length === 0 ||
          (this.statusFilter.trim().length > 0 && data.status.toLowerCase().includes(this.statusFilter.trim())))));
    };
  }

  applyFilter(column: string, event: any): void {
    if (column === 'status') {
      this.statusFilter = !!event.value ? event.value.trim().toLowerCase() : '';
    } else {
      this.searchText = !!event ? event.target.value.trim().toLowerCase() : this.searchText;
    }
    this.dataSource.filter = '##';
  }

  clearAllFilters(): void {
    this.searchText = '';
    this.statusFilter = '';
    this.applyFilter('', null);
  }

  /*  Display the AddApiConfiguration modal.
      Create a new apiConfiguration on closed if result.
  */
  onAdd(): void {
    const dialogRef = this.dialog.open(AddApiConfigurationComponent);
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<AddApiConfigurationMutationResponse>({
          mutation: ADD_API_CONFIGURATIION,
          variables: {
            name: value.name
          }
        }).subscribe(res => {
          if (res.errors) {
            this.snackBar.openSnackBar(NOTIFICATIONS.objectNotCreated('apiConfiguration', res.errors[0].message), { error: true });
          } else {
            if (res.data) {
              this.router.navigate(['/settings/apiconfigurations', res.data.addApiConfiguration.id]);
            }
          }
        }, (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        });
      }
    });
  }

  /*  Remove an apiConfiguration if authorized.
  */
  onDelete(element: any, e: any): void {
    e.stopPropagation();
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: 'Delete API Configuration',
        content: `Do you confirm the deletion of the API Configuration ${element.name} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<DeleteApiConfigurationMutationResponse>({
          mutation: DELETE_API_CONFIGURATIION,
          variables: {
            id: element.id
          }
        }).subscribe(res => {
          if (res && !res.errors) {
            this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('API Configuration'));
            this.dataSource.data = this.dataSource.data.filter(x => x.id !== element.id);
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort || null;
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
