import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@oort-front/shared';
import { SnackbarService } from '@oort-front/ui';
import { Observable, firstValueFrom } from 'rxjs';
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
    private authService: AuthService,
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
            return false;
          }
        } else {
          if (this.authService.account) {
            this.authService.logout();
          } else {
            firstValueFrom(this.authService.isDoneLoading$).then((loaded) => {
              if (loaded) {
                this.router.navigate(['/auth']);
              }
            });
          }
          return false;
        }
      })
    );
  }
}
