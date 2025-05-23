import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { subject } from '@casl/ability';
import { TranslateService } from '@ngx-translate/core';
import {
  AppAbility,
  Application,
  ApplicationService,
  AuthService,
  ContentType,
  UnsubscribeComponent,
  User,
} from '@oort-front/shared';
import get from 'lodash/get';
import { takeUntil } from 'rxjs/operators';

/**
 * Front-office Application component.
 */
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** Application title */
  public title = '';
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
  /** Use side menu or not */
  public sideMenu = false;
  /** Should hide menu by default ( only when vertical ) */
  public hideMenu = false;
  /** Is large device */
  public largeDevice: boolean;
  /** Is loading */
  public loading = true;
  /** Current profile route */
  public profileRoute = '/profile';

  /**
   * Front-office Application component.
   *
   * @param authService Shared authentication service
   * @param applicationService Shared application service
   * @param route Angular current route
   * @param router Angular router
   * @param translate Angular translate service
   * @param ability user ability
   * @param htmlTitle HTML title service
   */
  constructor(
    private authService: AuthService,
    private applicationService: ApplicationService,
    public route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private ability: AppAbility,
    private htmlTitle: Title
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
    // Subscribe to params change
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.loading = true;
      this.applicationService.loadApplication(params.id);
    });
    // Get list of available applications
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User | null) => {
        this.applications = user?.applications || [];
      });
    // Subscribe to application change
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
        if (application) {
          this.loading = false;
          this.profileRoute =
            '/' +
            this.applicationService.getApplicationPath(application) +
            '/profile';
          this.title = application.name || '';
          this.htmlTitle.setTitle(this.title);
          this.adminNavItems = [];
          this.setAdminNavItems(application);
          this.setNavGroups(application);
          if (!this.application || application.id !== this.application.id) {
            const firstPage = get(application, 'pages', [])[0];
            if (
              this.router.url.endsWith(application?.id || '') ||
              (application?.shortcut &&
                this.router.url.endsWith(application?.shortcut || '')) ||
              !firstPage
            ) {
              // If a page is configured
              if (firstPage) {
                this.router.navigate(
                  [
                    `./${firstPage.type}/${
                      firstPage.type === ContentType.form
                        ? firstPage.id
                        : firstPage.content
                    }`,
                  ],
                  { relativeTo: this.route }
                );
              } else {
                this.router.navigate(['./'], { relativeTo: this.route });
              }
            }
          }
          this.application = application;
          this.sideMenu = this.application?.sideMenu ?? true;
          this.hideMenu = this.application?.hideMenu ?? false;
        } else {
          this.profileRoute = '/profile';
          this.title = '';
          this.htmlTitle.setTitle('Front-office');
          this.navGroups = [];
          if (this.applicationService.hasErrors) {
            this.router.navigate(['/auth/error']);
          }
        }
      });
  }

  /**
   * Opens an application, contacting the application service.
   *
   * @param application Application to open
   */
  onOpenApplication(application: Application): void {
    this.router.navigate([
      `/${this.applicationService.getApplicationPath(application)}`,
    ]);
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
   * Set nav groups ( sidenav )
   *
   * @param application Loading application
   */
  private setNavGroups(application: Application): void {
    this.navGroups = [
      {
        name: this.translate.instant('common.page.few'),
        navItems: application.pages
          ?.filter((x) => x.content)
          .map((x) => ({
            name: x.name,
            path:
              x.type === ContentType.form
                ? `./${x.type}/${x.id}`
                : `./${x.type}/${x.content}`,
            icon: x.icon || this.getNavIcon(x.type || ''),
            fontFamily: x.icon ? 'fa' : 'material',
            visible: x.visible,
          })),
      },
    ];
  }

  /**
   * Set admin nav items ( settings )
   *
   * @param application Loading application
   */
  private setAdminNavItems(application: Application): void {
    if (
      this.ability.can('read', subject('User', { application: application.id }))
    ) {
      // if can see users globally / can manage apps / can see users in app
      this.adminNavItems.push({
        name: this.translate.instant('common.user.few'),
        path: `./settings/users`,
        icon: 'supervisor_account',
      });
    }
    if (
      this.ability.can('read', subject('Role', { application: application.id }))
    ) {
      // if can see roles globally / can manage apps / can see roles in app
      this.adminNavItems.push({
        name: this.translate.instant('common.role.few'),
        path: `./settings/roles`,
        icon: 'admin_panel_settings',
      });
    }
    if (
      this.ability.can(
        'read',
        subject('EmailNotification', { application: application.id })
      )
    ) {
      // if can manage apps / can manage email notifications in app
      this.adminNavItems.push({
        name: this.translate.instant('common.email.notification.few'),
        path: './settings/email-notifications',
        icon: 'mail',
      });
    }
    if (
      this.ability.can('read', subject('User', { application: application.id }))
    ) {
      this.adminNavItems.push({
        name: this.translate.instant('common.activity.few'),
        path: './settings/activity-log',
        icon: 'timeline',
      });
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.applicationService.leaveApplication();
  }
}
