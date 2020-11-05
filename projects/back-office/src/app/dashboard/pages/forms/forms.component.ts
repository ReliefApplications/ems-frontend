import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { GetFormsQueryResponse, GET_FORMS } from '../../../graphql/queries';
import { Subscription } from 'rxjs';
import { WhoSnackBarService, WhoAuthService, PermissionsManagement, PermissionType } from 'who-shared';
import { AddFormComponent } from './add-form/add-form.component';
import { DeleteFormMutationResponse, DELETE_FORM, AddFormMutationResponse, ADD_FORM } from '../../../graphql/mutations';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy {

  // === DATA ===
  public loading = true;
  displayedColumns: string[] = ['name', 'createdAt', 'status', 'versions', 'recordsCount', 'core', 'actions'];
  dataSource = [];

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

  /*  Load the forms.
    Check user permission to add new forms.
  */
  ngOnInit(): void {
    this.apollo.watchQuery<GetFormsQueryResponse>({
      query: GET_FORMS
    }).valueChanges.subscribe(res => {
      this.dataSource = res.data.forms;
      this.loading = res.loading;
    });
    this.authSubscription = this.authService.user.subscribe(() => {
      this.canAdd = this.authService.userHasClaim(PermissionsManagement.getRightFromPath(this.router.url, PermissionType.create));
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  /*  Remove a form if authorized.
  */
  deleteForm(id: any, e: any): void {
    e.stopPropagation();
    this.apollo.mutate<DeleteFormMutationResponse>({
      mutation: DELETE_FORM,
      variables: {
        id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar('Form deleted', { duration: 1000 });
      this.dataSource = this.dataSource.filter(x => {
        return x.id !== id;
      });
    });
  }

  /*  Display the AddForm modal.
    Create a new form on closed if result.
  */
  onAdd(): void {
    const dialogRef = this.dialog.open(AddFormComponent, {
      panelClass: 'add-dialog'
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        const data = { name: value.name };
        Object.assign(data,
          value.binding === 'newResource' && { newResource: true },
          (value.binding === 'fromResource' && value.resource) && { resource: value.resource }
        );
        this.apollo.mutate<AddFormMutationResponse>({
          mutation: ADD_FORM,
          variables: data
        }).subscribe(res => {
          const { id } = res.data.addForm;
          if (value.binding === 'fromResource' && value.template) {
            this.router.navigate(['/forms/builder', { id, template: value.template }]);
          } else {
            this.router.navigate(['/forms/builder', id]);
          }
        }, (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        });
      }
    });
  }
}
