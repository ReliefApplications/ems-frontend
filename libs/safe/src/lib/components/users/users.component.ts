import { Apollo, QueryRef } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';
import { Component, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import {
  User,
  Role,
  RolesQueryResponse,
  AddUsersMutationResponse,
  DeleteUsersMutationResponse,
} from '../../models/user.model';
import { DELETE_USERS, ADD_USERS } from './graphql/mutations';
import { SafeConfirmService } from '../../services/confirm/confirm.service';
import { SelectionModel } from '@angular/cdk/collections';
import { SafeDownloadService } from '../../services/download/download.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from '@oort-front/ui';
import { takeUntil, debounceTime } from 'rxjs';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { GET_USERS, GET_ROLES } from './graphql/queries';
import { GetUsersQueryResponse } from './graphql/queries';
import { UIPageChangeEvent } from '@oort-front/ui';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../utils/update-queries';

/** Default items per page for pagination. */
const ITEMS_PER_PAGE = 10;

/**
 * A component to display the list of users
 */
@Component({
  selector: 'safe-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class SafeUsersComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  public loading = true;
  public users = new Array<User>();
  public roles: Role[] = [];
  private usersQuery!: QueryRef<GetUsersQueryResponse>;
  public cachedUsers: User[] = [];

  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: '',
  };

  // === DISPLAYED COLUMNS ===
  public displayedColumns = [
    'select',
    'name',
    'username',
    'oid',
    'roles',
    'actions',
  ];

  // === FILTERS ===
  public filter: any = {
    filters: [],
    logic: 'and',
  };
  public searchText = '';
  public roleFilter = '';
  public showFilters = false;
  selection = new SelectionModel<User>(true, []);

  /**
   * Constructor of the users component
   *
   * @param apollo The apollo client
   * @param snackBar The snack bar service
   * @param dialog The Dialog service
   * @param downloadService The download service
   * @param confirmService The confirm service
   * @param translate The translation service
   * @param router Angular router
   * @param activatedRoute Angular active route
   */
  constructor(
    private apollo: Apollo,
    private snackBar: SnackbarService,
    public dialog: Dialog,
    private downloadService: SafeDownloadService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.usersQuery = this.apollo.watchQuery<GetUsersQueryResponse>({
      query: GET_USERS,
      variables: {
        first: ITEMS_PER_PAGE,
        afterCursor: null,
        filter: this.filter,
      },
    });
    this.usersQuery.valueChanges
      .pipe(debounceTime(2000), takeUntil(this.destroy$))
      .subscribe((resUsers) => {
        this.loading = true;
        this.updateValues(resUsers.data, resUsers.loading);
        this.apollo
          .watchQuery<RolesQueryResponse>({
            query: GET_ROLES,
          })
          .valueChanges.pipe(takeUntil(this.destroy$))
          .subscribe(({ data, loading }) => {
            this.roles = data.roles;
            this.loading = loading;
          });
      });
  }

  /**
   * Handles page event.
   *
   * @param e page event.
   */
  onPage(e: UIPageChangeEvent): void {
    this.pageInfo.pageIndex = e.pageIndex;
    // Checks if with new page/size more data needs to be fetched
    if (
      ((e.pageIndex > e.previousPageIndex &&
        e.pageIndex * this.pageInfo.pageSize >= this.cachedUsers.length) ||
        e.pageSize > this.pageInfo.pageSize) &&
      e.totalItems > this.cachedUsers.length
    ) {
      // Sets the new fetch quantity of data needed as the page size
      // If the fetch is for a new page the page size is used
      let first = e.pageSize;
      // If the fetch is for a new page size, the old page size is subtracted from the new one
      if (e.pageSize > this.pageInfo.pageSize) {
        first -= this.pageInfo.pageSize;
      }
      this.pageInfo.pageSize = first;
      this.fetchUsers();
    } else {
      this.users = this.cachedUsers.slice(
        e.pageSize * this.pageInfo.pageIndex,
        e.pageSize * (this.pageInfo.pageIndex + 1)
      );
    }
    this.pageInfo.pageSize = e.pageSize;
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
    const cachedValues: GetUsersQueryResponse = getCachedValues(
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
          .then((results: ApolloQueryResult<GetUsersQueryResponse>) => {
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
  private updateValues(data: GetUsersQueryResponse, loading: boolean): void {
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

  /**
   * Change page length on invite or delete users
   *
   * @param action action
   * @param value users modified.
   */
  public changePageLength(action: string, value: any) {
    if (action === 'add') {
      if (this.cachedUsers.length === this.pageInfo.length) {
        value.forEach((usr: any) => {
          this.cachedUsers = this.cachedUsers.concat([usr]);
        });
        this.users = this.cachedUsers.slice(
          ITEMS_PER_PAGE * this.pageInfo.pageIndex,
          ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
        );
      }
      this.pageInfo.length += value.length;
    } else {
      value.forEach((id: any) => {
        this.cachedUsers = this.cachedUsers.filter((x) => x.id !== id);
      });
      this.pageInfo.length -= value.length;
      this.users = this.cachedUsers.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex,
        ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
      );
    }
    // clear(evict) users query in cache
    this.apollo.client.cache.evict({
      id: 'ROOT_QUERY',
      fieldName: 'users',
    });
  }

  /**
   * Show a dialog for inviting someone
   */
  async onInvite(): Promise<void> {
    const { SafeInviteUsersComponent } = await import(
      './components/invite-users/invite-users.component'
    );
    const dialogRef = this.dialog.open(SafeInviteUsersComponent, {
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
                let alreadyInvited = false;
                // verify if users have already been invited
                this.users.forEach((usr: any) => {
                  data?.addUsers.forEach((usrData: any) => {
                    if (usrData.username === usr.username) {
                      alreadyInvited = true;
                    }
                  });
                });
                // if users have already been invited
                if (alreadyInvited) {
                  if (data?.addUsers.length && data?.addUsers.length > 1) {
                    this.snackBar.openSnackBar(
                      this.translate.instant(
                        'components.users.onAlreadyInvited.plural'
                      ),
                      { error: true }
                    );
                  } else {
                    this.snackBar.openSnackBar(
                      this.translate.instant(
                        'components.users.onAlreadyInvited.singular'
                      ),
                      { error: true }
                    );
                  }
                } else {
                  this.changePageLength('add', data?.addUsers);
                  if (data?.addUsers.length && data?.addUsers.length > 1) {
                    this.snackBar.openSnackBar(
                      this.translate.instant('components.users.onInvite.plural')
                    );
                  } else {
                    this.snackBar.openSnackBar(
                      this.translate.instant(
                        'components.users.onInvite.singular'
                      )
                    );
                  }
                }
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
   * Handle click on user row.
   * Redirect to user page
   *
   * @param user user to see details of
   */
  onClick(user: User): void {
    this.router.navigate([user.id], { relativeTo: this.activatedRoute });
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
                  this.changePageLength('delete', ids);
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
                  this.users = this.users.filter((u) => !ids.includes(u.id));
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
   * Filters users and updates table.
   *
   * @param filter filter event.
   */
  onFilter(filter: any): void {
    this.filter = filter;
    this.fetchUsers(true);
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
}
