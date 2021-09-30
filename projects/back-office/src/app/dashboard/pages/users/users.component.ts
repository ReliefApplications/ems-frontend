import {Apollo, QueryRef} from 'apollo-angular';
import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import {GetUsersQueryResponse, GET_USERS, GetRolesQueryResponse, GET_ROLES, GetApplicationsQueryResponse} from '../../../graphql/queries';
import { Role, User } from '@safe/builder';

const ITEMS_PER_PAGE = 10;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
/*  Accessible with '/settings/users' route.
  Managelent of users.
*/
export class UsersComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public users = new MatTableDataSource<User>([]);
  private usersQuery!: QueryRef<GetUsersQueryResponse>;
  public cachedUsers: User[] = [];
  public roles: Role[] = [];
  public displayedColumns = ['username', 'name', 'oid', 'roles', 'actions'];

  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: ''
  };

  constructor(
    private apollo: Apollo
  ) { }

  /*  Load the users
  */
  ngOnInit(): void {
    this.usersQuery = this.apollo.watchQuery<GetUsersQueryResponse>({
      query: GET_USERS,
      variables: {
        first: ITEMS_PER_PAGE
      }
    });

    this.usersQuery.valueChanges.subscribe(res => {
      this.cachedUsers = res.data.users.edges.map(x => x.node);
      // line below useless?
      this.users.data = this.cachedUsers.slice( ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
      this.pageInfo.length = res.data.users.totalCount;
      this.pageInfo.endCursor = res.data.users.pageInfo.endCursor;
      this.loading = res.loading;

      this.apollo.watchQuery<GetRolesQueryResponse>({
        query: GET_ROLES
      }).valueChanges.subscribe(resRoles => {
        this.roles = resRoles.data.roles;
        this.loading = resRoles.loading;
      });
    });
  }

  onPage(e: any): void {
    this.pageInfo.pageIndex = e.pageIndex;
    if (e.pageIndex > e.previousPageIndex && e.length > this.cachedUsers.length) {
      this.usersQuery.fetchMore({
        variables: {
          first: ITEMS_PER_PAGE,
          afterCursor: this.pageInfo.endCursor
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) { return prev; }
          return Object.assign({}, prev, {
            users: {
              edges: [...prev.users.edges, ...fetchMoreResult.users.edges],
              pageInfo: fetchMoreResult.users.pageInfo,
              totalCount: fetchMoreResult.users.totalCount
            }
          });
        }
      });
    } else {
      this.users.data = this.cachedUsers.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
    }
  }
}
