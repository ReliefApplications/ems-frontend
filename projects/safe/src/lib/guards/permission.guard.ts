import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SafeAuthService } from '../services/auth/auth.service';
import { Data, Route } from '@angular/router';
import { Breadcrumb } from '../services/breadcrumb/breadcrumb.service';
import {
  Action,
  Entity,
  UserAbility,
} from '../services/auth/utils/userAbility';

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
 * @returns A boolean indicating if the user has the required permissions
 */
const hasPermissions = (
  userAbility: UserAbility,
  rp: RequiredPermissions
): boolean => {
  const op = rp.logic === 'and' ? 'every' : 'some';
  return rp.permissions[op]((p) => {
    if (typeof p === 'string') {
      const [action, entity] = p.split(':');
      return userAbility.can(action as Action, entity as Entity);
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
   * @param router The router service
   */
  constructor(private authService: SafeAuthService, private router: Router) {}

  /**
   * Executed every time a route is called, in order to check user permissions.
   * Redirects to default route if not authorized.
   * When reloading the page, the router will redirect to 'applications'.
   * GraphQL should prevent that issue.
   *
   * @param next activated route snapshot
   * @returns A boolean indicating if the user has permission
   */
  canActivate(
    next: ActivatedRouteSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const required: RequiredPermissions = next.data.permissions;
    if (!required || required.permissions.length === 0) return true;

    const userAbility = this.authService.ability.getValue();
    if (!userAbility) return false;

    const isAuthorized = hasPermissions(userAbility, required);

    if (!isAuthorized) {
      this.router.navigate(['/applications']);
    }
    return isAuthorized;
  }
}
