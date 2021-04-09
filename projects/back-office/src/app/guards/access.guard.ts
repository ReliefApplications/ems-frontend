import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { User, WhoAuthService, WhoSnackBarService } from '@who-ems/builder';
import { Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
  constructor(
    private authService: WhoAuthService,
    private snackBar: WhoSnackBarService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.user.pipe(
        skip(1), // this is important as first value of behaviorSubject is null
        map((user: User | null) => {
          if (user) {
            if (user.isAdmin) {
              return true;
            }
            this.snackBar.openSnackBar('No access provided to this platform.', { error: true });
            this.authService.logout();
            this.router.navigate(['/auth']);
            return false;
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
