import { Apollo } from 'apollo-angular';
import { Injectable, Inject } from '@angular/core';
import { User } from '../../models/user.model';
import { GetProfileQueryResponse, GET_PROFILE } from './graphql/queries';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  ReplaySubject,
} from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserAbility } from './utils/userAbility';

/** Defining the interface for the account object. */
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
  /** @returns Current user as observable */
  get user$(): Observable<User | null> {
    return this.user.asObservable();
  }

  /** Current user ability */
  public ability = new BehaviorSubject<UserAbility | null>(null);
  /** @returns Current ability as observable */
  get ability$(): Observable<UserAbility | null> {
    return this.ability.asObservable();
  }

  /** Current account info */
  public account: Account | null = null;
  /** @returns Current user value */
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

  private environment: any;

  /**
   * Shared authentication service.
   *
   * @param environment Environment file where front and back office urls are specified
   * @param apollo Apollo client
   * @param oauthService OAuth authentication service
   * @param router Angular Router service
   */
  constructor(
    @Inject('environment') environment: any,
    private apollo: Apollo,
    private oauthService: OAuthService,
    private router: Router
  ) {
    this.environment = environment;
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
    // Redirect to previous path
    this.oauthService.events
      .pipe(filter((e: any) => e.type === 'user_profile_loaded'))
      .subscribe(() => {
        const redirectPath = localStorage.getItem('redirectPath');
        if (redirectPath) {
          this.router.navigateByUrl(redirectPath);
        }
        localStorage.removeItem('redirectPath');
      });
    this.oauthService.setupAutomaticSilentRefresh();
  }

  /**
   * Check if user has permission.
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
   * Check if user is admin. If user profile is empty, tries to get it.
   *
   * @returns A boolean value.
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
   * Initiate the login sequence
   *
   * @returns A promise that resolves to void.
   */
  public initLoginSequence(): Promise<void> {
    if (!localStorage.getItem('idtoken')) {
      let redirectUri: URL;
      if (this.environment.module === 'backoffice') {
        const pathName = location.href.replace(
          this.environment.backOfficeUri,
          '/'
        );
        redirectUri = new URL(pathName, this.environment.backOfficeUri);
      } else {
        const pathName = location.href.replace(
          this.environment.backOfficeUri,
          '/'
        );
        redirectUri = new URL(pathName, this.environment.frontOfficeUri);
      }
      redirectUri.search = '';
      if (redirectUri.pathname !== '/' && redirectUri.pathname !== '/auth/') {
        localStorage.setItem('redirectPath', redirectUri.pathname);
      }
    }
    return this.oauthService
      .loadDiscoveryDocumentAndLogin()
      .then(() => {
        this.isDoneLoading.next(true);
      })
      .catch((err) => {
        console.error(err);
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
    const query = this.apollo.query<GetProfileQueryResponse>({
      query: GET_PROFILE,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    });

    // Updates the user ability
    query.subscribe((result) => {
      if (result.data && result.data.me && result.data.me.permissions)
        this.ability.next(new UserAbility(result.data.me.permissions));
    });

    return query;
  }

  /**
   * Get the authentication token from local storage if it exists
   *
   * @returns token as stored in local storage
   */
  public getAuthToken(): string | null {
    return localStorage.getItem('idtoken');
  }
}
