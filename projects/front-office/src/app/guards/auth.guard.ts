import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { SafeAuthService } from '@safe/builder';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Auth Guard. Checks that the user is authenticated.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  /**
   * Auth Guard. Checks that the user is authenticated.
   *
   * @param authService Shared authentication service
   * @param router Angular router service
   */
  constructor(private authService: SafeAuthService, private router: Router) {}

  /**
   * Check that user can see the page.
   *
   * @param route route to navigate to
   * @param state current router's state
   * @returns can user access the page or not
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.canActivateProtectedRoutes$.pipe(
      tap((x) => {
        if (x) {
          return true;
        } else {
          this.router.navigate(['/auth']);
          return false;
        }
      })
    );
  }
}
