import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { GET_USERS, GET_ROLES } from './graphql/queries';
import {
  Role,
  RolesQueryResponse,
  User,
  UsersQueryResponse,
} from '@oort-front/shared';

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
  /**
   * Loading state
   */
  public loading = true;
  /**
   * Users list
   */
  public users = new Array<User>();
  /**
   * Roles list
   */
  public roles: Role[] = [];
  /**
   * Columns to display
   */
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
      .watchQuery<UsersQueryResponse>({
        query: GET_USERS,
      })
      .valueChanges.subscribe((resUsers) => {
        this.loading = true;
        this.users = resUsers.data.users;
        this.apollo
          .watchQuery<RolesQueryResponse>({
            query: GET_ROLES,
          })
          .valueChanges.subscribe(({ data, loading }) => {
            this.roles = data.roles;
            this.loading = loading;
          });
      });
  }
}
