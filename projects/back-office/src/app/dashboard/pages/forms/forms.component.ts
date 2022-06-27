import { Apollo, QueryRef } from 'apollo-angular';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  GET_SHORT_FORMS,
  GetFormsQueryResponse,
} from '../../../graphql/queries';
import { Subscription } from 'rxjs';
import {
  SafeSnackBarService,
  SafeAuthService,
  PermissionsManagement,
  PermissionType,
  SafeConfirmModalComponent,
  Form,
} from '@safe/builder';
import {
  DeleteFormMutationResponse,
  DELETE_FORM,
  AddFormMutationResponse,
  ADD_FORM,
} from '../../../graphql/mutations';
import { AddFormComponent } from '../../../components/add-form/add-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';

const DEFAULT_PAGE_SIZE = 10;

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent implements OnInit, OnDestroy, AfterViewInit {
  // === DATA ===
  public loading = true;
  public filterLoading = false;
  private formsQuery!: QueryRef<GetFormsQueryResponse>;
  public displayedColumns = [
    'name',
    'createdAt',
    'status',
    'versionsCount',
    'recordsCount',
    'core',
    'parentForm',
    'actions',
  ];
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
    pageSize: DEFAULT_PAGE_SIZE,
    length: 0,
    endCursor: '',
  };

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    private translate: TranslateService
  ) {}

  /**
   * Creates the form query, and subscribes to the query changes.
   */
  ngOnInit(): void {
    this.formsQuery = this.apollo.watchQuery<GetFormsQueryResponse>({
      query: GET_SHORT_FORMS,
      variables: {
        first: DEFAULT_PAGE_SIZE,
      },
    });

    this.formsQuery.valueChanges.subscribe((res) => {
      this.cachedForms = res.data.forms.edges.map((x) => x.node);
      this.forms.data = this.cachedForms.slice(
        this.pageInfo.pageSize * this.pageInfo.pageIndex,
        this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
      );
      this.pageInfo.length = res.data.forms.totalCount;
      this.pageInfo.endCursor = res.data.forms.pageInfo.endCursor;
      this.loading = res.loading;
      this.filterLoading = false;
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
      e.length > this.cachedForms.length
    ) {
      // Sets the new fetch quantity of data needed as the page size
      // If the fetch is for a new page the page size is used
      let first = e.pageSize;
      // If the fetch is for a new page size, the old page size is substracted from the new one
      if (e.pageSize > this.pageInfo.pageSize) {
        first -= this.pageInfo.pageSize;
      }
      this.loading = true;
      this.formsQuery.fetchMore({
        variables: {
          first,
          afterCursor: this.pageInfo.endCursor,
          filter: this.filter,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prev;
          }
          return Object.assign({}, prev, {
            forms: {
              edges: [...prev.forms.edges, ...fetchMoreResult.forms.edges],
              pageInfo: fetchMoreResult.forms.pageInfo,
              totalCount: fetchMoreResult.forms.totalCount,
            },
          });
        },
      });
    } else {
      this.forms.data = this.cachedForms.slice(
        e.pageSize * this.pageInfo.pageIndex,
        e.pageSize * (this.pageInfo.pageIndex + 1)
      );
    }
    this.pageInfo.pageSize = e.pageSize;
  }

  /**
   * Filters forms and updates table.
   *
   * @param filter filter event.
   */
  onFilter(filter: any): void {
    this.filterLoading = true;
    this.filter = filter;
    this.cachedForms = [];
    this.pageInfo.pageIndex = 0;
    this.formsQuery.fetchMore({
      variables: {
        first: this.pageInfo.pageSize,
        filter: this.filter,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return Object.assign({}, prev, {
          forms: {
            edges: fetchMoreResult.forms.edges,
            pageInfo: fetchMoreResult.forms.pageInfo,
            totalCount: fetchMoreResult.forms.totalCount,
          },
        });
      },
    });
  }

  /**
   * Sets the sort in the view.
   */
  ngAfterViewInit(): void {
    this.forms.sort = this.sort || null;
  }

  /**
   * Removes all the subscriptions.
   */
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  /**
   * Removes a form.
   *
   * @param form Form to delete.
   * @param e click event.
   */
  onDelete(form: Form, e: any): void {
    const warning =
      'Deleting a core form will recursively delete linked forms and resources.';
    e.stopPropagation();
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: this.translate.instant('common.deleteObject', {
          name: this.translate.instant('common.form.one'),
        }),
        content: this.translate.instant(
          'components.form.delete.confirmationMessage',
          {
            name: form.name,
          }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        cancelText: this.translate.instant('components.confirmModal.cancel'),
        confirmColor: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        const id = form.id;
        this.apollo
          .mutate<DeleteFormMutationResponse>({
            mutation: DELETE_FORM,
            variables: {
              id,
            },
          })
          .subscribe((res: any) => {
            if (!res.errors) {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectDeleted', {
                  value: this.translate.instant('common.form.one'),
                })
              );
              this.forms.data = this.forms.data.filter(
                (x) => x.id !== form.id && form.id !== x.resource?.coreForm?.id
              );
            } else {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.objectNotDeleted',
                  {
                    value: this.translate.instant('common.form.one'),
                    error: res.errors[0].message,
                  }
                ),
                { error: true }
              );
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
      panelClass: 'add-dialog',
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        const data = { name: value.name };
        Object.assign(
          data,
          value.resource && { resource: value.resource },
          value.template && { template: value.template }
        );
        this.apollo
          .mutate<AddFormMutationResponse>({
            mutation: ADD_FORM,
            variables: data,
          })
          .subscribe(
            (res) => {
              if (res.errors) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'common.notifications.objectNotCreated',
                    {
                      type: this.translate
                        .instant('common.form.one')
                        .toLowerCase(),
                      error: res.errors[0].message,
                    }
                  ),
                  { error: true }
                );
              } else {
                if (res.data) {
                  const { id } = res.data.addForm;
                  this.router.navigate(['/forms/builder', id]);
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
}
