import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  Application,
  User,
  Role,
  SafeAuthService,
  SafeSnackBarService,
  SafeApplicationService,
  Permission,
  Permissions,
  ContentType,
  SafeUnsubscribeComponent,
} from '@safe/builder';
import get from 'lodash/get';
import { takeUntil } from 'rxjs/operators';

/**
 * Main component of Front-Office navigation.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  /** Application title */
  public title = '';
  /** Stores current app ID */
  public appID = '';
  /** Stores current app page */
  public appPage = '';
  /** List of accessible applications */
  public applications: Application[] = [];
  /** List of application pages */
  public navGroups: any[] = [];
  /** List of settings pages */
  public adminNavItems: any[] = [];
  /** Current application */
  public application: Application | null = null;
  /** Permissions of the user */
  private permissions: Permission[] = [];
  /** Roles of the user */
  private roles: Role[] = [];

  /**
   * Main component of Front-Office navigation.
   *
   * @param authService Shared authentication service
   * @param applicationService Shared application service
   * @param route Angular current route
   * @param snackBar Shared snackbar service
   * @param router Angular router
   * @param translate Angular translate service
   */
  constructor(
    private authService: SafeAuthService,
    private applicationService: SafeApplicationService,
    public route: ActivatedRoute,
    private snackBar: SafeSnackBarService,
    private router: Router,
    private translate: TranslateService
  ) {
    super();
  }

  /**
   * Subscribes to current user change, and application change.
   * On load, try to open the first application accessible to the user.
   */
  ngOnInit(): void {
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User | null) => {
        if (user) {
          const applications = user.applications || [];
          if (applications.length > 0) {
            this.applications = applications;
            this.applications.map((element) => {
              if (element.id === this.router.url.slice(1, 25)) {
                this.appID = this.router.url.slice(1, 25);
                const temp = this.router.url.split('/');
                if (temp[2]) {
                  this.appPage = temp[2];
                  if (temp[3]) {
                    this.appPage += '/' + temp[3];
                  }
                }
              }
            });
            if (this.appID.length <= 0) {
              if (user.favoriteApp) {
                this.appID = user.favoriteApp;
              } else {
                this.appID = applications[0].id || '';
              }
            }
            this.applicationService.loadApplication(this.appID);
            this.roles = user.roles || [];
            this.permissions = user.permissions || [];
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant(
                'common.notifications.platformAccessNotGranted'
              ),
              { error: true }
            );
          }
        }
      });
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
        if (application) {
          this.title = application.name || '';
          this.appID = application.id || '';
          this.adminNavItems = [];
          if (
            this.permissions.some(
              (x) =>
                (x.type === Permissions.canSeeUsers &&
                  this.roles.some(
                    (y) =>
                      y.application?.id === application.id &&
                      y.permissions?.some((perm) => perm.id === x.id)
                  )) ||
                (x.type === Permissions.canManageApplications && x.global)
            )
          ) {
            this.adminNavItems.push({
              name: this.translate.instant('common.user.few'),
              path: `./${this.appID}/settings/users`,
              icon: 'supervisor_account',
            });
          }
          if (
            this.permissions.some(
              (x) =>
                (x.type === Permissions.canSeeRoles &&
                  this.roles.some(
                    (y) =>
                      y.application?.id === application.id &&
                      y.permissions?.some((perm) => perm.id === x.id)
                  )) ||
                (x.type === Permissions.canManageApplications && x.global)
            )
          ) {
            this.adminNavItems.push({
              name: this.translate.instant('common.role.few'),
              path: `./${this.appID}/settings/roles`,
              icon: 'admin_panel_settings',
            });
          }
          if (
            this.permissions.some(
              (x) =>
                (x.type === Permissions.canManageTemplates &&
                  this.roles.some(
                    (y) =>
                      y.application?.id === application.id &&
                      y.permissions?.some((perm) => perm.id === x.id)
                  )) ||
                (x.type === Permissions.canManageApplications && x.global)
            )
          ) {
            this.adminNavItems.push({
              name: this.translate.instant('common.template.few'),
              path: `./${this.appID}/settings/templates`,
              icon: 'description',
            });
          }
          if (
            this.permissions.some(
              (x) =>
                (x.type === Permissions.canManageDistributionLists &&
                  this.roles.some(
                    (y) =>
                      y.application?.id === application.id &&
                      y.permissions?.some((perm) => perm.id === x.id)
                  )) ||
                (x.type === Permissions.canManageApplications && x.global)
            )
          ) {
            this.adminNavItems.push({
              name: this.translate.instant('common.distributionList.few'),
              path: `./${this.appID}/settings/distribution-lists`,
              icon: 'mail',
            });
          }
          this.navGroups = [
            {
              name: 'Pages',
              navItems: application.pages
                ?.filter((x) => x.content)
                .map((x) => ({
                  name: x.name,
                  path:
                    x.type === ContentType.form
                      ? `./${this.appID}/${x.type}/${x.id}`
                      : `./${this.appID}/${x.type}/${x.content}`,
                  icon: this.getNavIcon(x.type || ''),
                })),
            },
          ];
          if (!this.application || application.id !== this.application.id) {
            const firstPage = get(application, 'pages', [])[0];
            const find = !this.application
              ? this.validPage(application)
              : false;
            if (
              !find &&
              (this.router.url.endsWith('/') ||
                application.id !== this.application?.id ||
                !firstPage)
            ) {
              if (firstPage) {
                this.router.navigate(
                  [
                    `./${this.appID}/${firstPage.type}/${
                      firstPage.type === ContentType.form
                        ? firstPage.id
                        : firstPage.content
                    }`,
                  ],
                  { relativeTo: this.route }
                );
              } else {
                this.router.navigate([`./${this.appID}`], {
                  relativeTo: this.route,
                });
              }
            }
          }
          this.application = application;
          this.appID = application.id || '';
        } else {
          this.navGroups = [];
        }
      });
  }

  /**
   * Opens an application, contacting the application service.
   *
   * @param application Application to open
   */
  onOpenApplication(application: Application): void {
    this.applicationService.loadApplication(application.id || '');
  }

  /**
   * Gets nav icon from page content type.
   *
   * @param type content type of the page
   * @returns icon
   */
  private getNavIcon(type: string): string {
    switch (type) {
      case 'workflow':
        return 'linear_scale';
      case 'form':
        return 'description';
      default:
        return 'dashboard';
    }
  }

  /**
   * Checks if route page is valid.
   *
   * @param app application to check pages of
   * @returns Is page valid or not
   */
  private validPage(app: any): boolean {
    if (
      this.appPage &&
      (this.appPage === 'profile' ||
        this.appPage === 'settings/users' ||
        this.appPage === 'settings/roles' ||
        app.pages?.find(
          (val: any) =>
            val.type + '/' + val.content === this.appPage ||
            val.type + '/' + val.id === this.appPage
        ))
    ) {
      return true;
    }
    return false;
  }
}
