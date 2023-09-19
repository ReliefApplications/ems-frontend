import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import {
  GetUsersQueryResponse,
  GET_USERS,
  GetRolesQueryResponse,
  GET_ROLES,
} from './graphql/queries';
import { Role, User } from '@oort-front/safe';
import { UIPageChangeEvent } from '@oort-front/ui';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../../../utils/update-queries';
import { ApolloQueryResult } from '@apollo/client';
import { SafeUnsubscribeComponent } from '@oort-front/safe';
import { takeUntil } from 'rxjs/operators';

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
export class UsersComponent extends SafeUnsubscribeComponent implements OnInit {
  // === DATA ===
  public loading = true;
  public users = new Array<User>();
  public roles: Role[] = [];
  public displayedColumns = ['name', 'username', 'oid', 'roles', 'actions'];
  private usersQuery!: QueryRef<GetUsersQueryResponse>;
  public cachedUsers: User[] = [];

  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: '',
  };

  /**
   * UsersComponent constructor.
   *
   * @param apollo Used to load the users.
   */
  constructor(private apollo: Apollo) {
    super();
  }

  /** Load the users */
  ngOnInit(): void {
    this.usersQuery = this.apollo.watchQuery<GetUsersQueryResponse>({
      query: GET_USERS,
      variables: {
        first: ITEMS_PER_PAGE,
        afterCursor: null,
      },
    });
    this.usersQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((resUsers) => {
        this.loading = true;
        this.updateValues(resUsers.data, resUsers.loading);
        this.apollo
          .watchQuery<GetRolesQueryResponse>({
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
      // If the fetch is for a new page size, the old page size is substracted from the new one
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
   * Change page lenght on invite or delete users
   *
   * @param e lenght of users added.
   */
  public changePageLength(e: any) {
    this.pageInfo.length += parseInt(e);
  }
}
