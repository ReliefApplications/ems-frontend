import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { ApiConfiguration, NOTIFICATIONS, PermissionsManagement, PermissionType,
  SafeAuthService, SafeConfirmModalComponent, SafeSnackBarService } from '@safe/builder';
import { Subscription } from 'rxjs';
import { GetApiConfigurationsQueryResponse, GET_API_CONFIGURATIONS } from '../../../graphql/queries';
import { AddApiConfigurationComponent } from './components/add-api-configuration/add-api-configuration.component';
import { AddApiConfigurationMutationResponse, ADD_API_CONFIGURATIION,
  DeleteApiConfigurationMutationResponse, DELETE_API_CONFIGURATIION } from '../../../graphql/mutations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-api-configurations',
  templateUrl: './api-configurations.component.html',
  styleUrls: ['./api-configurations.component.scss']
})
export class ApiConfigurationsComponent implements OnInit, OnDestroy, AfterViewInit {

  // === DATA ===
  public loading = true;
  displayedColumns = ['name', 'status', 'authType', 'actions'];
  dataSource = new MatTableDataSource<ApiConfiguration>([]);

  // === PERMISSIONS ===
  canAdd = false;
  private authSubscription?: Subscription;

  // === SORTING ===
  @ViewChild(MatSort) sort?: MatSort;

  // === FILTERS ===
  public showFilters = false;
  public searchText = '';
  public statusFilter = '';

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.apollo.watchQuery<GetApiConfigurationsQueryResponse>({
      query: GET_API_CONFIGURATIONS,
    }).valueChanges.subscribe(res => {
      this.dataSource.data = res.data.apiConfigurations;
      this.loading = res.loading;
      this.filterPredicate();
    });
    this.authSubscription = this.authService.user.subscribe(() => {
      this.canAdd = this.authService.userHasClaim(PermissionsManagement.getRightFromPath(this.router.url, PermissionType.create));
    });
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
            this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('API Configuration'), { expires: true, duration: 5000 });
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
