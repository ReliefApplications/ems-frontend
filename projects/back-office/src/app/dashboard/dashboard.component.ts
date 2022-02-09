import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // === HEADER TITLE ===
  public title = 'Back-office';

  // === AVAILABLE ROUTES, DEPENDS ON USER ===
  public navGroups = [
    {
      name: 'Site builder',
      navItems: [
        // Commented in order to prevent confusion about dashboards
        // {
        //   name: 'My dashboards',
        //   path: '/dashboards',
        //   icon: 'dashboard',
        // },
        {
          name: 'My applications',
          path: '/applications',
          icon: 'apps',
        },
      ],
    },
    {
      name: 'Advanced settings',
      navItems: [
        {
          name: 'Forms',
          path: '/forms',
          icon: 'poll',
        },
        {
          name: 'Resources',
          path: '/resources',
          icon: 'storage',
        },
      ],
    },
    {
      name: 'Administration',
      navItems: [
        {
          name: 'Users',
          path: '/settings/users',
          icon: 'supervisor_account',
        },
        {
          name: 'Roles',
          path: '/settings/roles',
          icon: 'admin_panel_settings',
        },
        {
          name: 'API Configurations',
          path: '/settings/apiconfigurations',
          icon: 'settings_input_composite',
        },
        {
          name: 'Pull jobs',
          path: '/settings/pulljobs',
          icon: 'cloud_download',
        },
      ],
    },
  ];

  constructor(translate: TranslateService) {
    translate.stream('ID').subscribe(() => {
      this.navGroups[0].name = translate.instant('sidenav.builder');
      this.navGroups[0].navItems[0].name = translate.instant('sidenav.apps');
      this.navGroups[1].name = translate.instant('sidenav.advanced');
      this.navGroups[1].navItems[0].name = translate.instant('sidenav.forms');
      this.navGroups[1].navItems[1].name =
        translate.instant('sidenav.resources');
      this.navGroups[2].name = translate.instant('sidenav.administration');
      this.navGroups[2].navItems[0].name = translate.instant('global.users');
      this.navGroups[2].navItems[1].name = translate.instant('global.roles');
      this.navGroups[2].navItems[2].name = translate.instant('table.APIConf');
      this.navGroups[2].navItems[3].name =
        translate.instant('sidenav.pullJobs');
    });
  }

  ngOnInit(): void {}
}
