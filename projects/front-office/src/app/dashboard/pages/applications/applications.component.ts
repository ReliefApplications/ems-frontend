import { Component, OnInit } from '@angular/core';
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
} from '@safe/builder';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationEnd, RouterEvent } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
    /** Application title */
    public title = 'Front-Office';
    /** Stores current app ID */
    public appID = '';
    /** Stores current app page */
    public appPage = '';
    /** List of accessible applications */
    public applications: Application[] = [];
    /** List of list of accessible applications */
    public applicationsList: Application[][] = [];
    /** List of application pages */
    public navGroups: any[] = [];
    /** Current application */
    public application: Application | null = null;
    /** User subscription */
    private authSubscription?: Subscription;
    /** Application service subscription */
    private applicationSubscription?: Subscription;
    /** Permissions of the user */
    private permissions: Permission[] = [];
    /** Roles of the user */
    private roles: Role[] = [];
    private user: User | null = null;

    public favorite = '';

    public loading = false;

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
  ) {}


  ngOnInit(): void {
    this.authSubscription = this.authService.user$.subscribe(
      (user: User | null) => {
        if (user) {
          this.user = user;
          // this.favorite = '63204a5987cde9001e1176b2';
          this.favorite = user.favoriteApp || '';
          this.applications = user.applications || [];
          if (this.applications.length === 0) {
            this.snackBar.openSnackBar(
              this.translate.instant(
                'common.notifications.platformAccessNotGranted'
              ),
              { error: true }
            );
          }
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }

  /**
   * Opens an application, contacting the application service.
   *
   * @param application Application to open
   */
  onOpenApplication(appID: any): void {
    this.applicationService.loadApplication(appID);
    this.roles = this.user?.roles || [];
    this.permissions = this.user?.permissions || [];

    this.applicationSubscription =
      this.applicationService.application$.subscribe(
        (application: Application | null) => {
          if (application) {
            this.title = application.name || '';
            this.appID = application.id || '';
            const adminNavItems: any[] = [];
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
              adminNavItems.push({
                name: 'Users',
                path: `../${this.appID}/settings/users`,
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
              adminNavItems.push({
                name: 'Roles',
                path: `../${this.appID}/settings/roles`,
                icon: 'admin_panel_settings',
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
                        ? `../${this.appID}/${x.type}/${x.id}`
                        : `../${this.appID}/${x.type}/${x.content}`,
                    icon: this.getNavIcon(x.type || ''),
                  })),
              },
              {
                name: 'Administration',
                navItems: adminNavItems,
              },
            ];
            if (!this.application || application.id !== this.application.id) {
              const [firstPage, ..._] = application.pages || [];
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
                      `../${this.appID}/${firstPage.type}/${
                        firstPage.type === ContentType.form
                          ? firstPage.id
                          : firstPage.content
                      }`,
                    ],
                    { relativeTo: this.route }
                  );
                } else {
                  this.router.navigate([`../${this.appID}`], {
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
        }
      );
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
