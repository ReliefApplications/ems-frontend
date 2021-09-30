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

    console.log('before sub');

    this.usersQuery.valueChanges.subscribe(resUsers => {
      console.log('in');
      console.log('resUsers');
      console.log(resUsers);
      this.loading = true;

      this.cachedUsers = resUsers.data.users;
      this.users.data = this.cachedUsers.slice( ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
      console.log('this.cachedUsers');
      console.log(this.cachedUsers);

      this.pageInfo.length = resUsers.data.users.length;

      this.apollo.watchQuery<GetRolesQueryResponse>({
        query: GET_ROLES
      }).valueChanges.subscribe(resRoles => {
        this.roles = resRoles.data.roles;
        this.loading = resRoles.loading;
      });
    });

    // this.usersQuery.valueChanges.subscribe(res => {
    //   this.cachedUsers = res.data.users;
    //   this.users.data = this.cachedUsers.slice( ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
    //   console.log('this.cachedUsers');
    //   console.log(this.cachedUsers);
    //   console.log('this.users.data');
    //   console.log(this.users.data);
    // });
  }

  onPage(e: any): void {
    console.log('e');
    console.log(e);
    console.log(this.usersQuery);
    // if (e.pageIndex > e.previousPageIndex && e.length > this.cachedUsers.length) {
    //   this.usersQuery.fetchMore({
    //     variables: {
    //       first: ITEMS_PER_PAGE,
    //       afterCursor: this.pageInfo.endCursor
    //     },
    //     updateQuery: (prev, { fetchMoreResult }) => {
    //       if (!fetchMoreResult) { return prev; }
    //       return Object.assign({}, prev, {
    //         applications: {
    //           edges: [...prev.applications.edges, ...fetchMoreResult.applications.edges],
    //           pageInfo: fetchMoreResult.applications.pageInfo,
    //           totalCount: fetchMoreResult.applications.totalCount
    //         }
    //       });
    //     }
    //   });
    // } else {
    //   this.applications.data = this.cachedApplications.slice(
    //     ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
    // }
  }
}
