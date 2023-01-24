import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import {
  SafeSnackBarService,
  SafeAuthService,
  SafeConfirmService,
  Form,
  SafeUnsubscribeComponent,
} from '@safe/builder';
import { GET_SHORT_FORMS, GetFormsQueryResponse } from './graphql/queries';
import {
  DeleteFormMutationResponse,
  DELETE_FORM,
  AddFormMutationResponse,
  ADD_FORM,
} from './graphql/mutations';
import { AddFormModalComponent } from '../../../components/add-form-modal/add-form-modal.component';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Sort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';

/** Default number of items for pagination */
const DEFAULT_PAGE_SIZE = 10;

/** Forms page component */
@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent extends SafeUnsubscribeComponent implements OnInit {
  // === DATA ===
  public loading = true;
  public updating = false;
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

  // === FILTERING ===
  public filter: any;
  private sort: Sort = { active: '', direction: '' };

  // === PAGINATION ===
  public pageInfo = {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    length: 0,
    endCursor: '',
  };

  /**
   * Forms page component
   *
   * @param apollo Apollo service
   * @param dialog Material dialog service
   * @param router Angular router
   * @param snackBar Shared snackbar
   * @param authService Shared authentication service
   * @param confirmService Shared confirmation service
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService
  ) {
    super();
  }

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

    this.formsQuery.valueChanges.subscribe(({ data, loading }) => {
      this.cachedForms = data.forms.edges.map((x) => x.node);
      this.forms.data = this.cachedForms.slice(
        this.pageInfo.pageSize * this.pageInfo.pageIndex,
        this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
      );
      this.pageInfo.length = data.forms.totalCount;
      this.pageInfo.endCursor = data.forms.pageInfo.endCursor;
      this.loading = loading;
      this.updating = loading;
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
      this.pageInfo.pageSize = first;
      this.fetchForms();
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
    this.filter = filter;
    this.fetchForms(true);
  }

  /**
   * Handle sort change.
   *
   * @param event sort event
   */
  onSort(event: Sort): void {
    this.sort = event;
    this.fetchForms(true);
  }

  /**
   * Update forms query.
   *
   * @param refetch erase previous query results
   */
  private fetchForms(refetch?: boolean): void {
    this.updating = true;
    if (refetch) {
      this.cachedForms = [];
      this.pageInfo.pageIndex = 0;
      this.formsQuery
        .refetch({
          first: this.pageInfo.pageSize,
          afterCursor: null,
          filter: this.filter,
          sortField: this.sort?.direction && this.sort.active,
          sortOrder: this.sort?.direction,
        })
        .then(() => {
          this.loading = false;
          this.updating = false;
        });
    } else {
      this.formsQuery.fetchMore({
        variables: {
          first: this.pageInfo.pageSize,
          afterCursor: this.pageInfo.endCursor,
          filter: this.filter,
          sortField: this.sort?.direction && this.sort.active,
          sortOrder: this.sort?.direction,
        },
        // updateQuery: (prev, { fetchMoreResult }) => {
        //   if (!fetchMoreResult) {
        //     return prev;
        //   }
        //   return Object.assign({}, prev, {
        //     forms: {
        //       edges: [...prev.forms.edges, ...fetchMoreResult.forms.edges],
        //       pageInfo: fetchMoreResult.forms.pageInfo,
        //       totalCount: fetchMoreResult.forms.totalCount,
        //     },
        //   });
        // },
      });
    }
  }

  /**
   * Removes a form.
   *
   * @param form Form to delete.
   * @param e click event.
   */
  onDelete(form: Form, e: any): void {
    e.stopPropagation();
    const dialogRef = this.confirmService.openConfirmModal({
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
      confirmColor: 'warn',
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
          .subscribe(({ errors }: any) => {
            if (!errors) {
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
                    error: errors[0].message,
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
    const dialogRef = this.dialog.open(AddFormModalComponent);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        const variablesData = { name: value.name };
        Object.assign(
          variablesData,
          value.resource && { resource: value.resource },
          value.template && { template: value.template }
        );
        this.apollo
          .mutate<AddFormMutationResponse>({
            mutation: ADD_FORM,
            variables: variablesData,
          })
          .subscribe({
            next: ({ errors, data }) => {
              if (errors) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'common.notifications.objectNotCreated',
                    {
                      type: this.translate
                        .instant('common.form.one')
                        .toLowerCase(),
                      error: errors[0].message,
                    }
                  ),
                  { error: true }
                );
              } else {
                if (data) {
                  const { id } = data.addForm;
                  this.router.navigate(['/forms/' + id + '/builder']);
                }
              }
            },
            error: (err) => {
              this.snackBar.openSnackBar(err.message, { error: true });
            },
          });
      }
    });
  }
}
