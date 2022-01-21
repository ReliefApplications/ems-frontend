import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { SafeAuthService } from '@safe/builder';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Guard to check if user is authenticated or not.
 */
@Injectable({
  providedIn: 'root',
})
export class AccessGuard implements CanActivate {
  /**
   * Guard to check if user is authenticated or not.
   *
   * @param authService Shared authentication service
   * @param router Angular router
   */
  constructor(
    private oauthService: OAuthService,
    private authService: SafeAuthService,
    private router: Router
  ) {}

  /**
   * Defines the logic of the guard.
   * Passes if the user is authenticated.
   *
   * @param route Current route
   * @param state Current state
   * @returns Can the user continue navigation
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (
      this.oauthService.hasValidAccessToken() &&
      this.oauthService.hasValidIdToken
    ) {
      localStorage.setItem('idtoken', this.oauthService.getIdToken());
      return this.authService.getProfile().pipe(
        map((res) => {
          if (res.data.me) {
            console.log('it is me');
            this.authService.user.next(res.data.me);
            return true;
          } else {
            if (this.authService.account) {
              console.log('my account');
              this.authService.logout();
            } else {
              console.log('no account');
              this.router.navigate(['/auth']);
            }
            return false;
          }
        })
      );
    } else {
      console.log('no token');
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
