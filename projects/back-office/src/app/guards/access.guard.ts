import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import {
  SafeAuthService,
  SafeSnackBarService,
  NOTIFICATIONS,
} from '@safe/builder';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AccessGuard implements CanActivate {
  constructor(
    private oauthService: OAuthService,
    private authService: SafeAuthService,
    private snackBar: SafeSnackBarService,
    private router: Router
  ) {}

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
            if (res.data.me.isAdmin) {
              this.authService.user.next(res.data.me);
              return true;
            } else {
              this.snackBar.openSnackBar(
                NOTIFICATIONS.accessNotProvided('platform'),
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
    } else {
      console.log('no token');
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
