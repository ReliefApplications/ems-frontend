import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Application, Page, WhoSnackBarService, WhoAuthService, PermissionsManagement, PermissionType } from 'who-shared';
import { GetApplicationByIdQueryResponse, GET_APPLICATION_BY_ID } from '../../../graphql/queries';
import { EditApplicationMutationResponse, EDIT_APPLICATION, DeletePageMutationResponse, DELETE_PAGE, AddPageMutationResponse, ADD_PAGE } from '../../../graphql/mutations';
import { Subscription } from 'rxjs';
import { AddPageComponent } from './add-page/add-page.component';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  // === DATA ===
  public id: string;
  public loading = true;
  public application: Application;
  public pages: Page[];
  public displayedColumns = ['pages', 'type', 'createdAt', 'actions'];

  // === APPLICATION NAME EDITION ===
  public formActive: boolean;
  public applicationNameForm: FormGroup;

  // === PERMISSIONS ===
  public canAdd = false;
  private authSubscription: Subscription;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: WhoSnackBarService,
    private authService: WhoAuthService
  ) { }

  ngOnInit(): void {
    this.formActive = false;
    this.id = this.route.snapshot.params.id;
    this.apollo.watchQuery<GetApplicationByIdQueryResponse>({
      query: GET_APPLICATION_BY_ID,
      variables: {
        id: this.id
      }
    }).valueChanges.subscribe((res) => {
      if (res.data.application) {
        this.application = res.data.application;
        this.pages = res.data.application.pages;
        this.applicationNameForm = new FormGroup({
          applicationName: new FormControl(this.application.name, Validators.required)
        });
        this.loading = res.loading;
        this.authSubscription = this.authService.user.subscribe(() => {
          this.canAdd = this.authService.userHasClaim(PermissionsManagement.mappedPermissions.applications.create);
        })
      } else {
        this.snackBar.openSnackBar('No access provided to this application.', { error: true });
        this.router.navigate(['/applications']);
      }
    },
      (err) => {
        this.snackBar.openSnackBar(err.message, { error: true });
        this.router.navigate(['/applications']);
      }
    );
  }

  toggleFormActive = () => this.formActive = !this.formActive;
  
  /*  Update the name of the application.
  */
  saveName(): void {
    const { applicationName } = this.applicationNameForm.value;
    this.toggleFormActive();
    this.apollo.mutate<EditApplicationMutationResponse>({
      mutation: EDIT_APPLICATION,
      variables: {
        id: this.id,
        name: applicationName
      }
    }).subscribe(res => {
      this.application.name = res.data.editApplication.name;
    });
  }

  /*  Edit the permissions layer.
  */
  saveAccess(e: any): void {
    this.apollo.mutate<EditApplicationMutationResponse>({
      mutation: EDIT_APPLICATION,
      variables: {
        id: this.id,
        permissions: e
      }
    }).subscribe(res => {
      this.application = res.data.editApplication;
    });
  }

  /*  Delete a page if authorized.
  */
  deletePage(id, e): void {
    e.stopPropagation();
    this.apollo.mutate<DeletePageMutationResponse>({
      mutation: DELETE_PAGE,
      variables: {
        id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar('Page deleted', { duration: 1000 });
      this.pages = this.pages.filter(x => {
        return x.id !== res.data.deletePage.id;
      });
    });
  }

  /*  Display the AddPage component if authorized.
    Add a new page once closed, if result exists.
  */
  addPage(): void {
    const dialogRef = this.dialog.open(AddPageComponent);
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<AddPageMutationResponse>({
          mutation: ADD_PAGE,
          variables: {
            name: value.name,
            type: value.type,
            application: this.id
          }
        }).subscribe(res => {
          this.snackBar.openSnackBar(`${value.name} page created`);
          const id = res.data.addPage.id;
          this.pages = this.pages.concat([res.data.addPage]);
          this.router.navigate(['../pages', id]);
        });
      }
    }); 
  }

}
