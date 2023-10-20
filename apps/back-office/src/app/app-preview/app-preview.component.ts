import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbilityBuilder } from '@casl/ability';
import { TranslateService } from '@ngx-translate/core';
import {
  AppAbility,
  Application,
  ContentType,
  ApplicationService,
  UnsubscribeComponent,
} from '@oort-front/shared';
import get from 'lodash/get';
import { takeUntil } from 'rxjs/operators';
import { PreviewService } from '../services/preview.service';

/**
 * Creates a ability object the app preview
 * given the application and the role to preview with
 *
 * @param app The application being previewed
 * @param role The role to preview with
 * @returns The ability object
 */
const getAbilityForAppPreview = (app: Application, role: string) => {
  const { can, rules } = new AbilityBuilder(AppAbility);
  const permissions =
    app.roles?.find((x) => x.id === role)?.permissions?.map((p) => p.type) ||
    [];
  // === Role ===
  if (permissions.includes('can_see_roles')) {
    can(['create', 'read', 'update', 'delete'], ['Role', 'Channel']);
  }

  // === User ===
  if (permissions.includes('can_see_users')) {
    can(['create', 'read', 'update', 'delete'], 'User');
  }

  // === Template ===
  if (permissions.includes('can_manage_templates')) {
    can(['create', 'read', 'update', 'delete', 'manage'], 'Template');
  }

  // === Distribution list ===
  if (permissions.includes('can_manage_distribution_lists')) {
    can(['create', 'read', 'update', 'delete', 'manage'], 'DistributionList');
  }

  // === Custom notifications===
  if (permissions.includes('can_manage_custom_notifications')) {
    can(['create', 'read', 'update', 'delete', 'manage'], 'CustomNotification');
  }

  return new AppAbility(rules);
};

/**
 * Main component of Application preview capacity.
 */
@Component({
  selector: 'app-app-preview',
  templateUrl: './app-preview.component.html',
  styleUrls: ['./app-preview.component.scss'],
})
export class AppPreviewComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /**
   * Title of application.
   */
  public title = '';
  /**
   * Nav Groups of the application.
   */
  public navGroups: any[] = [];
  /**
   * Current application.
   */
  public application: Application | null = null;
  /**
   * Role to preview with.
   */
  public role = '';
  /**
   * Use side menu or not.
   */
  public sideMenu = false;
  /**
   * Is large device.
   */
  public largeDevice: boolean;

  /**
   * Main component of Application preview capacity.
   *
   * @param route Current route
   * @param applicationService Shared application service
   * @param previewService Custom preview service
   * @param router Angular Router
   * @param translate Angular Translate service
   */
  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private previewService: PreviewService,
    private router: Router,
    private translate: TranslateService
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
   * Generates the routes from the application that is loaded.
   */
  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.previewService.roleId$
        .pipe(takeUntil(this.destroy$))
        .subscribe((role: string) => {
          this.applicationService.loadApplication(params.id, role);
          this.role = role;
        });
    });
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
        if (application) {
          this.title = application.name + ' (Preview)';
          const ability = getAbilityForAppPreview(application, this.role);
          const adminNavItems: any[] = [];
          this.sideMenu = application?.sideMenu ?? false;
          if (ability.can('read', 'User')) {
            adminNavItems.push({
              name: this.translate.instant('common.user.few'),
              path: './settings/users',
              icon: 'supervisor_account',
              visible: true,
            });
          }
          if (ability.can('read', 'Role')) {
            adminNavItems.push({
              name: this.translate.instant('common.role.few'),
              path: './settings/roles',
              icon: 'admin_panel_settings',
              visible: true,
            });
          }
          if (ability.can('manage', 'Template')) {
            adminNavItems.push({
              name: this.translate.instant('common.template.few'),
              path: './settings/templates',
              icon: 'description',
              visible: true,
            });
          }
          if (ability.can('manage', 'DistributionList')) {
            adminNavItems.push({
              name: this.translate.instant('common.distributionList.few'),
              path: './settings/distribution-lists',
              icon: 'mail',
              visible: true,
            });
          }
          if (ability.can('manage', 'CustomNotification')) {
            adminNavItems.push({
              name: this.translate.instant('common.customNotification.few'),
              path: './settings/notifications',
              icon: 'schedule_send',
              visible: true,
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
                      ? `./${x.type}/${x.id}`
                      : `./${x.type}/${x.content}`,
                  icon: x.icon || this.getNavIcon(x.type || ''),
                  fontFamily: x.icon ? 'fa' : 'material',
                  visible: x.visible ?? false,
                })),
            },
            {
              name: 'Administration',
              navItems: adminNavItems,
            },
          ];
          if (!this.application || application.id !== this.application.id) {
            const firstPage = get(application, 'pages', [])[0];
            if (
              this.router.url.endsWith('/') ||
              (this.application && application.id !== this.application?.id) ||
              !firstPage ||
              (!this.application && application)
            ) {
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
                this.router.navigate([`./`], { relativeTo: this.route });
              }
            }
          }
          this.application = application;
        } else {
          this.navGroups = [];
        }
      });
  }

  /**
   * Remove application data such as styling when exiting preview.
   */
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.applicationService.leaveApplication();
  }

  /**
   * Returns nav icon from the page's content type.
   *
   * @param type content type of the page.
   * @returns name of the icon.
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
}
