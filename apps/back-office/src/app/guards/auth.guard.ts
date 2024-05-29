import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '@oort-front/shared';
import { Observable, firstValueFrom } from 'rxjs';
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
   * @param authService The authentication service
   * @param router The router client
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Check if user can activate the route
   *
   * @returns A boolean indicating if the user can activate the route
   */
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.canActivateProtectedRoutes$.pipe(
      tap((x) => {
        if (x) {
          return true;
        } else {
          firstValueFrom(this.authService.isDoneLoading$).then((loaded) => {
            if (loaded) {
              this.router.navigate(['/auth']);
            }
          });
          return false;
        }
      })
    );
  }
}
