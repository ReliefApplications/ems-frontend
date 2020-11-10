import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { PermissionsManagement, PermissionType, WhoAuthService, WhoSnackBarService } from '@who-ems/builder';
import { GetApplicationsQueryResponse, GET_APPLICATIONS } from '../../../graphql/queries';
import { DeleteApplicationMutationResponse, DELETE_APPLICATION, AddApplicationMutationResponse, ADD_APPLICATION } from '../../../graphql/mutations';
import { AddApplicationComponent } from './components/add-application/add-application.component';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit, OnDestroy {

  // === DATA ===
  public loading = true;
  public applications = [];
  public displayedColumns = ['name', 'createdAt', 'actions'];

  // === PERMISSIONS ===
  canAdd = false;
  private authSubscription: Subscription;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: WhoSnackBarService,
    private authService: WhoAuthService
  ) { }

  ngOnInit(): void {
    this.apollo.watchQuery<GetApplicationsQueryResponse>({
      query: GET_APPLICATIONS
    }).valueChanges.subscribe(res => {
      this.applications = res.data.applications;
      this.loading = res.loading;
    });
    this.authSubscription = this.authService.user.subscribe(() => {
      this.canAdd = this.authService.userHasClaim(PermissionsManagement.getRightFromPath(this.router.url, PermissionType.create));
    })
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  /*  Delete an application if authorized.
  */
  deleteApplication(id, e): void {
    e.stopPropagation();
    this.apollo.mutate<DeleteApplicationMutationResponse>({
      mutation: DELETE_APPLICATION,
      variables: {
        id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar('Application deleted', { duration: 1000 });
      this.applications = this.applications.filter(x => {
        return x.id !== res.data.deleteApplication.id;
      });
    });
  }

  /*  Display the AddApplication component.
    Add a new application once closed, if result exists.
  */
  onAdd(): void {
    const dialogRef = this.dialog.open(AddApplicationComponent, {
      panelClass: 'add-dialog'
    });
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
}
