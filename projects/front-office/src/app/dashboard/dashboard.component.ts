import { Component, OnDestroy, OnInit } from '@angular/core';
import { User, WhoAuthService } from '@who-ems/builder';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  // === HEADER TITLE ===
  public title = 'Front-office';

  private authSubscription: Subscription;

  // === AVAILABLE ROUTES, DEPENDS ON USER ===
  public navGroups = [
    {
      name: 'Application',
      navItems: [
        {
          name: 'Dashboard',
          path: '/',
          icon: 'dashboard'
        }
      ]
    },
    {
      name: 'Administration',
      navItems: [
        {
          name: 'Users',
          path: '/settings/users',
          icon: 'supervisor_account'
        },
        {
          name: 'Roles',
          path: '/settings/roles',
          icon: 'admin_panel_settings'
        }
      ]
    }
  ];

  constructor(
    private authService: WhoAuthService
  ) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.user.subscribe((user: User) => {
      console.log(user);
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

}
