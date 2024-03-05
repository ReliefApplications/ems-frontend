import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { subject } from '@casl/ability';
import { TranslateService } from '@ngx-translate/core';
import { get } from 'lodash';
import { Observable, takeUntil } from 'rxjs';
import { ApplicationService } from '../services/application/application.service';
import { AppAbility } from '../services/auth/auth.service';
import { SnackbarService } from '@oort-front/ui';
import { UnsubscribeComponent } from '../components/utils/unsubscribe/unsubscribe.component';

/**
 * Check if the logged user has an access to the route.
 * Only the 'applications' route is accessible to all logged users.
 */
@Injectable({
  providedIn: 'root',
})
export class PermissionGuard
  extends UnsubscribeComponent
  implements CanActivate
{
  /**
   * Guard to prevent unauthorized users to see pages
   *
   * @param environment environment
   * @param router Angular router
   * @param ability user ability
   * @param translate Angular translate service
   * @param snackBar Shared snackbar service
   * @param appService application service
   */
  constructor(
    @Inject('environment') private environment: any,
    private router: Router,
    private ability: AppAbility,
    private translate: TranslateService,
    private snackBar: SnackbarService,
    private appService: ApplicationService
  ) {
    super();
  }

  /**
   * Executed anytime a route is called, in order to check user permissions.
   * Redirects to default route if not authorized.
   * When reloading the page, the router will redirect to 'applications'.
   * GraphQL should prevent that issue.
   *
   * @param next activated route snapshot
   * @param state router state snapshot
   * @returns A boolean indicating if the user has permission
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const permission = get(next, 'data.permission', null);

    // If permission is not defined in data object, allow access
    if (!permission || !permission.action || !permission.subject) return true;

    const hasGlobalPermission = this.ability.can(
      permission.action,
      permission.subject
    );

    // If the user has global permission, allow access
    if (hasGlobalPermission) return true;

    // Check if the user is in an application
    const appId =
      this.environment.module === 'frontoffice'
        ? state.url.split('/')[1]
        : null;

    // If the user is navigating in an application, returns
    // a promise that will resolve when the app is loaded (and the ability extended)
    if (appId) {
      this.appService.loadApplication(appId);
      return new Promise((resolve) => {
        const sub = this.appService.application$
          .pipe(takeUntil(this.destroy$))
          .subscribe((app) => {
            if (!app?.id) return;
            sub.unsubscribe();
            const hasPermission = this.ability.can(
              permission.action,
              subject(permission.subject, {
                application: app.id,
              })
            );
            resolve(hasPermission ? true : this.router.parseUrl('/'));
          });
      });
    }

    // If not in app, and no global permission, deny access
    // show error message and redirect to the root route
    this.snackBar.openSnackBar(this.translate.instant('common.accessDenied'), {
      error: true,
    });
    return this.router.parseUrl('/');
  }
}
