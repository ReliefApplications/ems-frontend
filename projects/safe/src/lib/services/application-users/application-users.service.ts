import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { SafeSnackBarService } from '../snackbar/snackbar.service';
import {
  AddUsersMutationResponse,
  ADD_USERS,
  DeleteUsersFromApplicationMutationResponse,
  DELETE_USERS_FROM_APPLICATION,
} from './graphql/mutations';
import {
  GET_APPLICATION_AUTO_USERS,
  GET_APPLICATION_USERS,
  GetApplicationUserQueryResponse,
} from './graphql/queries';

/** Initial page info */
const INIT_PAGE_INFO = {
  users: {
    endCursor: '',
    hasNextPage: true,
  },
  autoAssignedUsers: {
    endCursor: '',
    hasNextPage: true,
  },
};

/** Default number of users to fetch */
const DEFAULT_FIRST = 1;

/** Service that handles users inside an application */
@Injectable({
  providedIn: 'root',
})
export class SafeApplicationUsersService {
  private application: string | null = null;
  private users = new BehaviorSubject<User[]>([]);
  /** @returns Current application as observable */
  get users$(): Observable<User[]> {
    return this.users.asObservable();
  }

  private autoAssignedUsers = new BehaviorSubject<User[]>([]);
  /** @returns Current application as observable */
  get autoAssignedUsers$(): Observable<User[]> {
    return this.autoAssignedUsers.asObservable();
  }

  /** Page info for both type of users */
  private pageInfo = INIT_PAGE_INFO;

  /**
   * Get the page info for the manual users
   *
   * @returns the page info for the manual users
   */
  public getManualPageInfo(): { endCursor: string; hasNextPage: boolean } {
    return this.pageInfo.users;
  }

  /**
   * Get the page info for the auto-assigned users
   *
   * @returns the page info for the auto-assigned users
   */
  public getAutoPageInfo(): { endCursor: string; hasNextPage: boolean } {
    return this.pageInfo.autoAssignedUsers;
  }

  /** Gets next page of manual users */
  public getMoreManualUsers(): void {
    this.getNextUsersPage('users');
  }

  /** Gets next page of auto users */
  public getMoreAutoUsers(): void {
    this.getNextUsersPage('autoAssignedUsers');
  }

  /**
   * Service that handles users inside an application
   *
   * @param apollo Apollo client
   * @param snackBar Snack bar service
   * @param translate Translation service
   */
  constructor(
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService
  ) {}

  /** Clears all users and page info */
  public clearUsers(): void {
    this.users.next([]);
    this.autoAssignedUsers.next([]);
    this.pageInfo = INIT_PAGE_INFO;
    this.application = null;
  }

  /**
   * Initializes the service with the application id
   *
   * @param application application id
   */
  public init(application: string): void {
    this.application = application;
    this.getMoreManualUsers();
    this.getMoreAutoUsers();

    // TEST FOR GETTING SECOND PAGE
    setTimeout(() => {
      this.getMoreManualUsers();
    }, 2000);
  }

  /**
   * Fetches the next page of users for the current application
   *
   * @param type Type of users to fetch
   * @param first Number of users to fetch
   */
  private async getNextUsersPage(
    type: 'users' | 'autoAssignedUsers',
    first?: number
  ): Promise<void> {
    if (!this.application) {
      return;
    }

    // if there is no next page, do nothing
    const pageInfo = this.pageInfo[type];
    if (!pageInfo.hasNextPage) {
      return;
    }

    first = first || DEFAULT_FIRST;

    const res = await this.apollo
      .query<GetApplicationUserQueryResponse>({
        query:
          type === 'users' ? GET_APPLICATION_USERS : GET_APPLICATION_AUTO_USERS,
        variables: {
          id: this.application,
          afterCursor: pageInfo.endCursor || undefined,
          first,
        },
      })
      .toPromise();

    if (res.data) {
      const users = res.data.application[type]?.edges?.map((x) => x.node) || [];
      const newPageInfo = res.data.application[type]?.pageInfo;
      this.pageInfo[type] = {
        endCursor: newPageInfo?.endCursor || '',
        hasNextPage: newPageInfo?.hasNextPage || false,
      };
      const currentUsers = this.users.getValue();

      this[type].next([...currentUsers, ...users]);
    }
  }

  /**
   * Deletes users of the opened application. Users are only removed from the application, but are still active.
   *
   * @param application application id
   * @param ids user ids to remove
   */
  public async removeUsers(application: string, ids: any[]): Promise<void> {
    const res = await this.apollo
      .mutate<DeleteUsersFromApplicationMutationResponse>({
        mutation: DELETE_USERS_FROM_APPLICATION,
        variables: {
          ids,
          application,
        },
      })
      .toPromise();

    if (res.data) {
      const deletedUsers = res.data.deleteUsersFromApplication.map((x) => x.id);
      const users = this.users.getValue();
      this.users.next(users.filter((x) => !deletedUsers.includes(x.id)));

      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectDeleted', {
          value: this.translate
            .instant(
              deletedUsers.length > 1 ? 'common.user.few' : 'common.user.one'
            )
            .toLowerCase(),
        })
      );
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectNotDeleted', {
          value: this.translate
            .instant(ids.length > 1 ? 'common.user.few' : 'common.user.one')
            .toLowerCase(),
          error: '',
        }),
        { error: true }
      );
    }
  }

  /**
   * Invites an user to the application.
   *
   * @param application application id
   * @param users users to be added to application (GraphQL UserInputType)
   */
  async addUser(application: string, users: any): Promise<void> {
    const res = await this.apollo
      .mutate<AddUsersMutationResponse>({
        mutation: ADD_USERS,
        variables: {
          users,
          application,
        },
      })
      .toPromise();
    if (!res.errors) {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectInvited', {
          name: this.translate
            .instant(
              res.data?.addUsers.length ? 'common.user.few' : 'common.user.one'
            )
            .toLowerCase(),
        })
      );
      this.users.next(this.users.getValue().concat(res.data?.addUsers || []));
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectNotInvited', {
          name: this.translate
            .instant(
              res.data?.addUsers.length ? 'common.user.few' : 'common.user.one'
            )
            .toLowerCase(),
        }),
        { error: true }
      );
    }
  }

  /**
   * Updates an user that has access to the application.
   *
   * @param newUserValue new user value
   */
  updateUser(newUserValue: User): void {
    const users = this.users.getValue();
    const index = users.findIndex((x) => x.id === newUserValue.id);
    if (index > -1) {
      users[index] = newUserValue;
      this.users.next(users);
    }
  }
}
