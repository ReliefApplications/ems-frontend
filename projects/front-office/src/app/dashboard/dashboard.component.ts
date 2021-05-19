import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Application, User, SafeAuthService, SafeSnackBarService, SafeApplicationService,
  Permission, Permissions, ContentType, NOTIFICATIONS } from '@safe/builder';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  // === HEADER TITLE ===
  public title = '';
  public applications: Application[] = [];

  // === SUBSCRIPTIONS ===
  private authSubscription?: Subscription;
  public application: Application | null = null;
  private applicationSubscription?: Subscription;

  // === AVAILABLE ROUTES, DEPENDS ON USER ===
  private permissions: Permission[] = [];
  public navGroups: any[] = [];

  private firstLoad = true;

  constructor(
    private authService: SafeAuthService,
    private applicationService: SafeApplicationService,
    public route: ActivatedRoute,
    private snackBar: SafeSnackBarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.user.subscribe((user: User | null) => {
      if (user) {
        const applications = user.applications || [];
        if (applications.length > 0) {
          this.applications = applications;
          if (this.firstLoad) {
            this.firstLoad = false;
            if (user.favoriteApp) {
              this.applicationService.loadApplication(user.favoriteApp);
            } else {
              this.applicationService.loadApplication(applications[0].id || '');
            }
          }
          this.permissions = user.permissions || [];
        } else {
          this.snackBar.openSnackBar(NOTIFICATIONS.accessNotProvided('platform'), { error: true });
        }
      }
    });
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application | null) => {
      if (application) {
        this.title = application.name || '';
        const adminNavItems: any[] = [];
        if (this.permissions.some(x => (x.type === Permissions.canSeeUsers && !x.global)
          || (x.type === Permissions.canManageApplications && x.global))) {
          adminNavItems.push({
            name: 'Users',
            path: './settings/users',
            icon: 'supervisor_account'
          });
        }
        if (this.permissions.some(x => (x.type === Permissions.canSeeRoles && !x.global)
          || (x.type === Permissions.canManageApplications && x.global))) {
          adminNavItems.push({
            name: 'Roles',
            path: './settings/roles',
            icon: 'admin_panel_settings'
          });
        }
        this.navGroups = [
          {
            name: 'Pages',
            navItems: application.pages?.filter(x => x.content).map(x => {
              return {
                name: x.name,
                path: (x.type === ContentType.form) ? `./${x.type}/${x.id}` : `./${x.type}/${x.content}`,
                icon: this.getNavIcon(x.type || '')
              };
            })
          },
          {
            name: 'Administration',
            navItems: adminNavItems
          }
        ];
        if (!this.application || application.id !== this.application.id) {
          const [firstPage, ..._] = application.pages || [];
          if (this.router.url.endsWith('/') || (application.id !== this.application?.id) || !firstPage) {
            if (firstPage) {
              this.router.navigate([`./${firstPage.type}/${firstPage.type === ContentType.form ? firstPage.id : firstPage.content}`],
              { relativeTo: this.route });
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

  onOpenApplication(application: Application): void {
    this.applicationService.loadApplication(application.id || '');
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

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }

}
