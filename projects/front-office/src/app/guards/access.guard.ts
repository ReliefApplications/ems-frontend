import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { SafeAuthService } from '@safe/builder';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
  constructor(
    private authService: SafeAuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.getProfile().pipe(
      map((res) => {
        if (res.data.me) {
          this.authService.user.next(res.data.me);
          return true;
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
