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
export class UsersComponent implements OnInit {
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
  constructor(private apollo: Apollo) {}

  /** Load the users */
  ngOnInit(): void {
    this.apollo
      .watchQuery<GetUsersQueryResponse>({
        query: GET_USERS,
        variables: {
          first: ITEMS_PER_PAGE,
          afterCursor: this.pageInfo.endCursor,
        },
      })
      .valueChanges.subscribe((resUsers) => {
        this.loading = true;
        console.log(resUsers.data.users);
        this.users = [];
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

  /**
   * Handles page event.
   *
   * @param e page event.
   */
  onPage(e: UIPageChangeEvent): void {
    // this.pageInfo.pageIndex = e.pageIndex;
    // // Checks if with new page/size more data needs to be fetched
    // if (
    //   ((e.pageIndex > e.previousPageIndex &&
    //     e.pageIndex * this.pageInfo.pageSize >=
    //       this.cachedApiConfigurations.length) ||
    //     e.pageSize > this.pageInfo.pageSize) &&
    //   e.totalItems > this.cachedApiConfigurations.length
    // ) {
    //   // Sets the new fetch quantity of data needed as the page size
    //   // If the fetch is for a new page the page size is used
    //   let first = e.pageSize;
    //   // If the fetch is for a new page size, the old page size is subtracted from the new one
    //   if (e.pageSize > this.pageInfo.pageSize) {
    //     first -= this.pageInfo.pageSize;
    //   }
    //   this.pageInfo.pageSize = first;
    //   this.fetchApiConfigurations();
    // } else {
    //   this.dataSource = this.cachedApiConfigurations.slice(
    //     e.pageSize * this.pageInfo.pageIndex,
    //     e.pageSize * (this.pageInfo.pageIndex + 1)
    //   );
    //   this.filteredDataSources = this.dataSource;
    // }
    // this.pageInfo.pageSize = e.pageSize;
  }
}
