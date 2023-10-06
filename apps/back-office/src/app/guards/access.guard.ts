import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SafeAuthService } from '@oort-front/safe';
import { SnackbarService } from '@oort-front/ui';
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
   * Constructor of the access guard
   *
   * @param authService The authentication service
   * @param snackBar The snack bar service
   * @param router The router client
   * @param translate Angular translate service
   */
  constructor(
    private authService: SafeAuthService,
    private snackBar: SnackbarService,
    private router: Router,
    private translate: TranslateService
  ) {}

  /**
   * Check if user can activate the route
   *
   * @returns A boolean indicating if he can activate
   */
  canActivate():
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
