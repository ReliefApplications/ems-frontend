import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Account } from 'msal';
import { MsalService } from '@azure/msal-angular';
import { Apollo } from 'apollo-angular';
import { GetProfileQueryResponse, GET_PROFILE } from '../graphql/queries';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/*  Auth service, using Msal service for Azure AD.
  Authentication and Authorization methods.
*/
export class WhoAuthService {

  // === LOGGED USER ===
  // tslint:disable-next-line: variable-name
  private _user = new BehaviorSubject<User>(null);
  public account: Account;

  constructor(
    private msalService: MsalService,
    private apollo: Apollo
  ) {
    this.checkAccount();
    this.getProfile();
  }

  /*  Check if user has permission.
    If user profile is empty, try to get it.
  */
  userHasClaim(permission: string): boolean {
    const user = this._user.getValue();
    if (user) {
      if (user.permissions && (!permission || user.permissions.find(x => x.type === permission))) {
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
      return user.isAdmin;
    } else {
      this.getProfile();
      return false;
    }
  }

  /*  Clean user profile, and logout.
  */
  logout(): void {
    this.msalService.logout();
    this._user.next(null);
  }

  /*  Get the Azure AD profile.
  */
  checkAccount(): void {
    this.account = this.msalService.getAccount();
  }

  /*  Get the profile from the database, using GraphQL.
  */
  private getProfile(): void {
    this.apollo.watchQuery<GetProfileQueryResponse>({
      query: GET_PROFILE
    }).valueChanges.subscribe(res => {
      this._user.next(res.data.me);
    });
  }

  /*  Return the user as an Observable.
  */
  get user(): Observable<User> {
    return this._user.asObservable();
  }
}
