import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  Application,
  ContentType,
  Permissions,
  SafeApplicationService,
} from '@safe/builder';
import get from 'lodash/get';
import { Subscription } from 'rxjs';
import { PreviewService } from '../services/preview.service';

/**
 * Main component of Application preview capacity.
 */
@Component({
  selector: 'app-app-preview',
  templateUrl: './app-preview.component.html',
  styleUrls: ['./app-preview.component.scss'],
})
export class AppPreviewComponent implements OnInit, OnDestroy {
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
   * Subscription to application service.
   */
  private applicationSubscription?: Subscription;

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
    private applicationService: SafeApplicationService,
    private previewService: PreviewService,
    private router: Router,
    private translate: TranslateService
  ) {}

  /**
   * Generates the routes from the application that is loaded.
   */
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.previewService.roleId$.subscribe((role: string) => {
        this.applicationService.loadApplication(params.id, role);
        this.role = role;
      });
    });
    this.applicationSubscription =
      this.applicationService.application$.subscribe(
        (application: Application | null) => {
          if (application) {
            this.title = application.name + ' (Preview)';
            const role = application.roles?.find((x) =>
              this.role ? x.id === this.role : true
            );
            const adminNavItems = [];
            if (role) {
              if (
                role.permissions?.some(
                  (x) => x.type === Permissions.canSeeUsers && !x.global
                )
              ) {
                adminNavItems.push({
                  name: this.translate.instant('common.user.few'),
                  path: './settings/users',
                  icon: 'supervisor_account',
                });
              }
              if (
                role.permissions?.some(
                  (x) => x.type === Permissions.canSeeRoles && !x.global
                )
              ) {
                adminNavItems.push({
                  name: this.translate.instant('common.role.few'),
                  path: './settings/roles',
                  icon: 'admin_panel_settings',
                });
              }
              if (
                role.permissions?.some(
                  (x) => x.type === Permissions.canManageTemplates && !x.global
                )
              ) {
                adminNavItems.push({
                  name: this.translate.instant('common.template.few'),
                  path: './settings/templates',
                  icon: 'description',
                });
              }
              if (
                role.permissions?.some(
                  (x) =>
                    x.type === Permissions.canManageDistributionLists &&
                    !x.global
                )
              ) {
                adminNavItems.push({
                  name: this.translate.instant('common.distributionList.few'),
                  path: './settings/distribution-lists',
                  icon: 'mail',
                });
              }
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
                    icon: this.getNavIcon(x.type || ''),
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
                !firstPage
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
        }
      );
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

  /**
   * Deletes all subscriptions of the component.
   */
  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
