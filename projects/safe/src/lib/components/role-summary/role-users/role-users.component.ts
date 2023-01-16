import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo, QueryRef } from 'apollo-angular';
import { Role, User } from '../../../models/user.model';
import { GetRoleQueryResponse, GET_ROLE_USERS } from './graphql/queries';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

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

  public users = new MatTableDataSource<User>([]);
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
    return !this.loading && this.users.data.length === 0;
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
      .subscribe((res) => {
        this.cachedUsers = res.data.role.users.edges.map((x) => x.node);
        this.users.data = this.cachedUsers.slice(
          this.pageInfo.pageSize * this.pageInfo.pageIndex,
          this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
        );
        this.pageInfo.length = res.data.role.users.totalCount;
        this.pageInfo.endCursor = res.data.role.users.pageInfo.endCursor;
        this.loading = res.loading;
        this.updating = false;
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
      e.length > this.cachedUsers.length
    ) {
      // Sets the new fetch quantity of data needed as the page size
      // If the fetch is for a new page the page size is used
      let first = e.pageSize;
      // If the fetch is for a new page size, the old page size is substracted from the new one
      if (e.pageSize > this.pageInfo.pageSize) {
        first -= this.pageInfo.pageSize;
      }
      this.pageInfo.pageSize = first;
      this.fetchUsers();
    } else {
      this.users.data = this.cachedUsers.slice(
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
    this.usersQuery.fetchMore({
      variables: {
        first: this.pageInfo.pageSize,
        afterCursor: this.pageInfo.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return Object.assign({}, prev, {
          role: {
            users: {
              edges: [
                ...prev.role.users.edges,
                ...fetchMoreResult.role.users.edges,
              ],
              pageInfo: fetchMoreResult.role.users.pageInfo,
              totalCount: fetchMoreResult.role.users.totalCount,
            },
          },
        });
      },
    });
  }
}
