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
  constructor(private authService: SafeAuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log(route.toString());
    return this.authService.canActivateProtectedRoutes$.pipe(
      tap((x) => {
        if (x) {
          console.log('a');
          return true;
        } else {
          console.log('No auth, I navigate');
          this.router.navigate(['/auth']);
          return false;
        }
      })
    );
  }
}
