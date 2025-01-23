import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ForcedSubject,
} from '@casl/ability';
import { OAuthService } from 'angular-oauth2-oidc';
import { Apollo } from 'apollo-angular';
import { get } from 'lodash';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  ReplaySubject,
} from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Application } from '../../models/application.model';
import {
  Permission,
  ProfileQueryResponse,
  User,
} from '../../models/user.model';
import { GET_PROFILE } from './graphql/queries';

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
export class AuthService {
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
  public canLogout = new BehaviorSubject<boolean>(true);

  /** Boolean for authentication */
  private isAuthenticated = new BehaviorSubject<boolean>(false);
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
   * Shared authentication service.
   *
   * @param environment Environment file where front and back office urls are specified
   * @param apollo Apollo client
   * @param oauthService OAuth authentication service
   * @param router Angular Router service
   * @param ability CASL ability
   */
  constructor(
    @Inject('environment') environment: any,
    private apollo: Apollo,
    private oauthService: OAuthService,
    private router: Router,
    private ability: AppAbility
  ) {
    this.environment = environment;
    this.oauthService.events.subscribe((e) => {
      console.log('Event: ' + e);
      console.log(
        'User has valid token ( events ): ',
        this.oauthService.hasValidAccessToken()
      );
      this.isAuthenticated.next(this.oauthService.hasValidAccessToken());
      this.checkAccount();
    });
    this.oauthService.events
      .pipe(filter((e) => ['token_received'].includes(e.type)))
      .subscribe(() => {
        localStorage.setItem('idtoken', this.oauthService.getIdToken());
        const redirectPath = localStorage.getItem('redirectPath');
        // Redirect to previous path for backoffice, frontoffice is handled directly from the redirect component
        if (redirectPath && this.environment.module === 'backoffice') {
          // Current URL has finished loading, navigate to the desired URL
          this.router.navigateByUrl(redirectPath);
          localStorage.removeItem('redirectPath');
        }
      });
    this.oauthService.events
      .pipe(filter((e: any) => e.type === 'invalid_nonce_in_state'))
      .subscribe(() => {
        this.oauthService.initLoginFlow();
      });
    this.oauthService.setupAutomaticSilentRefresh();
    this.user$.subscribe((user) => this.updateAbility(user));
  }

  /**
   * Check if user has permission.
   * If user profile is empty, tries to get it.
   *
   * @param permission permission.s required
   * @param global is the permission global or not
   * @returns Does the user have access
   */
  userHasClaim(permission: string | string[], global = true): boolean {
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
    console.log(
      'User has valid token ( Login ): ',
      this.oauthService.hasValidAccessToken()
    );
    if (!this.oauthService.hasValidAccessToken()) {
      let environmentUri =
        this.environment.module === 'backoffice'
          ? this.environment.backOfficeUri
          : this.environment.frontOfficeUri;
      let pathName = '/';
      // If href starts with environment uri, remove it to get pathname
      if (location.href.startsWith(environmentUri)) {
        pathName = location.href.replace(environmentUri, '/');
      }
      // else, the href is the environment uri without the trailing '/'
      // We remove the trailing '/' from the environment uri as we would add it back
      environmentUri = environmentUri.replace(/\/$/, '');
      const redirectUri = new URL(pathName, environmentUri);
      if (redirectUri.pathname !== '/' && redirectUri.pathname !== '/auth/') {
        localStorage.setItem(
          'redirectPath',
          pathName
          // redirectUri.pathname + redirectUri.search + redirectUri.hash || This would also work but since it does a concat, the other would be faster
        );
      }
    } else {
      console.log('Found token, skipping redirection...');
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
    console.log('Check account');
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
  getProfile(): Observable<ApolloQueryResult<ProfileQueryResponse>> {
    return this.apollo.query<ProfileQueryResponse>({
      query: GET_PROFILE,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    });
  }

  /**
   * Get the authentication token from local storage if it exists
   *
   * @returns token as stored in local storage
   */
  public getAuthToken(): string | null {
    return localStorage.getItem('idtoken');
  }

  /**
   * Update user ability, based on its permissions
   *
   * @param user active user
   */
  private updateAbility(user: User | null) {
    if (!user) return;

    const { can, rules } = new AbilityBuilder(AppAbility);
    const permissions: Permission[] = get(user, 'permissions', []);

    const globalPermissions = permissions
      .filter((x) => x.global)
      .map((x) => x.type);

    // === Application ===
    if (globalPermissions.includes('can_see_applications')) {
      can('read', [
        'Application',
        'Channel',
        'Dashboard',
        'Page',
        'Step',
        'Workflow',
      ]);
    }
    if (globalPermissions.includes('can_create_applications')) {
      can('create', 'Application');
    }
    if (globalPermissions.includes('can_manage_applications')) {
      can(
        ['read', 'create', 'update', 'delete', 'manage'],
        [
          'Application',
          'Dashboard',
          'Channel',
          'Page',
          'Step',
          'Workflow',
          'Template',
          'DistributionList',
        ]
      );
    }

    // === Form ===
    if (globalPermissions.includes('can_see_forms')) {
      can('read', ['Form', 'Record']);
    }
    if (globalPermissions.includes('can_create_forms')) {
      can('create', 'Form');
    }
    if (globalPermissions.includes('can_manage_forms')) {
      can(['create', 'read', 'update', 'delete', 'manage'], ['Form', 'Record']);
      can('manage', 'Record');
    }

    // === Resource ===
    if (globalPermissions.includes('can_see_resources')) {
      can('read', ['Resource', 'Record']);
    }
    if (globalPermissions.includes('can_create_resources')) {
      can('create', 'Resource');
    }
    if (globalPermissions.includes('can_manage_resources')) {
      can(
        ['create', 'read', 'update', 'delete', 'manage'],
        ['Resource', 'Record']
      );
      can('manage', 'Record');
    }

    // === Role ===
    if (globalPermissions.includes('can_see_roles')) {
      can(['create', 'read', 'update', 'delete'], ['Role', 'Channel']);
    }

    // === Group ===
    if (globalPermissions.includes('can_see_groups')) {
      can(['create', 'read', 'update', 'delete'], 'Group');
    }

    // === User ===
    if (globalPermissions.includes('can_see_users')) {
      can(['create', 'read', 'update', 'delete'], 'User');
    }

    // === API Configuration / Pull Job ===
    if (globalPermissions.includes('can_manage_api_configurations')) {
      can(
        ['create', 'read', 'update', 'delete'],
        ['ApiConfiguration', 'PullJob', 'ReferenceData']
      );
    }

    // === Email Notifications ===
    if (globalPermissions.includes('can_manage_email_notifications')) {
      can(['create', 'read', 'update', 'delete'], 'EmailNotification');
    }

    this.ability.update(rules);
  }

  /**
   * Extend user ability on application
   *
   * @param application Application to extend ability on
   */
  public extendAbilityForApplication(application: Application) {
    if (!application?.id) return;
    const { can, rules } = new AbilityBuilder(AppAbility);

    // Copy existing rules
    rules.push(...this.ability.rules);

    // Get user app permissions
    const appRoles = application.userRoles || [];
    const appPermissions = new Set<string>();
    appRoles.forEach((role) => {
      const rolePermissions = role.permissions?.map((x) => x.type) || [];
      rolePermissions.forEach((x) => {
        if (typeof x === 'string') appPermissions.add(x);
      });
    });

    // === Role ===
    // if (this.ability.cannot('read', 'Role'))
    //   cannot(['create', 'read', 'update', 'delete'], ['Role', 'Channel']);
    if (appPermissions.has('can_see_roles')) {
      can(['create', 'read', 'update', 'delete'], ['Role', 'Channel'], {
        application: application.id,
      });
    }

    // === User ===
    // if (this.ability.cannot('read', 'User'))
    //   cannot(['create', 'read', 'update', 'delete'], ['User', 'Channel']);
    if (appPermissions.has('can_see_users')) {
      can(['create', 'read', 'update', 'delete'], 'User', {
        application: application.id,
      });
    }

    // === Template ===
    // cannot(['create', 'read', 'update', 'delete', 'manage'], 'Template');
    if (
      appPermissions.has('can_manage_templates') ||
      this.ability.can('manage', 'Application')
    ) {
      can(['create', 'read', 'update', 'delete', 'manage'], 'Template', {
        application: application.id,
      });
    }

    // === Distribution list ===
    // cannot(
    //   ['create', 'read', 'update', 'delete', 'manage'],
    //   'DistributionList'
    // );
    if (
      appPermissions.has('can_manage_distribution_lists') ||
      this.ability.can('manage', 'Application')
    ) {
      can(
        ['create', 'read', 'update', 'delete', 'manage'],
        'DistributionList',
        {
          application: application.id,
        }
      );
    }

    // === Custom Notification ===
    if (
      appPermissions.has('can_manage_custom_notifications') ||
      this.ability.can('manage', 'Application')
    ) {
      can(
        ['create', 'read', 'update', 'delete', 'manage'],
        'CustomNotification',
        {
          application: application.id,
        }
      );
    }

    // === Email Notifications ===
    if (appPermissions.has('can_see_email_notifications')) {
      can('read', 'EmailNotification');
    }
    if (appPermissions.has('can_update_email_notifications')) {
      can(['update', 'delete'], 'EmailNotification');
    }

    if (appPermissions.has('can_create_email_notifications')) {
      can('create', 'EmailNotification');
    }

    this.ability.update(rules);
  }
}
