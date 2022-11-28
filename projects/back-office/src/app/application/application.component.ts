import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  Application,
  ContentType,
  SafeApplicationService,
  SafeConfirmService,
} from '@safe/builder';
import { Subscription } from 'rxjs';

/**
 * Main component of Application view.
 */
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent implements OnInit, OnDestroy {
  // === HEADER TITLE ===

  public title = '';

  // === AVAILABLE ROUTES, DEPENDS ON USER ===
  public navGroups: any[] = [];
  public adminNavItems: any[] = [];

  // === APPLICATION ===
  public application?: Application;
  private applicationSubscription?: Subscription;

  // === ROUTE ===
  private routeSubscription?: Subscription;

  /**
   * Main component of application view
   *
   * @param applicationService Shared application service
   * @param route Angular activated route
   * @param router Angular router
   * @param translate Angular translate service
   * @param confirmService Shared confirmation service
   */
  constructor(
    private applicationService: SafeApplicationService,
    public route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private confirmService: SafeConfirmService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.applicationService.loadApplication(params.id);
    });
    this.applicationSubscription =
      this.applicationService.application$.subscribe(
        (application: Application | null) => {
          if (application) {
            this.title = application.name || '';
            const displayNavItems: any[] =
              application.pages
                ?.filter((x: any) => x.content && x.canSee)
                .map((x: any) => ({
                  id: x.id,
                  name: x.name,
                  path:
                    x.type === ContentType.form
                      ? `./${x.type}/${x.id}`
                      : `./${x.type}/${x.content}`,
                  icon: this.getNavIcon(x.type || ''),
                  class: null,
                  orderable: true,
                  action: x.canDelete && {
                    icon: 'delete',
                    toolTip: this.translate.instant('common.deleteObject', {
                      name: this.translate
                        .instant('common.page.one')
                        .toLowerCase(),
                    }),
                    callback: () => this.onDelete(x),
                  },
                })) || [];
            if (application.canUpdate) {
              this.adminNavItems = [
                {
                  name: this.translate.instant('common.settings'),
                  path: './settings/edit',
                  icon: 'settings',
                },
                {
                  name: this.translate.instant('common.template.few'),
                  path: './settings/templates',
                  icon: 'description',
                },
                {
                  name: this.translate.instant('common.distributionList.few'),
                  path: './settings/distribution-lists',
                  icon: 'mail',
                },
                {
                  name: this.translate.instant('common.customNotification.few'),
                  path: './settings/notifications',
                  icon: 'schedule_send',
                },
                {
                  name: this.translate.instant('common.user.few'),
                  path: './settings/users',
                  icon: 'supervisor_account',
                },
                {
                  name: this.translate.instant('common.role.few'),
                  path: './settings/roles',
                  icon: 'verified_user',
                },
                {
                  name: this.translate.instant(
                    'pages.application.positionAttributes.title'
                  ),
                  path: './settings/position',
                  icon: 'edit_attributes',
                },
                {
                  name: this.translate.instant('common.channel.few'),
                  path: './settings/channels',
                  icon: 'dns',
                },
                {
                  name: this.translate.instant('common.subscription.few'),
                  path: './settings/subscriptions',
                  icon: 'add_to_queue',
                },
              ];
            }
            this.navGroups = [
              {
                name: this.translate.instant('common.page.few'),
                navItems: displayNavItems,
              },
            ];
            if (!this.application || application.id !== this.application.id) {
              const [firstPage, ..._] = application.pages || [];
              if (
                this.router.url.endsWith(application?.id || '') ||
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
            this.title = '';
            this.navGroups = [];
          }
        }
      );
  }

  /**
   * Get icons from type of page
   *
   * @param type type of page
   * @returns icon as string
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
   * Delete item, prompt for confirmation
   *
   * @param item item to delete
   */
  onDelete(item: any): void {
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('common.deleteObject', {
        name: this.translate.instant('common.page.one'),
      }),
      content: this.translate.instant(
        'components.application.pages.delete.confirmationMessage',
        { name: item.name }
      ),
      confirmText: this.translate.instant('components.confirmModal.delete'),
      confirmColor: 'warn',
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.applicationService.deletePage(item.id);
      }
    });
  }

  /**
   * Reorder pages
   *
   * @param event Reorder event
   */
  onReorder(event: any): void {
    this.applicationService.reorderPages(
      event.filter((x: any) => x.id).map((x: any) => x.id)
    );
  }

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
      this.applicationService.leaveApplication();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
