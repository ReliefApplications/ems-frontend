import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '@oort-front/shared';
import { Observable } from 'rxjs';
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
   * @param authService Shared authentication service
   * @param router Angular router service
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Check that user can see the page.
   *
   * @returns can user access the page or not
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
          this.router.navigate(['/auth/login']);
          return false;
        }
      })
    );
  }
}
