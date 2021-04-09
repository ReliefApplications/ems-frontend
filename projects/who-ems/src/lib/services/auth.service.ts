import {Apollo} from 'apollo-angular';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { GetProfileQueryResponse, GET_PROFILE } from '../graphql/queries';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountInfo, AuthenticationResult, EventMessage, EventType } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
/*  Auth service, using Msal service for Azure AD.
  Authentication and Authorization methods.
*/
export class WhoAuthService {

  // === LOGGED USER ===
  // tslint:disable-next-line: variable-name
  private _user = new BehaviorSubject<User | null>(null);
  public account: AccountInfo | null = null;

  // if we have the modal confirmation open on form builder we cannot logout until close modal
  public canLogout = new BehaviorSubject<boolean>(true);

  constructor(
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private apollo: Apollo
  ) {
    this.checkAccount();
    this.msalBroadcastService.msalSubject$.pipe(
      filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
    )
    .subscribe((res: EventMessage) => {
      const payload = res.payload as AuthenticationResult;
      console.log(payload);
      this.msalService.instance.setActiveAccount(payload.account);
      this.getProfile();
    });
    this.msalBroadcastService.msalSubject$.pipe(
      filter((msg: EventMessage) => msg.eventType === EventType.HANDLE_REDIRECT_START)
    )
    .subscribe((res: EventMessage) => {
      console.log(res);
      // const payload = res.payload as AuthenticationResult;
      // this.msalService.instance.setActiveAccount(payload.account);
      this.getProfile();
    });
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
    this.account = this.msalService.instance.getActiveAccount();
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
}
