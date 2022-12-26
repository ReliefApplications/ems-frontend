import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { SafeAuthService } from '../services/auth/auth.service';
import { Data, Route } from '@angular/router';
import { Breadcrumb } from '../services/breadcrumb/breadcrumb.service';
import {
  Action,
  Entity,
  UserAbility,
} from '../services/auth/utils/userAbility';
import { SafeApplicationService } from '../services/application/application.service';

type RequiredPermissions = {
  logic: 'and' | 'or';
  permissions: (`${Action}:${Entity}` | RequiredPermissions)[];
};

/**
 * Additional data necessary/supported for the routes
 * Extends the default type of Angular router data
 */
interface CustomRouteData extends Data {
  /** Required permissions to have access to the page */
  permissions?: RequiredPermissions;

  /** Configuration of the breadcrumb */
  breadcrumb?: Breadcrumb;
}

/** Route with custom data */
export interface CustomRoute extends Route {
  data?: CustomRouteData;
  children?: CustomRoute[];
}

/**
 * Gets if the user has the required permissions
 *
 * @param userAbility The user ability
 * @param rp The required permissions
 * @param app The current application, if any
 * @returns A boolean indicating if the user has the required permissions
 */
const hasPermissions = (
  userAbility: UserAbility,
  rp: RequiredPermissions,
  app?: string
): boolean => {
  const op = rp.logic === 'and' ? 'every' : 'some';
  return rp.permissions[op]((p) => {
    if (typeof p === 'string') {
      const [action, entity] = p.split(':');
      return userAbility.can(action as Action, entity as Entity, app);
    } else {
      return hasPermissions(userAbility, p);
    }
  });
};

/**
 * Check if the logged user has an access to the route.
 * Only the 'applications' route is accessible to all logged users.
 */
@Injectable({
  providedIn: 'root',
})
export class SafePermissionGuard implements CanActivate {
  /**
   * Constructor of the SafePermissionGuard class
   *
   * @param authService The authentication service
   * @param applicationService The application service
   * @param router The router service
   */
  constructor(
    private authService: SafeAuthService,
    private applicationService: SafeApplicationService,
    private router: Router
  ) {}

  /**
   * Executed every time a route is called, in order to check user permissions.
   * Redirects to default route if not authorized.
   * When reloading the page, the router will redirect to 'applications'.
   * GraphQL should prevent that issue.
   *
   * @param next activated route snapshot
   * @returns A boolean indicating if the user has permission
   */
  async canActivate(next: ActivatedRouteSnapshot): Promise<boolean> {
    const required: RequiredPermissions = next.data.permissions;
    if (!required || required.permissions.length === 0) return true;

    const userAbility = this.authService.ability.getValue();
    if (!userAbility) return false;

    return new Promise<boolean>((resolve) => {
      this.applicationService.application$.subscribe((app) => {
        const isAuthorized = hasPermissions(userAbility, required, app?.id);
        if (!isAuthorized) {
          this.router.navigate(['/applications']);
        }
        resolve(isAuthorized);
      });
    });
  }
}
