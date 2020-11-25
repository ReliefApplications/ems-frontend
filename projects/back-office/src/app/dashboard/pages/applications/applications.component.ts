import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { Application, PermissionsManagement, PermissionType, WhoAuthService, WhoConfirmModalComponent, WhoSnackBarService } from '@who-ems/builder';
import { GetApplicationsQueryResponse, GET_APPLICATIONS } from '../../../graphql/queries';
import { DeleteApplicationMutationResponse, DELETE_APPLICATION, AddApplicationMutationResponse,
  ADD_APPLICATION, EditApplicationMutationResponse, EDIT_APPLICATION } from '../../../graphql/mutations';
import { AddApplicationComponent } from './components/add-application/add-application.component';
import { ChoseRoleComponent } from './components/chose-role/chose-role.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ApplicationService } from '../../../services/application.service';

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

  // === PERMISSIONS ===
  canAdd = false;
  private authSubscription: Subscription;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: WhoSnackBarService,
    private authService: WhoAuthService,
    private applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
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
          this.snackBar.openSnackBar(`${value.name} application created`);
          const id = res.data.addApplication.id;
          this.router.navigate(['/applications', id]);
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
        this.applicationService.setRole(value.role);
        this.router.navigate(['./app-preview', element.id]);
      }
    });
  }
}
