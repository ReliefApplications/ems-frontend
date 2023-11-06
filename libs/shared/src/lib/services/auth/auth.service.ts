import { Apollo } from 'apollo-angular';
import { Injectable, Inject } from '@angular/core';
import {
  Permission,
  ProfileQueryResponse,
  User,
} from '../../models/user.model';
import { GET_PROFILE } from './graphql/queries';
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
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ForcedSubject,
} from '@casl/ability';
import { get } from 'lodash';
import { Application } from '../../models/application.model';

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
  | 'Form';

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

  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  private isDoneLoading = new ReplaySubject<boolean>();
  public isDoneLoading$ = this.isDoneLoading.asObservable();

  public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
    this.isAuthenticated$,
    this.isDoneLoading$,
  ]).pipe(map((values) => values.every((x) => x)));

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
          // Current URL has finished loading, navigate to the desired URL
          this.router.navigateByUrl(redirectPath);
        } else {
          // Fallback to the location origin with a new url state with clean params
          // Chrome does not delete state and session state params once the oauth is successful
          // Which triggers a new token fetch with an invalid(deprecated) code
          // can cause an issue with navigation
          // console.log(e);
          // this.router.navigateByUrl(this.origin);
        }
        localStorage.removeItem('redirectPath');
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
    if (globalPermissions.includes('can_read_resources')) {
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

    this.ability.update(rules);
  }

  /**
   * Extend user ability on application
   *
   * @param app Application to extend ability on
   */
  public extendAbilityForApplication(app: Application) {
    if (!app?.id) return;
    const { can, rules } = new AbilityBuilder(AppAbility);

    // Copy existing rules
    rules.push(...this.ability.rules);

    // Get user app permissions
    const appRoles = app.userRoles || [];
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
        application: app.id,
      });
    }

    // === User ===
    // if (this.ability.cannot('read', 'User'))
    //   cannot(['create', 'read', 'update', 'delete'], ['User', 'Channel']);
    if (appPermissions.has('can_see_users')) {
      can(['create', 'read', 'update', 'delete'], 'User', {
        application: app.id,
      });
    }

    // === Template ===
    // cannot(['create', 'read', 'update', 'delete', 'manage'], 'Template');
    if (
      appPermissions.has('can_manage_templates') ||
      this.ability.can('manage', 'Application')
    ) {
      can(['create', 'read', 'update', 'delete', 'manage'], 'Template', {
        application: app.id,
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
          application: app.id,
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
          application: app.id,
        }
      );
    }

    this.ability.update(rules);
  }
}
