import {Apollo} from 'apollo-angular';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { MsalService } from '@azure/msal-angular';
import { GetProfileQueryResponse, GET_PROFILE } from '../graphql/queries';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountInfo } from '@azure/msal-common';
import { ApolloQueryResult } from '@apollo/client';

/**
 * Shared authentication service.
 */
@Injectable({
  providedIn: 'root'
})
export class SafeAuthService {

  /** Current user */
  public user = new BehaviorSubject<User | null>(null);
  /** Current user as observable */
  get user$(): Observable<User | null> {
    return this.user.asObservable();
  }
  /** Current account info */
  public account: AccountInfo | null = null;
  /** Current user value */
  get userValue(): User | null {
    return this.user.getValue();
  }
  /** if we have the modal confirmation open on form builder we cannot logout until close modal */
  public canLogout = new BehaviorSubject<boolean>(true);

  /**
   * Shared authentication service.
   *
   * @param msalService MSAL service
   * @param apollo Apollo client
   */
  constructor(
    private msalService: MsalService,
    private apollo: Apollo
  ) {
    this.checkAccount();
  }

  /**
   * Checkes if user has permission.
   * If user profile is empty, tries to get it.
   *
   * @param permission permission.s required
   * @param global is the permission global or not
   * @returns Does the user have access
   */
  userHasClaim(permission: string | string[], global: boolean = true): boolean {
    const user = this.user.getValue();
    if (user) {
      if (user.permissions && (!permission || user.permissions.find(x => {
        if (Array.isArray(permission)) {
          return x.type && permission.includes(x.type) && x.global === global;
        } else {
          return x.type === permission && x.global === global;
        }
      }))) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }

  /**
   * Checkes if user is admin.
   * If user profile is empty, tries to get it.
   */
  get userIsAdmin(): boolean {
    const user = this.user.getValue();
    if (user) {
      return user.isAdmin || false;
    } else {
      return false;
    }
  }

  /**
   * Cleans user profile, and logout.
   */
  logout(): void {
    this.msalService.logoutRedirect();
    this.account = null;
    this.user.next(null);
  }

  /**
   * Gets the Azure AD profile.
   */
  checkAccount(): void {
    this.account = this.msalService.instance.getActiveAccount();
  }

  /**
   * Gets the profile from the database, using GraphQL.
   *
   * @returns Apollo query of profile
   */
  getProfile(): Observable<ApolloQueryResult<GetProfileQueryResponse>> {
    return this.apollo.query<GetProfileQueryResponse>({
      query: GET_PROFILE,
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    });
  }
}
