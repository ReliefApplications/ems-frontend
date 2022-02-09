import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  Application,
  SafeConfirmModalComponent,
  ContentType,
  SafeApplicationService,
} from '@safe/builder';
import { Subscription } from 'rxjs';

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

  // === APPLICATION ===
  public application?: Application;
  private applicationSubscription?: Subscription;

  // === ROUTE ===
  private routeSubscription?: Subscription;

  constructor(
    private applicationService: SafeApplicationService,
    public route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private translate: TranslateService
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
            let displayNavItems: any[] =
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
                    toolTip: 'Delete the page',
                    callback: () => this.onDelete(x),
                  },
                })) || [];
            let adminNavItems: any[] = [];
            if (application.canUpdate) {
              displayNavItems = displayNavItems.concat({
                name: 'Add a page',
                path: './add-page',
                icon: 'add_circle',
                class: 'nav-item-add',
                isAddPage: true,
              });
              adminNavItems = adminNavItems.concat([
                {
                  name: this.translate.instant('global.settings'),
                  path: './settings/edit',
                  icon: 'settings',
                },
                {
                  name: this.translate.instant('global.users'),
                  path: './settings/users',
                  icon: 'supervisor_account',
                },
                {
                  name: this.translate.instant('global.roles'),
                  path: './settings/roles',
                  icon: 'admin_panel_settings',
                },
                {
                  name: this.translate.instant('sidenav.attributes'),
                  path: './settings/position',
                  icon: 'manage_accounts',
                },
                {
                  name: this.translate.instant('global.channels'),
                  path: './settings/channels',
                  icon: 'edit_notifications',
                },
                {
                  name: this.translate.instant('sidenav.subscriptions'),
                  path: './settings/subscriptions',
                  icon: 'move_to_inbox',
                },
              ]);
            }
            this.navGroups = [
              {
                name: this.translate.instant('global.display'),
                navItems: displayNavItems,
              },
              {
                name: this.translate.instant('sidenav.administration'),
                navItems: adminNavItems,
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

  onDelete(item: any): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: 'Delete page',
        content: `Do you confirm the deletion of the page ${item.name} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.applicationService.deletePage(item.id);
      }
    });
  }

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
