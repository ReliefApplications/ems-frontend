import { Component, Input, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Role, User } from '../../../models/user.model';
import { GetRoleQueryResponse, GET_ROLE_USERS } from './graphql/queries';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { updateQueryUniqueValues } from '../../../utils/update-queries';
import { UIPageChangeEvent } from '@oort-front/ui';

/** Default number of items per request for pagination */
const DEFAULT_PAGE_SIZE = 10;

/**
 * Users component for role summary.
 */
@Component({
  selector: 'safe-role-users',
  templateUrl: './role-users.component.html',
  styleUrls: ['./role-users.component.scss'],
})
export class RoleUsersComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() role!: Role;
  @Input() autoAssigned = false;
  public loading = true;
  public updating = false;

  public displayedColumns = ['name', 'username'];

  public users = new Array<User>();
  public cachedUsers: User[] = [];
  private usersQuery!: QueryRef<GetRoleQueryResponse>;

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

  /**
   * Users component for role summary
   *
   * @param apollo apollo client
   */
  constructor(private apollo: Apollo) {
    super();
  }

  ngOnInit(): void {
    this.usersQuery = this.apollo.watchQuery<GetRoleQueryResponse>({
      query: GET_ROLE_USERS,
      variables: {
        id: this.role.id,
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
   */
  private fetchUsers(): void {
    this.updating = true;
    this.usersQuery
      .fetchMore({
        variables: {
          first: this.pageInfo.pageSize,
          afterCursor: this.pageInfo.endCursor,
        },
      })
      .then((results) => this.updateValues(results.data, results.loading));
  }

  /**
   *  Update users data value
   *
   * @param data query response data
   * @param loading loading status
   */
  private updateValues(data: GetRoleQueryResponse, loading: boolean) {
    const mappedValues = data.role.users?.edges.map((x) => x.node) ?? [];
    this.cachedUsers = updateQueryUniqueValues(this.cachedUsers, mappedValues);
    this.pageInfo.length = data.role.users.totalCount;
    this.pageInfo.endCursor = data.role.users.pageInfo.endCursor;
    this.users = this.cachedUsers.slice(
      this.pageInfo.pageSize * this.pageInfo.pageIndex,
      this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
    );
    this.loading = loading;
    this.updating = false;
  }
}
