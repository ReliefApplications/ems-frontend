import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { AuthService } from '@oort-front/shared';
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
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Defines the logic of the guard.
   * Passes if the user is authenticated.
   *
   * @returns Can the user continue navigation
   */
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.getProfile().pipe(
      map(({ data }) => {
        console.log('Got profile');
        if (data.me) {
          console.log('Could fetch API');
          this.authService.user.next(data.me);
          return true;
        } else {
          console.log('Could not get profile');
          // if (this.authService.account) {
          //   console.log('Found account');
          //   console.log(this.authService.account);
          //   this.authService.logout();
          // } else {
          //   console.log('No account');
          //   this.router.navigate(['/auth']);
          // }
          this.router.navigate(['/auth']);
          return false;
        }
      })
    );
  }
}
