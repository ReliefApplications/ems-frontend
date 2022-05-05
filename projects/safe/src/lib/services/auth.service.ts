import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { GetProfileQueryResponse, GET_PROFILE } from '../graphql/queries';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  ReplaySubject,
} from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter, map } from 'rxjs/operators';

export interface Account {
  name: string;
  username: string;
}

/**
 * Shared authentication service.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeAuthService {
  /** Current user */
  public user = new BehaviorSubject<User | null>(null);
  /** Current user as observable */
  get user$(): Observable<User | null> {
    return this.user.asObservable();
  }
  /** Current account info */
  public account: Account | null = null;
  /** Current user value */
  get userValue(): User | null {
    return this.user.getValue();
  }
  /** if we have the modal confirmation open on form builder we cannot logout until close modal */
  public canLogout = new BehaviorSubject<boolean>(true);

  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  private isDoneLoading = new ReplaySubject<boolean>();
  public isDoneLoading$ = this.isDoneLoading.asObservable();

  public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
    this.isAuthenticated$,
    this.isDoneLoading$,
  ]).pipe(map((values) => values.every((x) => x)));

  /**
   * Shared authentication service.
   *
   * @param apollo Apollo client
   */
  constructor(private apollo: Apollo, private oauthService: OAuthService) {
    this.oauthService.events.subscribe(() => {
      this.isAuthenticated.next(this.oauthService.hasValidAccessToken());
      this.checkAccount();
    });
    this.oauthService.events
      .pipe(filter((e) => ['token_received'].includes(e.type)))
      .subscribe(() => {
        localStorage.setItem('idtoken', this.oauthService.getIdToken());
        this.oauthService.loadUserProfile();
      });
    this.oauthService.events
      .pipe(filter((e: any) => e.type === 'invalid_nonce_in_state'))
      .subscribe(() => {
        this.oauthService.initImplicitFlow();
      });
    this.oauthService.setupAutomaticSilentRefresh();
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
      if (
        user.permissions &&
        (!permission ||
          user.permissions.find((x) => {
            if (Array.isArray(permission)) {
              return (
                x.type && permission.includes(x.type) && x.global === global
              );
            } else {
              return x.type === permission && x.global === global;
            }
          }))
      ) {
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

  public initLoginSequence(): Promise<void> {
    return this.oauthService
      .loadDiscoveryDocumentAndLogin()
      .then(() => this.isDoneLoading.next(true))
      .catch(() => {
        console.error('issue when loading file');
        this.isDoneLoading.next(false);
      });
  }

  /**
   * Cleans user profile, and logout.
   */
  logout(): void {
    this.account = null;
    this.user.next(null);
    localStorage.removeItem('idtoken');
    this.oauthService.logOut();
  }

  /**
   * Gets the Azure AD profile.
   */
  checkAccount(): void {
    const claims: any = this.oauthService.getIdentityClaims();
    if (!claims) {
      return;
    }
    this.account = {
      name: claims.name,
      username: claims.preferred_username,
    };
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
      errorPolicy: 'all',
    });
  }
}
