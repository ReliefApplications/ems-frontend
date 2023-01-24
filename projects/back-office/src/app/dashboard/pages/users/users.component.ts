import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';

import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import {
  GetUsersQueryResponse,
  GET_USERS,
  GetRolesQueryResponse,
  GET_ROLES,
} from './graphql/queries';
import { Role, User } from '@safe/builder';

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
export class UsersComponent implements OnInit {
  // === DATA ===
  public loading = true;
  public users = new MatTableDataSource<User>([]);
  public roles: Role[] = [];
  public displayedColumns = ['name', 'username', 'oid', 'roles', 'actions'];

  /**
   * UsersComponent constructor.
   *
   * @param apollo Used to load the users.
   */
  constructor(private apollo: Apollo) {}

  /** Load the users */
  ngOnInit(): void {
    this.apollo
      .watchQuery<GetUsersQueryResponse>({
        query: GET_USERS,
      })
      .valueChanges.subscribe((resUsers) => {
        this.loading = true;
        this.users.data = resUsers.data.users;
        this.apollo
          .watchQuery<GetRolesQueryResponse>({
            query: GET_ROLES,
          })
          .valueChanges.subscribe(({ data, loading }) => {
            this.roles = data.roles;
            this.loading = loading;
          });
      });
  }
}
