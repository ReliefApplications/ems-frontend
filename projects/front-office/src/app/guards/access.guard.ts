import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { SafeAuthService } from '@safe/builder';
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
  constructor(private authService: SafeAuthService, private router: Router) {}

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
      console.log('access ?');
    return this.authService.getProfile().pipe(
      map((res) => {
        if (res.data.me) {
          console.log('c');
          this.authService.user.next(res.data.me);
          return true;
        } else {
          if (this.authService.account) {
            console.log('d');
            this.authService.logout();
          } else {
            console.log('there no access, I navigate');
            this.router.navigate(['/auth']);
          }
          console.log('f');
          return false;
        }
      })
    );
  }
}
