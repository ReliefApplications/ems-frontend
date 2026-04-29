import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client';
import {
  Ability,
  AbilityClass,
  ForcedSubject,
} from '@casl/ability';
import { Application, ProfileQueryResponse, User } from '@oort-front/shared';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  ReplaySubject,
} from 'rxjs';

/** Defining the interface for the account object. */
export interface Account {
  name: string;
  username: string;
}

type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';

type Subjects =
  | 'ApiConfiguration'
  | 'ReferenceData'
  | 'Application'
  | 'Channel'
  | 'Dashboard'
  | 'Page'
  | 'Step'
  | 'Workflow'
  | 'Resource'
  | 'User'
  | 'Template'
  | 'DistributionList'
  | 'Record'
  | 'Role'
  | 'PullJob'
  | 'Group'
  | 'CustomNotification'
  | 'Form'
  | 'EmailNotification';

export type AppAbility = Ability<
  [Actions, Subjects | ForcedSubject<Subjects>],
  { application: string }
>;

/** Application AppAbility */
export const AppAbility = Ability as AbilityClass<AppAbility>;

/**
 * Shared authentication service.
 */
@Injectable({
  providedIn: 'root',
})
export class PublicAuthService {
  /** Current user */
  public user = new BehaviorSubject<User | null>(null);

  /** @returns Current user as observable */
  get user$(): Observable<User | null> {
    return this.user.asObservable();
  }

  /** Current account info */
  public account: Account | null = null;

  /** @returns Current user value */
  get userValue(): User | null {
    return this.user.getValue();
  }

  /** if we have the modal confirmation open on form builder we cannot logout until close modal */
  public canLogout = new BehaviorSubject<boolean>(false);

  /** Boolean for authentication */
  private isAuthenticated = new BehaviorSubject<boolean>(true);
  /** Boolean for authentication as observable */
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  /** Boolean for loading */
  private isDoneLoading = new ReplaySubject<boolean>();
  /** Boolean for loading as observable */
  public isDoneLoading$ = this.isDoneLoading.asObservable();
  /** Boolean to send a flag for token refresh */
  public refreshToken = new BehaviorSubject<boolean>(false);
  /** Boolean to send a flag for token refresh as observable */
  public refreshToken$ = this.refreshToken.asObservable();
  /** Boolean to send if token is refreshed */
  public isTokenRefreshed = new BehaviorSubject<boolean>(false);
  /** Boolean to send if token is refreshed as observable */
  public isTokenRefreshed$ = this.isTokenRefreshed.asObservable();

  /** Boolean for protected route activation */
  public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
    this.isAuthenticated$,
    this.isDoneLoading$,
  ]).pipe(map((values) => values.every((x) => x)));

  /** Current environment */
  private environment: any;

  /** @returns module origin */
  get origin(): string {
    if (this.environment.module === 'backoffice') {
      return this.environment.backOfficeUri;
    } else {
      return this.environment.frontOfficeUri;
    }
  }

  /**
   * Public forms authentication service.
   *
   * @param environment Environment file where front and back office urls are specified
   * @param router Angular Router service
   * @param ability CASL ability
   */
  constructor(
    @Inject('environment') environment: any,
    private router: Router,
    private ability: AppAbility
  ) {
    this.environment = environment;
    this.checkAccount();
    this.user$.subscribe((user) => this.updateAbility(user));
  }

  /**
   * Always returns true, as public forms do not require authentication.
   *
   * @param permission permission.s required
   * @param global is the permission global or not
   * @returns Does the user have access
   */
  userHasClaim(permission: string | string[], global = true): boolean {
    return true;
  }

  /**
   * Returns false, as public forms do not have admin users.
   *
   * @returns A boolean value.
   */
  get userIsAdmin(): boolean {
    return false;
  }

  /**
   * Empty login sequence, as public forms do not require authentication.
   *
   * @returns A promise that resolves to void.
   */
  public async initLoginSequence(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Empty logout sequence, as public forms do not require authentication.
   */
  logout(): void {}

  /**
   * Gets the Azure AD profile.
   */
  checkAccount(): void {
    this.account = {
      name: 'Public user',
      username: 'publicuser',
    };
  }

  /**
   * Returns a mock profile.
   *
   * @returns Apollo query of profile
   */
  getProfile(): Observable<ApolloQueryResult<ProfileQueryResponse>> {
    return new BehaviorSubject<ApolloQueryResult<ProfileQueryResponse>>({
      data: {
        me: {
          id: '000000000000000000000001',
          firstName: 'Public',
          lastName: 'User',
          username: 'publicuser',
          isAdmin: false,
          name: 'Public User',
          roles: [],
          groups: [],
          permissions: [],
          oid: '000000000000000000000001',
          applications: [],
          positionAttributes: [],
          favoriteApp: undefined,
          attributes: undefined
        }
      },
      loading: false,
      networkStatus: 7,
      error: undefined,
    }).asObservable();
  }

  /**
   * Returns an empty token, as public forms do not require authentication.
   *
   * @returns token as stored in local storage
   */
  public getAuthToken(): string | null {
    return '';
  }

  /**
   * Update user ability, based on its permissions
   *
   * @param user active user
   */
  private updateAbility(user: User | null) {}

  /**
   * Extend user ability on application
   *
   * @param application Application to extend ability on
   */
  public extendAbilityForApplication(application: Application) {}
}
