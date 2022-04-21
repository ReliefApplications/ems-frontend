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
  public navGroups: any[] = [];

  constructor(private translate: TranslateService) {
    this.setNavGroups();
    translate.onLangChange.subscribe(() => {
      this.setNavGroups();
    });
  }

  ngOnInit(): void {}

  setNavGroups(): void {
    this.navGroups = [
      {
        name: this.translate.instant('pages.appBuilder.title'),
        navItems: [
          {
            name: this.translate.instant('pages.applications.title'),
            path: '/applications',
            icon: 'apps',
          },
        ],
      },
      {
        name: this.translate.instant('pages.formBuilder.title'),
        navItems: [
          {
            name: this.translate.instant('common.form.few'),
            path: '/forms',
            icon: 'poll',
          },
          {
            name: this.translate.instant('common.resource.few'),
            path: '/resources',
            icon: 'storage',
          },
        ],
      },
      {
        name: this.translate.instant('pages.administration.title'),
        navItems: [
          {
            name: this.translate.instant('common.user.few'),
            path: '/settings/users',
            icon: 'supervisor_account',
          },
          {
            name: this.translate.instant('common.role.few'),
            path: '/settings/roles',
            icon: 'admin_panel_settings',
          },
          {
            name: this.translate.instant('common.apiConfiguration.few'),
            path: '/settings/apiconfigurations',
            icon: 'settings_input_composite',
          },
          {
            name: this.translate.instant('common.pullJob.few'),
            path: '/settings/pulljobs',
            icon: 'cloud_download',
          },
        ],
      },
    ];
  }
}
