import {Apollo} from 'apollo-angular';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { MsalService } from '@azure/msal-angular';
import { GetProfileQueryResponse, GET_PROFILE } from '../graphql/queries';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AccountInfo } from '@azure/msal-common';
import { ApolloQueryResult } from '@apollo/client';

@Injectable({
  providedIn: 'root'
})
/*  Auth service, using Msal service for Azure AD.
  Authentication and Authorization methods.
*/
export class SafeAuthService {

  // === LOGGED USER ===
  public user = new BehaviorSubject<User | null>(null);
  public account: AccountInfo | null = null;

  // if we have the modal confirmation open on form builder we cannot logout until close modal
  public canLogout = new BehaviorSubject<boolean>(true);

  constructor(
    private msalService: MsalService,
    private apollo: Apollo
  ) {
    this.checkAccount();
  }

  /*  Check if user has permission.
    If user profile is empty, try to get it.
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

  /*  Check if user is admin.
    If user profile is empty, try to get it.
  */
  get userIsAdmin(): boolean {
    const user = this.user.getValue();
    if (user) {
      return user.isAdmin || false;
    } else {
      return false;
    }
  }

  /*  Clean user profile, and logout.
  */
  logout(): void {
    this.msalService.logout();
    this.account = null;
    this.user.next(null);
  }

  /*  Get the Azure AD profile.
  */
  checkAccount(): void {
    this.account = this.msalService.instance.getActiveAccount();
  }

  /*  Get the profile from the database, using GraphQL.
  */
  getProfile(): Observable<ApolloQueryResult<GetProfileQueryResponse>> {
    return this.apollo.query<GetProfileQueryResponse>({
      query: GET_PROFILE,
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    });
  }

  /*  Return the user as an Observable.
  */
  get user$(): Observable<User | null> {
    return this.user.asObservable();
  }

  /* Return the logged user value.
  */
  get userValue(): User | null {
    return this.user.getValue();
  }

  /* Check if account exist and fetch it if not
  */
  getAccountIfNull(): void {
    if (!this.account) {
      this.checkAccount();
    }
  }
}
