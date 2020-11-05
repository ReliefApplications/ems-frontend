import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // === HEADER TITLE ===
  public title = 'Front-office';

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

  constructor() { }

  ngOnInit(): void {
  }

}
