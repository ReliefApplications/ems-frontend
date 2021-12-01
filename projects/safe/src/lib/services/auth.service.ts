import {Apollo} from 'apollo-angular';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Account } from 'msal';
import { MsalService } from '@azure/msal-angular';

import { GetProfileQueryResponse, GET_PROFILE } from '../graphql/queries';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/*  Auth service, using Msal service for Azure AD.
  Authentication and Authorization methods.
*/
export class SafeAuthService {

  // === LOGGED USER ===
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-denylist, id-match
  private _user = new BehaviorSubject<User | null>(null);
  public account: Account | null = null;

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
    const user = this._user.getValue();
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
      this.getProfile();
      return false;
    }
  }

  /*  Check if user is admin.
    If user profile is empty, try to get it.
  */
  get userIsAdmin(): boolean {
    const user = this._user.getValue();
    if (user) {
      return user.isAdmin || false;
    } else {
      this.getProfile();
      return false;
    }
  }

  /*  Clean user profile, and logout.
  */
  logout(): void {
    this.msalService.logout();
    this.account = null;
    this._user.next(null);
  }

  /*  Get the Azure AD profile.
  */
  checkAccount(): void {
    this.account = this.msalService.getAccount();
  }

  /*  Get the profile from the database, using GraphQL.
  */
  getProfile(): void {
    this.apollo.query<GetProfileQueryResponse>({
      query: GET_PROFILE,
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }).subscribe(
      res => {
        this._user.next(res.data.me);
      }
    );
  }

  /*  Return the user as an Observable.
  */
  get user(): Observable<User | null> {
    return this._user.asObservable();
  }

  /* Return the logged user value.
  */
  get userValue(): User | null {
    return this._user.getValue();
  }

  /* Check if user exist and fetch it if not
  */
  getProfileIfNull(): void {
    const user = this._user.getValue();
    if (!user) {
      this.getProfile();
    }
  }

  /* Check if account exist and fetch it if not
  */
  getAccountIfNull(): void {
    if (!this.account) {
      this.checkAccount();
    }
  }

}
