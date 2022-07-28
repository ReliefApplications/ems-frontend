import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SafeAuthService, SafeSnackBarService } from '@safe/builder';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Access Guard. Checks that the user is admin.
 */
@Injectable({
  providedIn: 'root',
})
export class AccessGuard implements CanActivate {
  /**
   * Constructor of the accessguard
   *
   * @param authService The authentification service
   * @param snackBar The snack bar service
   * @param router The router client
   * @param translate Angular translate service
   */
  constructor(
    private authService: SafeAuthService,
    private snackBar: SafeSnackBarService,
    private router: Router,
    private translate: TranslateService
  ) {}

  /**
   * Check if user can activate the route
   *
   * @param route The route to test
   * @param state The current state
   * @returns A boolean indicating if he can activate
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.getProfile().pipe(
      map((res) => {
        if (res.data.me) {
          if (res.data.me.isAdmin) {
            this.authService.user.next(res.data.me);
            return true;
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant(
                'common.notifications.platformAccessNotGranted'
              ),
              { error: true }
            );
            this.authService.logout();
            this.router.navigate(['/auth']);
            return false;
          }
        } else {
          if (this.authService.account) {
            this.authService.logout();
          } else {
            this.router.navigate(['/auth']);
          }
          return false;
        }
      })
    );
  }
}
