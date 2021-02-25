import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { Application, PermissionsManagement, PermissionType,
  WhoAuthService, WhoConfirmModalComponent, WhoSnackBarService, WhoApplicationService } from '@who-ems/builder';
import { GetApplicationsQueryResponse, GET_APPLICATIONS } from '../../../graphql/queries';
import { DeleteApplicationMutationResponse, DELETE_APPLICATION, AddApplicationMutationResponse,
  ADD_APPLICATION, EditApplicationMutationResponse, EDIT_APPLICATION } from '../../../graphql/mutations';
import { AddApplicationComponent } from './components/add-application/add-application.component';
import { ChoseRoleComponent } from './components/chose-role/chose-role.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PreviewService } from '../../../services/preview.service';
import { DuplicateApplicationComponent } from '../../../components/duplicate-application/duplicate-application.component';
import { MatEndDate, MatStartDate } from '@angular/material/datepicker';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit, AfterViewInit, OnDestroy {

  // === DATA ===
  public loading = true;
  public applications = new MatTableDataSource<Application>([]);
  public displayedColumns = ['name', 'createdAt', 'status', 'usersCount', 'actions'];

  // === SORTING ===
  @ViewChild(MatSort) sort: MatSort;

  // === FILTERS ===
  public filters = [{id: 'name', value: ''}, {id: 'createdAt', value: ''}, {id: 'status', value: ''}, {id: 'usersCount', value: ''}];
  public filtersDate = {startDate: '', endDate: ''};

  @ViewChild('startDate', { read: MatStartDate}) startDate: MatStartDate<string>;
  @ViewChild('endDate', { read: MatEndDate}) endDate: MatEndDate<string>;

  // === PERMISSIONS ===
  canAdd = false;
  private authSubscription: Subscription;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: WhoSnackBarService,
    private authService: WhoAuthService,
    private applicationService: WhoApplicationService,
    private previewService: PreviewService
  ) { }

  ngOnInit(): void {
    this.filterPredicate();

    this.apollo.watchQuery<GetApplicationsQueryResponse>({
      query: GET_APPLICATIONS
    }).valueChanges.subscribe(res => {
      this.applications.data = res.data.applications;
      this.loading = res.loading;
    });
    this.authSubscription = this.authService.user.subscribe(() => {
      this.canAdd = this.authService.userHasClaim(PermissionsManagement.getRightFromPath(this.router.url, PermissionType.create));
    });
  }

  private filterPredicate(): void {
    this.applications.filterPredicate = (data: any, filtersJson: string) => {
      const matchFilter = [];
      const filters = JSON.parse(filtersJson);

      filters.forEach(filter => {
        // check for null values
        const val = !!data[filter.id] ? data[filter.id] : filter.id === 'usersCount' ? 0 : '';
        // necessary to handler dates
        if (filter.id === 'createdAt') {
          const startDate = new Date(this.filtersDate.startDate).getTime();
          const endDate = new Date(this.filtersDate.endDate).getTime();
          matchFilter.push(!startDate || !endDate || data[filter.id] >=  startDate && data[filter.id] <= endDate);
        } else {
          matchFilter.push(val.toString().toLowerCase().includes(filter.value.toLowerCase()));
        }
      });

      return matchFilter.every(Boolean); // AND condition
      // return matchFilter.some(Boolean); // OR condition
    };
  }

  ngAfterViewInit(): void {
    this.applications.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  /*  Delete an application if authorized.
  */
  onDelete(element: any, e): void {
    e.stopPropagation();
    const dialogRef = this.dialog.open(WhoConfirmModalComponent, {
      data: {
        title: 'Delete application',
        content: `Do you confirm the deletion of the application ${element.name} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        const id = element.id;
        this.apollo.mutate<DeleteApplicationMutationResponse>({
          mutation: DELETE_APPLICATION,
          variables: {
            id
          }
        }).subscribe(res => {
          this.snackBar.openSnackBar('Application deleted', { duration: 1000 });
          this.applications.data = this.applications.data.filter(x => {
            return x.id !== res.data.deleteApplication.id;
          });
        });
      }
    });
  }

  /*  Display the AddApplication component.
    Add a new application once closed, if result exists.
  */
  onAdd(): void {
    const dialogRef = this.dialog.open(AddApplicationComponent);
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<AddApplicationMutationResponse>({
          mutation: ADD_APPLICATION,
          variables: {
            name: value.name
          }
        }).subscribe(res => {
          if (res.errors) {
            if (res.errors[0].message.includes('duplicate key error')) {
              this.snackBar.openSnackBar('An App with this name already exists, please choose a different name.');
            } else {
              this.snackBar.openSnackBar('The App was not created. ' + res.errors[0].message);
            }
          } else {
            this.snackBar.openSnackBar(`${value.name} application created`);
            const id = res.data.addApplication.id;
            this.router.navigate(['/applications', id]);
          }
        });
      }
    });
  }

  /*  Edit the permissions layer.
  */
  saveAccess(e: any, element: Application): void {
    this.apollo.mutate<EditApplicationMutationResponse>({
      mutation: EDIT_APPLICATION,
      variables: {
        id: element.id,
        permissions: e
      }
    }).subscribe((res) => {
      this.snackBar.openSnackBar(`${element.name} access edited.`);
      const index = this.applications.data.findIndex(x => x.id === element.id);
      this.applications.data[index] = res.data.editApplication;
      this.applications.data = this.applications.data;
    });
  }

  /*  Open a dialog to choose roles to fit in the preview.
  */
  onPreview(element: Application): void {
    const dialogRef = this.dialog.open(ChoseRoleComponent, {
      data: {
        application: element.id
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.previewService.setRole(value.role);
        this.router.navigate(['./app-preview', element.id]);
      }
    });
  }

  /*  Open a dialog to give a name for the duplicated application
  */
  onDuplicate(application: Application): void {
    const dialogRef = this.dialog.open(DuplicateApplicationComponent, {
      data: {
        id: application.id,
        name: application.name
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.applications.data.push(value);
        this.applications.data = this.applications.data;
      }
    });
  }

  applyFilter(column: string, event: any): void {
    {
      if (column !== 'createdAt' ) {
        this.filters.map(f => {
          if (f.id === column) {
            f.value = event.target.value;
          }
        });
      }
      this.applications.filter = JSON.stringify(this.filters);
    }
  }

  clearDateFilter(): void {
    this.filtersDate.startDate = '';
    this.filtersDate.endDate = '';
    // ignore that error
    this.startDate.value = '';
    this.endDate.value = '';
    this.applyFilter('createdAt', '');
  }
}
