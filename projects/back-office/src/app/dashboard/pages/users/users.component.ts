import {Apollo} from 'apollo-angular';
import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { GetUsersQueryResponse, GET_USERS, GetRolesQueryResponse, GET_ROLES } from '../../../graphql/queries';
import { Role, User } from '@safe/builder';

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
  public roles: Role[] = [];
  public displayedColumns = ['username', 'name', 'oid', 'roles', 'actions'];

  constructor(
    private apollo: Apollo
  ) { }

  /*  Load the users
  */
  ngOnInit(): void {
    this.apollo.watchQuery<GetUsersQueryResponse>({
      query: GET_USERS
    }).valueChanges.subscribe(resUsers => {
      this.loading = true;
      this.users.data = resUsers.data.users;
      this.apollo.watchQuery<GetRolesQueryResponse>({
        query: GET_ROLES
      }).valueChanges.subscribe(resRoles => {
        this.roles = resRoles.data.roles;
        this.loading = resRoles.loading;
      });
    });
  }
}
