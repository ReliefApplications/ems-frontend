import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

/**
 * Class that avoid the location change on navigation
 *
 * Checks if the skipLocationChange property exists
 * If it does, allows navigation
 * If not, cancels the current navigation, rebuilds the url tree with the current url and triggers navigation again with the skipLocationChange property
 */
@Injectable({ providedIn: 'root' })
export class NormalizeUrlGuard {
  /**
   * NormalizeUrlGuard constructor
   *
   * @param router Angular router service
   */
  constructor(private router: Router) {}

  /**
   * Allows current navigation if it contains skipLocationChange
   *
   * @param _ ActivatedRouteSnapshot
   * @param state RouterStateSnapshot
   * @returns a boolean allowing navigation or cancelling it
   */
  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const extras = this.router.getCurrentNavigation()?.extras;
    if (extras?.skipLocationChange) {
      return true;
    }
    const url = this.router.parseUrl(state.url);
    this.router.navigateByUrl(url, { ...extras, skipLocationChange: true });
    return false;
  }
}

/**
 * Related canActivateFn for the current class
 *
 * @param route ActivatedRouteSnapshot
 * @param state RouterStateSnapshot
 * @returns a boolean allowing navigation or cancelling it
 */
export const IsNormalizeUrl: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => inject(NormalizeUrlGuard).canActivate(route, state);
