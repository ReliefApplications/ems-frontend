import { Component, Input, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { SafeApplicationService } from '../../../../services/application/application.service';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../../components/utils/unsubscribe/unsubscribe.component';
import { Role, User } from '../../../../models/user.model';
import {
  GetApplicationUsersQueryResponse,
  GET_APPLICATION_USERS,
} from '../../graphql/queries';
import { updateQueryUniqueValues } from '../../../../utils/update-queries';
import { PositionAttributeCategory } from '../../../../models/position-attribute-category.model';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';
import { SafeConfirmService } from '../../../../services/confirm/confirm.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UIPageChangeEvent } from '@oort-front/ui';

/** Default number of items per request for pagination */
const DEFAULT_PAGE_SIZE = 10;

/**
 * Users list component.
 */
@Component({
  selector: 'safe-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() autoAssigned = false;

  public displayedColumns = [
    'select',
    'name',
    'username',
    'oid',
    'roles',
    'attributes',
    'actions',
  ];

  public users: Array<User> = new Array<User>();
  public cachedUsers: User[] = [];
  private usersQuery!: QueryRef<GetApplicationUsersQueryResponse>;
  @Input() roles: Role[] = [];
  @Input() positionAttributeCategories: PositionAttributeCategory[] = [];

  public loading = true;
  public updating = false;

  public pageInfo = {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    length: 0,
    endCursor: '',
  };

  /** @returns empty state of the table */
  get empty(): boolean {
    return !this.loading && this.users.length === 0;
  }

  public selection = new SelectionModel<User>(true, []);

  /**
   * Users list component
   *
   * @param apollo Apollo service
   * @param applicationService Shared application service
   * @param translate Translate service
   * @param confirmService Shared confirm service
   * @param router Angular router
   * @param route Angular activated route
   */
  constructor(
    private apollo: Apollo,
    private applicationService: SafeApplicationService,
    private translate: TranslateService,
    private confirmService: SafeConfirmService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.autoAssigned) {
      this.displayedColumns = this.displayedColumns.filter(
        (x) => x !== 'select'
      );
    }
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application) => {
        if (application) {
          this.usersQuery =
            this.apollo.watchQuery<GetApplicationUsersQueryResponse>({
              query: GET_APPLICATION_USERS,
              variables: {
                id: application.id,
                first: DEFAULT_PAGE_SIZE,
                automated: this.autoAssigned,
              },
            });
          this.usersQuery.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ data, loading }) => {
              this.updateValues(data, loading);
            });
        }
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
   * Fetch more users
   *
   * @param refetch erase previous query results
   */
  fetchUsers(refetch?: boolean): void {
    this.updating = true;
    if (refetch) {
      this.cachedUsers = [];
      this.pageInfo.pageIndex = 0;
      this.usersQuery.refetch({
        first: this.pageInfo.pageSize,
        afterCursor: null,
      });
    } else {
      this.usersQuery
        .fetchMore({
          variables: {
            first: this.pageInfo.pageSize,
            afterCursor: this.pageInfo.endCursor,
          },
        })
        .then((results) => this.updateValues(results.data, results.loading));
    }
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
   * Show a dialog to confirm the deletion of users
   *
   * @param users The list of users to delete
   */
  onDelete(users: User[]): void {
    if (!this.autoAssigned) {
      const title = this.translate.instant('common.deleteObject', {
        name:
          users.length < 1
            ? this.translate.instant('common.user.few')
            : this.translate.instant('common.user.one'),
      });
      // TODO
      const content = this.translate.instant(
        'components.user.delete.confirmationMessage',
        {
          name: users[0].username,
        }
      );
      const dialogRef = this.confirmService.openConfirmModal({
        title,
        content,
        confirmText: this.translate.instant('components.confirmModal.delete'),
        confirmVariant: 'danger',
      });
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          if (value) {
            const ids = users.map((u) => u.id);
            this.loading = true;
            this.selection.clear();
            this.applicationService.deleteUsersFromApplication(ids, () =>
              this.fetchUsers(true)
            );
          }
        });
    }
  }

  /**
   * Handle click on user row.
   * Redirect to user page
   *
   * @param user user to see details of
   */
  onClick(user: User): void {
    this.router.navigate([`./${user.id}`], { relativeTo: this.route });
  }

  /**
   * Update user data value
   *
   * @param data query response data
   * @param loading loading status
   */
  private updateValues(
    data: GetApplicationUsersQueryResponse,
    loading: boolean
  ) {
    const mappedValues = data.application.users.edges.map((x) => x.node);
    this.cachedUsers = updateQueryUniqueValues(this.cachedUsers, mappedValues);

    this.pageInfo.length = data.application.users.totalCount;
    this.pageInfo.endCursor = data.application.users.pageInfo.endCursor;
    this.users = this.cachedUsers.slice(
      this.pageInfo.pageSize * this.pageInfo.pageIndex,
      this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
    );
    this.loading = loading;
    this.updating = false;
  }
}
