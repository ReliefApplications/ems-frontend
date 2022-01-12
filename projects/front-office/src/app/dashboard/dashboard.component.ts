import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Application, User, Role, SafeAuthService, SafeSnackBarService, SafeApplicationService,
  Permission, Permissions, ContentType, NOTIFICATIONS } from '@safe/builder';
import { Subscription } from 'rxjs';

/**
 * Main component of Front-Office navigation.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  /** Application title */
  public title = '';
  /** List of accessible applications */
  public applications: Application[] = [];
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
  /** Stores if an application has been loaded */
  private firstLoad = true;

  // === ROUTE ===
  private routeSubscription?: Subscription;

  /**
   * Main component of Front-Office navigation.
   *
   * @param authService Shared authentication service
   * @param applicationService Shared application service
   * @param route Angular current route
   * @param snackBar Shared snackbar service
   * @param router Angular router
   */
  constructor(
    private authService: SafeAuthService,
    private applicationService: SafeApplicationService,
    public route: ActivatedRoute,
    private snackBar: SafeSnackBarService,
    private router: Router
  ) { }

  /**
   * Subscribes to current user change, and application change.
   * On load, try to open the first application accessible to the user.
   */
  ngOnInit(): void {
    console.log('URL:');
    console.log(this.router.url);
    this.routeSubscription = this.route.params.subscribe((params) => {
      // this.applicationService.loadApplication(params.id);
      this.authSubscription = this.authService.user$.subscribe((user: User | null) => {
        console.log('apps');
        console.log(user?.applications);
        const applications = user?.applications || [];
        this.applications = applications;
        this.roles = user?.roles || [];
        this.permissions = user?.permissions || [];
        if (params.id) {
          console.log('ID!');
          console.log(params.id);
          this.applicationService.loadApplication(params.id);
          // console.log('%%%%    test    %%%%');
          // console.log(test);
        } else {
          if (user?.favoriteApp) {
            console.log('no ID + favorite');
            // this.applicationService.loadApplication(user.favoriteApp);
            this.router.navigate([`./${user.favoriteApp}`]);
          } else {
            if (applications.length > 0) {
              console.log('no ID + first app');
              // this.applicationService.loadApplication(applications[0].id || '');
              this.router.navigate([`./${applications[0].id || ''}`]);
            }
            else {
              console.log('no ID + no app accessible');
              this.snackBar.openSnackBar(NOTIFICATIONS.accessNotProvided('platform'), { error: true });
            }
          }
        }
        // if (user) {
        //   const applications = user.applications || [];
        //   console.log(applications);
        //   console.log(user.favoriteApp);
        //   if (applications.length > 0) {
        //     this.applications = applications;
        //     console.log(this.applications);
        //     if (this.firstLoad) {
        //       this.firstLoad = false;
        //       if (user.favoriteApp) {
        //         this.applicationService.loadApplication(user.favoriteApp);
        //       } else {
        //         this.applicationService.loadApplication(applications[0].id || '');
        //       }
        //     }
        //     this.roles = user.roles || [];
        //     this.permissions = user.permissions || [];
        //   } else {
        //     this.snackBar.openSnackBar(NOTIFICATIONS.accessNotProvided('platform'), { error: true });
        //   }
        // }
      });
    });
    this.applicationSubscription = this.applicationService.application$.subscribe((application: Application | null) => {
      if (application) {
        console.log('ID + accessible');
        // it's here that I have to managed and verify if I have a rroute (for the pages, dashboard, worrkflow id) after the app id (the 2 first cases).
        this.title = application.name || '';
        const adminNavItems: any[] = [];
        if (this.permissions.some(x => (x.type === Permissions.canSeeUsers
          && this.roles.some(y => y.application?.id === application.id && y.permissions?.some(perm => perm.id === x.id)))
          || (x.type === Permissions.canManageApplications && x.global))) {
          adminNavItems.push({
            name: 'Users',
            path: './settings/users',
            icon: 'supervisor_account'
          });
        }
        if (this.permissions.some(x => (x.type === Permissions.canSeeRoles
          && this.roles.some(y => y.application?.id === application.id && y.permissions?.some(perm => perm.id === x.id)))
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
            navItems: application.pages?.filter(x => x.content).map(x => ({
                name: x.name,
                path: (x.type === ContentType.form) ? `./${x.type}/${x.id}` : `./${x.type}/${x.content}`,
                icon: this.getNavIcon(x.type || '')
              }))
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
        this.authSubscription = this.authService.user$.subscribe((user: User | null) => {
          const applications = user?.applications || [];
          if (user?.favoriteApp) {
            console.log('ID + not accessible + favorite');
            this.router.navigate([`./${user.favoriteApp}`]);
          } else {
            if (applications.length > 0) {
              console.log('ID + not accessible + first app');
              // this.applicationService.loadApplication(applications[0].id || '');
              this.router.navigate([`./${applications[0].id || ''}`]);
            }
            else {
              console.log('ID + not accessible + no app accessible');
              this.snackBar.openSnackBar(NOTIFICATIONS.accessNotProvided('platform'), { error: true });
            }
          }
          this.navGroups = [];
        });
      }
    });
  }

  /**
   * Destroys all subscriptions made by the component.
   */
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
  onOpenApplication(application: Application): void {
    this.applicationService.loadApplication(application.id || '');
    this.router.navigate([`./${application.id || ''}`]);
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
}
