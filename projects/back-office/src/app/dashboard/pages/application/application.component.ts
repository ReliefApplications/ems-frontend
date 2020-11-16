import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Application, Page, WhoSnackBarService, WhoAuthService, PermissionsManagement } from '@who-ems/builder';
import { Subscription } from 'rxjs';
import { AddTabComponent } from './components/add-tab/add-tab.component';
import { EditApplicationMutationResponse, EDIT_APPLICATION, DeletePageMutationResponse,
  DELETE_PAGE, AddPageMutationResponse, ADD_PAGE } from '../../../graphql/mutations';
import { ApplicationService } from '../../../services/application.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit, OnDestroy {

  // === DATA ===
  public id: string;
  public loading = true;
  public application: Application;
  public pages: Page[];
  public displayedColumns = ['name', 'type', 'createdAt', 'actions'];

  // === APPLICATION NAME EDITION ===
  public formActive: boolean;
  public applicationNameForm: FormGroup;

  // === PERMISSIONS ===
  public canAdd = false;
  private authSubscription: Subscription;

  // === ROUTE ===
  private routeSubscription: Subscription;
  private applicationSubscription: Subscription;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: WhoSnackBarService,
    private authService: WhoAuthService,
    private applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.id = params.id;
      this.application = null;
      this.loading = true;
      this.applicationService.loadApplication(this.id);
      console.log(this.loading);
    });
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      this.formActive = false;
      if (application) {
        this.application = application;
        this.pages = application.pages;
        this.applicationNameForm = new FormGroup({
          applicationName: new FormControl(this.application.name, Validators.required)
        });
        this.loading = false;
      }
    });
    this.authSubscription = this.authService.user.subscribe(() => {
      this.canAdd = this.authService.userHasClaim(PermissionsManagement.mappedPermissions.applications.create);
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.applicationSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
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
    const dialogRef = this.dialog.open(AddTabComponent, {
      panelClass: 'add-dialog',
      data: { showWorkflow: true }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<AddPageMutationResponse>({
          mutation: ADD_PAGE,
          variables: {
            name: value.name,
            type: value.type,
            content: value.content,
            application: this.id
          }
        }).subscribe(res => {
          this.snackBar.openSnackBar(`${value.name} page created`);
          const content = res.data.addPage.content;
          this.pages = this.pages.concat([res.data.addPage]);
          this.router.navigate(['../' + value.type, content], { relativeTo: this.route });
        });
      }
    });
  }

}
