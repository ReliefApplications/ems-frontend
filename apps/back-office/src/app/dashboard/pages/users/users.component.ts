import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { GET_USERS, GET_ROLES, GetUsersQueryResponse } from './graphql/queries';
import { Role, RolesQueryResponse, User } from '@oort-front/safe';
import { UIPageChangeEvent } from '@oort-front/ui';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../../../utils/update-queries';
import { ApolloQueryResult } from '@apollo/client';
import { SafeUnsubscribeComponent } from '@oort-front/safe';
import { debounceTime, takeUntil } from 'rxjs/operators';

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

  // === FILTERING ===
  public filter: any = {
    filters: [],
    logic: 'and',
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
   * @param e lenght of users added.
   */
  public changePageLength(e: any) {
    if (e.op === 'add') {
      if (this.cachedUsers.length === this.pageInfo.length) {
        e.data.forEach((usr: any) => {
          this.cachedUsers = this.cachedUsers.concat([usr]);
        });
        this.users = this.cachedUsers.slice(
          ITEMS_PER_PAGE * this.pageInfo.pageIndex,
          ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
        );
      }
      this.pageInfo.length += e.data.length;
    } else {
      e.data.forEach((id: any) => {
        this.cachedUsers = this.cachedUsers.filter((x) => x.id !== id);
      });
      this.pageInfo.length -= e.data.length;
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
   * Change filter when filter change
   *
   * @param e event
   */
  public onFilterChange(e: any) {
    // if the filter is for role
    if (e.column === 'role') {
      // if the filter is empty it's removed
      if (e.event === '' || e.event === null) {
        this.filter.filters = this.filter.filters.filter(
          (filter: any) => filter.field !== 'roles'
        );
      } else {
        let foundRole = false;
        // update filter if it exists
        this.filter.filters.forEach((f: any) => {
          if (f.field === 'roles') {
            f.value = e.event;
            foundRole = true;
          }
        });
        // if doesn't exists it's created a new one
        if (!foundRole) {
          this.filter.filters.push({
            field: 'roles',
            operator: 'eq',
            value: e.event,
          });
        }
      }
      // if the filter is for name
    } else if (e.column === 'search') {
      // if the filter is empty it's removed
      if (e.event === '' || e.event === null) {
        this.filter.filters = this.filter.filters.filter(
          (filter: any) => filter.field !== 'name'
        );
      } else {
        let foundName = false;
        // update filter if it exists
        this.filter.filters.forEach((f: any) => {
          if (f.field === 'name') {
            f.value = e.event;
            foundName = true;
          }
        });
        // if doesn't exists we create a new one
        if (!foundName) {
          this.filter.filters.push({
            field: 'name',
            operator: 'contains',
            value: e.event,
          });
        }
      }
    } else {
      // clear filters
      this.filter.filters = [];
    }
    this.fetchUsers(true);
  }
}
