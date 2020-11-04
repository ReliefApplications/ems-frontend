import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionsManagement, PermissionType } from '../models/user.model';
import { WhoAuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
/*  Check if the logged user has an access to the route.
    Only the 'dashboards' route is accessible to all logged users.
*/
export class WhoPermissionGuard implements CanActivate {
  constructor(
    private authService: WhoAuthService,
    private router: Router
  ) { }

  /*  Executed everytime a route is called, in order to check user permissions.
      Redirects to default route if not authorized.
      When reloading the page, the router will redirect to 'dashboards'. GraphQL should prevent that issue.
  */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const permission = PermissionsManagement.getRightFromPath(state.url, PermissionType.access);
    const isAuthorized = this.authService.userHasClaim(permission);
    if (!isAuthorized) {
      this.router.navigate(['/dashboards']);
    }
    return isAuthorized;
  }
}
