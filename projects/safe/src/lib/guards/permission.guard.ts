import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, UrlTree } from '@angular/router';
import { get } from 'lodash';
import { Observable } from 'rxjs';
import { AppAbility } from '../services/auth/auth.service';

/**
 * Check if the logged user has an access to the route.
 * Only the 'applications' route is accessible to all logged users.
 */
@Injectable({
  providedIn: 'root',
})
export class SafePermissionGuard implements CanActivate {
  /**
   * Guard to prevent unauthorized users to see pages
   *
   * @param ability user ability
   */
  constructor(private ability: AppAbility) {}

  /**
   * Executed anytime a route is called, in order to check user permissions.
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
    const permission = get(next, 'data.permission', null);
    if (permission && permission.action && permission.subject) {
      return this.ability.can(permission.action, permission.subject);
    } else {
      return true;
    }
  }
}
