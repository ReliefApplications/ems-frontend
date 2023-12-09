import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GET_USERS, GET_ROLES } from './graphql/queries';
import { ADD_USERS, DELETE_USERS } from './graphql/mutations';
import {
  AddUsersMutationResponse,
  ConfirmService,
  DeleteUsersMutationResponse,
  DownloadService,
  Role,
  RolesQueryResponse,
  UnsubscribeComponent,
  User,
  UsersNodeQueryResponse,
  getCachedValues,
  updateQueryUniqueValues,
} from '@oort-front/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import {
  SnackbarService,
  UIPageChangeEvent,
  handleTablePageEvent,
} from '@oort-front/ui';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { ApolloQueryResult } from '@apollo/client';

/** Default items per page for pagination. */
const ITEMS_PER_PAGE = 10;

/**
 * Component which will show all the user in the app.
 * Accessible with '/settings/users' route.
 * Management of users.
 */
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends UnsubscribeComponent implements OnInit {
  /** Reference to expanded filter template */
  @ViewChild('expandedFilter')
  expandedFilter!: TemplateRef<any>;
  /** Loading indicator */
  public loading = true;
  /** All users */
  public users = new Array<User>();
  /** Back-office roles */
  public roles: Role[] = [];
  /** Table columns */
  public displayedColumns = [
    'select',
    'name',
    'username',
    'oid',
    'roles',
    'actions',
  ];
  /** Users selection */
  public selection = new SelectionModel<User>(true, []);
  /** Cached users */
  public cachedUsers: User[] = [];
  /** Page info */
  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: '',
  };
  /** Applied filters */
  public filter: CompositeFilterDescriptor = {
    filters: [],
    logic: 'and',
  };
  /** Users query */
  private usersQuery!: QueryRef<UsersNodeQueryResponse>;

  /**
   * Component which will show all the user in the app.
   * Accessible with '/settings/users' route.
   * Management of users.
   *
   * @param apollo Used to load the users.
   * @param router Angular router
   * @param snackBar Shared snackbar service
   * @param dialog CDK Dialog service
   * @param downloadService Shared download service
   * @param confirmService Shared confirm service
   * @param translate Angular translation service
   * @param activatedRoute Angular active route
   */
  constructor(
    private apollo: Apollo,
    private router: Router,
    private snackBar: SnackbarService,
    private dialog: Dialog,
    private downloadService: DownloadService,
    private confirmService: ConfirmService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  /** Load the users */
  ngOnInit(): void {
    this.usersQuery = this.apollo.watchQuery<UsersNodeQueryResponse>({
      query: GET_USERS,
      variables: {
        first: ITEMS_PER_PAGE,
        afterCursor: null,
        filter: this.filter,
      },
    });
    this.apollo
      .watchQuery<RolesQueryResponse>({
        query: GET_ROLES,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.roles = data.roles;
        this.loading = loading;
      });
    this.usersQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data, loading }) => {
        this.loading = true;
        this.updateValues(data, loading);
      });
  }

  /**
   * Filters users and updates table.
   *
   * @param filter filter event.
   */
  onFilter(filter: any): void {
    this.filter = filter;
    this.fetchUsers(true);
  }

  /**
   * Show a dialog for inviting someone
   */
  async onInvite(): Promise<void> {
    const { InviteUsersModalComponent } = await import('@oort-front/shared');
    const dialogRef = this.dialog.open(InviteUsersModalComponent, {
      data: {
        roles: this.roles,
        users: this.users,
        downloadPath: 'download/invite',
        uploadPath: 'upload/invite',
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.apollo
          .mutate<AddUsersMutationResponse>({
            mutation: ADD_USERS,
            variables: {
              users: value,
              application: this.roles[0].application?.id,
            },
          })
          .subscribe({
            next: ({ errors, data }) => {
              if (!errors) {
                if (data?.addUsers.length) {
                  this.snackBar.openSnackBar(
                    this.translate.instant('components.users.onInvite.plural')
                  );
                } else {
                  this.snackBar.openSnackBar(
                    this.translate.instant('components.users.onInvite.singular')
                  );
                }
                this.fetchUsers(true);
              } else {
                if (value.length > 1) {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'components.users.onNotInvite.plural',
                      { error: errors[0].message }
                    ),
                    { error: true }
                  );
                } else {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'components.users.onNotInvite.singular',
                      { error: errors[0].message }
                    ),
                    { error: true }
                  );
                }
              }
            },
          });
      }
    });
  }

  /**
   * Show a dialog to confirm the deletion of users
   *
   * @param users The list of users to delete
   */
  onDelete(users: User[]): void {
    let title = this.translate.instant('common.deleteObject', {
      name: this.translate.instant('common.user.one'),
    });
    let content = this.translate.instant(
      'components.user.delete.confirmationMessage',
      {
        name: users[0].username,
      }
    );
    if (users.length > 1) {
      title = this.translate.instant('common.deleteObject', {
        name: this.translate.instant('common.user.few'),
      });
      content = this.translate.instant(
        'components.user.delete.confirmationMessage',
        {
          name: users[0].username,
        }
      );
    }
    const dialogRef = this.confirmService.openConfirmModal({
      title,
      content,
      confirmText: this.translate.instant('components.confirmModal.delete'),
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        const ids = users.map((u) => u.id);
        this.loading = true;
        this.selection.clear();

        this.apollo
          .mutate<DeleteUsersMutationResponse>({
            mutation: DELETE_USERS,
            variables: { ids },
          })
          .subscribe({
            next: ({ errors, data }) => {
              if (errors) {
                if (ids.length > 1) {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'components.users.onNotDelete.plural',
                      { error: errors ? errors[0].message : '' }
                    ),
                    { error: true }
                  );
                } else {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'components.users.onNotDelete.singular',
                      { error: errors ? errors[0].message : '' }
                    ),
                    { error: true }
                  );
                }
              } else {
                this.loading = false;
                if (data?.deleteUsers) {
                  if (data.deleteUsers > 1) {
                    this.snackBar.openSnackBar(
                      this.translate.instant('components.users.onDelete.plural')
                    );
                  } else {
                    this.snackBar.openSnackBar(
                      this.translate.instant(
                        'components.users.onDelete.singular'
                      )
                    );
                  }
                  this.fetchUsers(true);
                } else {
                  if (ids.length > 1) {
                    this.snackBar.openSnackBar(
                      this.translate.instant(
                        'components.users.onNotDelete.plural',
                        { error: '' }
                      ),
                      { error: true }
                    );
                  } else {
                    this.snackBar.openSnackBar(
                      this.translate.instant(
                        'components.users.onNotDelete.singular',
                        { error: '' }
                      ),
                      { error: true }
                    );
                  }
                }
              }
            },
          });
      }
    });
  }

  /**
   * Handle click on user row.
   * Redirect to user page
   *
   * @param user user to see details of
   */
  onClick(user: User): void {
    this.router.navigate([user.id], { relativeTo: this.activatedRoute });
  }

  /**
   * Whether the number of selected elements matches the total number of rows.
   *
   * @returns True if it matches, else False
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.users.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  masterToggle(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isAllSelected()
      ? this.selection.clear()
      : this.users.forEach((row) => this.selection.select(row));
  }

  /**
   * Get the label for the checkbox on the passed row
   *
   * @param row The current row
   * @returns The label for the checkbox
   */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  /**
   * Export the list of users
   *
   * @param type The type of file we want ('csv' or 'xlsx')
   */
  async onExport(type: 'csv' | 'xlsx') {
    this.downloadService.getUsersExport(
      type,
      this.selection.selected.map((x) => x.id || '').filter((x) => x !== '')
    );
  }

  /**
   * Handles page event.
   *
   * @param e page event.
   */
  onPage(e: UIPageChangeEvent): void {
    const cachedData = handleTablePageEvent(e, this.pageInfo, this.cachedUsers);
    if (cachedData && cachedData.length === this.pageInfo.pageSize) {
      this.users = cachedData;
    } else {
      this.fetchUsers();
    }
  }

  /**
   * Update users query.
   *
   * @param refetch erase previous query results
   */
  private fetchUsers(refetch?: boolean): void {
    this.loading = true;
    const variables = {
      first: this.pageInfo.pageSize,
      afterCursor: refetch ? null : this.pageInfo.endCursor,
      filter: this.filter,
    };
    const cachedValues: UsersNodeQueryResponse = getCachedValues(
      this.apollo.client,
      GET_USERS,
      variables
    );
    if (refetch) {
      this.cachedUsers = [];
      this.pageInfo.pageIndex = 0;
    }
    if (cachedValues) {
      this.updateValues(cachedValues, false);
    } else {
      if (refetch) {
        // Rebuild the query
        this.usersQuery.refetch(variables);
      } else {
        // Fetch more records
        this.usersQuery
          .fetchMore({
            variables,
          })
          .then((results: ApolloQueryResult<UsersNodeQueryResponse>) => {
            this.updateValues(results.data, results.loading);
          });
      }
    }
  }

  /**
   * Updates local list with given data
   *
   * @param data New values to update forms
   * @param loading Loading state
   */
  private updateValues(data: UsersNodeQueryResponse, loading: boolean): void {
    const mappedValues = data.users.edges.map((x) => x.node);
    this.cachedUsers = updateQueryUniqueValues(this.cachedUsers, mappedValues);
    this.pageInfo.length = data.users.totalCount;
    this.pageInfo.endCursor = data.users.pageInfo.endCursor;
    this.users = this.cachedUsers.slice(
      this.pageInfo.pageSize * this.pageInfo.pageIndex,
      this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
    );
    this.loading = loading;
  }
}
