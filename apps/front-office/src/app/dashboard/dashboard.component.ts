import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { subject } from '@casl/ability';
import { TranslateService } from '@ngx-translate/core';
import {
  Application,
  User,
  Role,
  SafeAuthService,
  SafeApplicationService,
  Permission,
  ContentType,
  SafeUnsubscribeComponent,
  AppAbility,
} from '@oort-front/safe';
import { SnackbarService } from '@oort-front/ui';
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
  /** Use side menu or not */
  public sideMenu = false;
  /** Is large device */
  public largeDevice: boolean;

  /**
   * empty applications state getter
   *
   * @returns True if applications is empty
   */
  get empty(): boolean {
    return this.applications.length === 0;
  }

  /**
   * Main component of Front-Office navigation.
   *
   * @param authService Shared authentication service
   * @param applicationService Shared application service
   * @param route Angular current route
   * @param snackBar Shared snackbar service
   * @param router Angular router
   * @param translate Angular translate service
   * @param ability user ability
   */
  constructor(
    private authService: SafeAuthService,
    private applicationService: SafeApplicationService,
    public route: ActivatedRoute,
    private snackBar: SnackbarService,
    private router: Router,
    private translate: TranslateService,
    private ability: AppAbility
  ) {
    super();
    this.largeDevice = window.innerWidth > 1024;
  }

  /**
   * Change the display depending on windows size.
   *
   * @param event Event that implies a change in window size
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.largeDevice = event.target.innerWidth > 1024;
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
            this.ability.can(
              'read',
              subject('User', { application: application.id })
            )
          ) {
            // if can see users globally / can manage apps / can see users in app
            this.adminNavItems.push({
              name: this.translate.instant('common.user.few'),
              path: `./${this.appID}/settings/users`,
              icon: 'supervisor_account',
            });
          }
          if (
            this.ability.can(
              'read',
              subject('Role', { application: application.id })
            )
          ) {
            // if can see roles globally / can manage apps / can see roles in app
            this.adminNavItems.push({
              name: this.translate.instant('common.role.few'),
              path: `./${this.appID}/settings/roles`,
              icon: 'admin_panel_settings',
            });
          }
          if (
            this.ability.can(
              'manage',
              subject('Template', { application: application.id })
            )
          ) {
            // if can manage apps / can manage templates in app
            this.adminNavItems.push({
              name: this.translate.instant('common.template.few'),
              path: `./${this.appID}/settings/templates`,
              icon: 'description',
            });
          }
          if (
            this.ability.can(
              'manage',
              subject('DistributionList', { application: application.id })
            )
          ) {
            // if can manage apps / can manage distribution lists in app
            this.adminNavItems.push({
              name: this.translate.instant('common.distributionList.few'),
              path: `./${this.appID}/settings/distribution-lists`,
              icon: 'mail',
            });
          }
          if (
            this.ability.can(
              'manage',
              subject('CustomNotification', { application: application.id })
            )
          ) {
            // if can manage apps / can manage distribution lists in app
            this.adminNavItems.push({
              name: this.translate.instant('common.customNotification.few'),
              path: './settings/notifications',
              icon: 'schedule_send',
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
          this.sideMenu = this.application?.sideMenu ?? false;
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
