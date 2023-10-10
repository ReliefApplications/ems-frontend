import { OverlayContainer } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { AppOverlayContainer } from '../../utils/overlay-container';
import { SnackbarService } from '@oort-front/ui';
import { POPUP_CONTAINER } from '@progress/kendo-angular-popup';
import {
  AppAbility,
  Application,
  ApplicationService,
  AuthService,
  ContentType,
  UnsubscribeComponent,
  User,
} from '@oort-front/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';
import get from 'lodash/get';
import { subject } from '@casl/ability';

/** App web widget component */
@Component({
  selector: 'oort-web-widget-app',
  templateUrl: './app-widget.component.html',
  styleUrls: ['./app-widget.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class AppWidgetComponent
  extends UnsubscribeComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  /** Stores current app ID */
  @Input() appID = '64df1988ffe0085b6ce5a2c1';

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
  /** Is large device */
  public largeDevice: boolean;
  /** Is loading */
  public loading = true;

  /**
   * Form web widget component
   *
   * @param overlayContainer Angular overlay container
   * @param snackBarService SnackbarService,
   * @param el ElementRef
   * @param injector Injector
   */
  constructor(
    private overlayContainer: OverlayContainer,
    private snackBarService: SnackbarService,
    private authService: AuthService,
    private applicationService: ApplicationService,
    public route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private ability: AppAbility,
    el: ElementRef,
    injector: Injector
  ) {
    super();
    this.largeDevice = window.innerWidth > 1024;
    const kendoPopupHost = injector.get(POPUP_CONTAINER);
    kendoPopupHost.nativeElement = el.nativeElement.shadowRoot;
    this.snackBarService.shadowDom = el.nativeElement.shadowRoot;
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

    this.loading = true;
    this.applicationService.loadApplication(this.appID);

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
          this.title = application.name || '';
          this.adminNavItems = [];
          this.setAdminNavItems(application);
          this.setNavGroups(application);
          if (!this.application || application.id !== this.application.id) {
            const firstPage = get(application, 'pages', [])[0];
            if (this.router.url.endsWith(application?.id || '') || !firstPage) {
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
          this.sideMenu = this.application?.sideMenu ?? false;
        } else {
          this.title = '';
          this.navGroups = [];
        }
      });
  }

  ngAfterViewInit(): void {
    const test: AppOverlayContainer = this
      .overlayContainer as AppOverlayContainer;
    test.updateContainer('app-widget');
  }

  /**
   * Opens an application, contacting the application service.
   *
   * @param application Application to open
   */
  onOpenApplication(application: Application): void {
    this.router.navigate([`/${application.id}`]);
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
        name: 'Pages',
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
        'manage',
        subject('Template', { application: application.id })
      )
    ) {
      // if can manage apps / can manage templates in app
      this.adminNavItems.push({
        name: this.translate.instant('common.template.few'),
        path: `./settings/templates`,
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
        path: `./settings/distribution-lists`,
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
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.applicationService.leaveApplication();
  }
}
