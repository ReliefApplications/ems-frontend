import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Application, User, WhoAuthService, WhoSnackBarService } from '@who-ems/builder';
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

  private authSubscription: Subscription;
  private applicationSubscription: Subscription;

  // === AVAILABLE ROUTES, DEPENDS ON USER ===
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
          this.applicationService.loadApplication(user.applications[1].id);
        } else {
          this.snackBar.openSnackBar('No access provided to the platform.', { error: true });
        }
      }
    });
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      if (application) {
        this.title = application.name;
        this.navGroups = [
          {
            name: 'Pages',
            navItems: application.pages.filter(x => x.content).map(x => {
              return {
                name: x.name,
                path: `/${x.type}/${x.content}`,
                icon: 'dashboard'
              };
            })
          },
          {
            name: 'Administration',
            navItems: [
              {
                name: 'Users',
                path: './settings/users',
                icon: 'supervisor_account'
              },
              {
                name: 'Roles',
                path: './settings/roles',
                icon: 'admin_panel_settings'
              }
            ]
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

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.applicationSubscription.unsubscribe();
  }

}
