import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Application, Role, User, WhoAuthService, WhoSnackBarService, Permission, Permissions } from '@who-ems/builder';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../services/application.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  // === HEADER TITLE ===
  public title: string;
  public applications: Application[] = [];

  // === SUBSCRIPTIONS ===
  private authSubscription: Subscription;
  private applicationSubscription: Subscription;

  // === AVAILABLE ROUTES, DEPENDS ON USER ===
  private permissions: Permission[];
  public navGroups = [];

  constructor(
    private authService: WhoAuthService,
    private applicationService: ApplicationService,
    private snackBar: WhoSnackBarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.user.subscribe((user: User) => {
      if (user) {
        if (user.applications.length > 0) {
          this.applications = user.applications;
          this.applicationService.loadApplication(user.applications[0].id);
          this.permissions = user.permissions;
        } else {
          this.snackBar.openSnackBar('No access provided to the platform.', { error: true });
        }
      }
    });
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      if (application) {
        this.title = application.name;
        const adminNavItems = [];
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
            navItems: application.pages.filter(x => x.content).map(x => {
              return {
                name: x.name,
                path: `/${x.type}/${x.content}`,
                icon: this.getNavIcon(x.type)
              };
            })
          },
          {
            name: 'Administration',
            navItems: adminNavItems
          }
        ];
        // this.router.navigate([this.navGroups[0].navItems[0].path]);
      } else {
        this.navGroups = [];
      }
    });
  }

  onOpenApplication(application: Application): void {
    this.applicationService.loadApplication(application.id);
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
    this.authSubscription.unsubscribe();
    this.applicationSubscription.unsubscribe();
  }

}
