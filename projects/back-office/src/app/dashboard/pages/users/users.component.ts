import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import {
  GetUsersQueryResponse,
  GET_USERS,
  GetRolesQueryResponse,
  GET_ROLES,
} from '../../../graphql/queries';
import { Role, User } from '@safe/builder';
import { PageEvent } from '@angular/material/paginator';

/** Default amount of users per page in the table */
const DEFAULT_PAGE_SIZE = 10;

/**
 * Accessible with '/settings/users' route.
 * Management of users.
 */
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  // === DATA ===
  public loading = true;
  private usersQuery!: QueryRef<GetUsersQueryResponse>;
  private cachedUsers: User[] = [];
  public users = new MatTableDataSource<User>([]);
  public roles: Role[] = [];
  public displayedColumns = ['name', 'username', 'oid', 'roles', 'actions'];

  public pageInfo = {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    length: 0,
    endCursor: '',
  };

  /**
   * Users page.
   *
   * @param apollo Apollo service
   */
  constructor(private apollo: Apollo) {}

  /** Load the users */
  ngOnInit(): void {
    this.usersQuery = this.apollo.watchQuery<GetUsersQueryResponse>({
      query: GET_USERS,
      variables: {
        first: DEFAULT_PAGE_SIZE,
      },
    });

    this.usersQuery.valueChanges.subscribe((resUsers) => {
      this.cachedUsers.push(...resUsers.data.users.edges.map((x) => x.node));
      this.users.data = this.cachedUsers.slice(
        this.pageInfo.pageSize * this.pageInfo.pageIndex,
        this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
      );
      this.pageInfo.length = resUsers.data.users.totalCount;
      this.pageInfo.endCursor = resUsers.data.users.pageInfo.endCursor;
      this.loading = false;
    });

    this.apollo
      .watchQuery<GetRolesQueryResponse>({
        query: GET_ROLES,
      })
      .valueChanges.subscribe((resRoles) => {
        this.roles = resRoles.data.roles;
        this.loading = resRoles.loading;
      });
  }

  /**
   * Handles page event.
   *
   * @param e page event.
   */
  onPage(e: PageEvent): void {
    this.pageInfo.pageIndex = e.pageIndex;

    let numNeeded = 0;
    // page size change
    if (this.pageInfo.pageSize !== e.pageSize) {
      const loadedRows = this.cachedUsers.length;
      const lastRow = e.pageSize * (this.pageInfo.pageIndex + 1);
      this.pageInfo.pageSize = e.pageSize;

      numNeeded = Math.min(lastRow - loadedRows, e.length - loadedRows);
    }

    // checks if is next page event and data isn't cached
    if (
      e.previousPageIndex !== undefined &&
      e.pageIndex > e.previousPageIndex &&
      e.length > this.cachedUsers.length &&
      this.pageInfo.pageSize * this.pageInfo.pageIndex >=
        this.cachedUsers.length
    ) {
      this.loading = true;
      this.usersQuery.refetch({
        first: this.pageInfo.pageSize,
        afterCursor: this.pageInfo.endCursor,
      });
    }
    // page size changed and there isn't enough data cached
    else if (numNeeded > 0) {
      this.loading = true;
      this.usersQuery.refetch({
        first: numNeeded,
        afterCursor: this.pageInfo.endCursor,
      });
    } else {
      this.users.data = this.cachedUsers.slice(
        this.pageInfo.pageSize * this.pageInfo.pageIndex,
        this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
      );
    }
  }
}
