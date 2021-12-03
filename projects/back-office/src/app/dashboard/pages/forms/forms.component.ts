import { Apollo, QueryRef } from 'apollo-angular';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GET_SHORT_FORMS, GetFormsQueryResponse } from '../../../graphql/queries';
import { Subscription } from 'rxjs';
import {
  SafeSnackBarService,
  SafeAuthService,
  PermissionsManagement,
  PermissionType,
  SafeConfirmModalComponent,
  NOTIFICATIONS,
  Form
} from '@safe/builder';
import { DeleteFormMutationResponse, DELETE_FORM, AddFormMutationResponse, ADD_FORM } from '../../../graphql/mutations';
import { AddFormComponent } from '../../../components/add-form/add-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

const ITEMS_PER_PAGE = 10;

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy, AfterViewInit {

  // === DATA ===
  public loading = true;
  private formsQuery!: QueryRef<GetFormsQueryResponse>;
  public displayedColumns = ['name', 'createdAt', 'status', 'versionsCount', 'recordsCount', 'core', 'parentForm', 'actions'];
  public forms = new MatTableDataSource<Form>([]);
  public cachedForms: Form[] = [];

  // === PERMISSIONS ===
  canAdd = false;
  private authSubscription?: Subscription;

  // === SORTING ===
  @ViewChild(MatSort) sort?: MatSort;

  // === FILTERING ===
  public filter: any;

  // === PAGINATION ===
  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: ''
  };

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService
  ) {}

  /*  Load the forms.
    Check user permission to add new forms.
  */
  ngOnInit(): void {
    this.formsQuery = this.apollo.watchQuery<GetFormsQueryResponse>({
      query: GET_SHORT_FORMS,
      variables: {
        first: ITEMS_PER_PAGE
      }
    });

    this.formsQuery.valueChanges.subscribe(res => {
      this.cachedForms = res.data.forms.edges.map(x => x.node);
      this.forms.data = this.cachedForms.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
      this.pageInfo.length = res.data.forms.totalCount;
      this.pageInfo.endCursor = res.data.forms.pageInfo.endCursor;
      this.loading = res.loading;
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
    if (e.pageIndex > e.previousPageIndex && e.length > this.cachedForms.length) {
      this.formsQuery.fetchMore({
        variables: {
          first: ITEMS_PER_PAGE,
          afterCursor: this.pageInfo.endCursor,
          filter: this.filter
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) { return prev; }
          return Object.assign({}, prev, {
            forms: {
              edges: [...prev.forms.edges, ...fetchMoreResult.forms.edges],
              pageInfo: fetchMoreResult.forms.pageInfo,
              totalCount: fetchMoreResult.forms.totalCount
            }
          });
        }
      });
    } else {
      this.forms.data = this.cachedForms.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
    }
  }

  /**
   * Filters forms and updates table.
   * @param filter filter event.
   */
  onFilter(filter: any): void {
    this.filter = filter;
    this.cachedForms = [];
    this.pageInfo.pageIndex = 0;
    this.formsQuery.fetchMore({
      variables: {
        first: ITEMS_PER_PAGE,
        filter: this.filter
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) { return prev; }
        return Object.assign({}, prev, {
          forms: {
            edges: fetchMoreResult.forms.edges,
            pageInfo: fetchMoreResult.forms.pageInfo,
            totalCount: fetchMoreResult.forms.totalCount
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.forms.sort = this.sort || null;
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

 /**
  * Removes a form.
  * @param form Form to delete.
  * @param e click event.
  */
  onDelete(form: Form, e: any): void {
    const warning = 'Deleting a core form will recursively delete linked forms and resources.';
    e.stopPropagation();
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: 'Delete form',
        content: `Do you confirm the deletion of the form ${form.name} ? ${form.core ? warning : ''}`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        const id = form.id;
        this.apollo.mutate<DeleteFormMutationResponse>({
          mutation: DELETE_FORM,
          variables: {
            id
          }
        }).subscribe((res: any) => {
          if (!res.errors) {
            this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('form'));
            this.forms.data = this.forms.data.filter(x => {
              return x.id !== form.id && form.id !== x.resource?.coreForm?.id;
            });
          } else {
            this.snackBar.openSnackBar(NOTIFICATIONS.objectNotDeleted('form', res.errors[0].message), { error: true });
          }
        });
      }
    });
  }

 /**
  * Displays the AddForm modal.
  * Creates a new form on closed if result.
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
          (value.binding === 'fromResource' && value.resource) && { resource: value.resource },
          (value.binding === 'fromResource' && value.template) && { template: value.template }
        );
        this.apollo.mutate<AddFormMutationResponse>({
          mutation: ADD_FORM,
          variables: data
        }).subscribe(res => {
          if (res.errors) {
            this.snackBar.openSnackBar(NOTIFICATIONS.objectNotCreated('form', res.errors[0].message), { error: true });
          } else {
            if (res.data) {
              const { id } = res.data.addForm;
              this.router.navigate(['/forms/builder', id]);
            }
          }
        }, (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        });
      }
    });
  }
}
