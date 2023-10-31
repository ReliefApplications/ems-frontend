import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppAbility, UnsubscribeComponent } from '@oort-front/shared';
import { takeUntil } from 'rxjs';

/**
 * Main BO dashboard component
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends UnsubscribeComponent {
  // === HEADER TITLE ===
  public title = 'Back-office';

  // === AVAILABLE ROUTES, DEPENDS ON USER ===
  public navGroups: any[] = [];

  /**
   * Main BO dashboard component
   *
   * @param translate Angular translate service
   * @param ability user ability
   */
  constructor(
    private translate: TranslateService,
    private ability: AppAbility
  ) {
    super();
    this.setNavGroups();
    translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.setNavGroups();
    });
  }

  /**
   * Set the navigation items, from the permissions of user.
   */
  setNavGroups(): void {
    const navGroups = [];
    // Site builder items ( applications )
    const siteBuilderItems = [];
    if (this.ability.can('read', 'Application')) {
      siteBuilderItems.push({
        name: this.translate.instant('pages.applications.title'),
        path: '/applications',
        icon: 'apps',
      });
    }
    if (siteBuilderItems.length > 0) {
      navGroups.push({
        name: this.translate.instant('pages.appBuilder.title'),
        navItems: siteBuilderItems,
      });
    }
    // Data items ( forms / resources / ref data )
    const dataItems = [];
    if (this.ability.can('read', 'Form')) {
      dataItems.push({
        name: this.translate.instant('common.form.few'),
        path: '/forms',
        icon: 'poll',
      });
    }
    if (this.ability.can('read', 'Resource')) {
      dataItems.push({
        name: this.translate.instant('common.resource.few'),
        path: '/resources',
        icon: 'storage',
      });
    }
    if (this.ability.can('read', 'ReferenceData')) {
      dataItems.push({
        name: this.translate.instant('common.referenceData.few'),
        path: '/referencedata',
        icon: 'cloud_download',
      });
    }
    if (dataItems.length > 0) {
      navGroups.push({
        name: this.translate.instant('pages.formBuilder.title'),
        navItems: dataItems,
      });
    }
    // Administrative items ( users / roles / APIs / automated actions )
    const administrationItems = [];
    if (this.ability.can('read', 'User')) {
      administrationItems.push({
        name: this.translate.instant('common.user.few'),
        path: '/settings/users',
        icon: 'supervisor_account',
      });
    }
    if (this.ability.can('read', 'Role')) {
      administrationItems.push({
        name: this.translate.instant('common.role.few'),
        path: '/settings/roles',
        icon: 'admin_panel_settings',
      });
    }
    if (this.ability.can('read', 'ApiConfiguration')) {
      administrationItems.push({
        name: this.translate.instant('common.apiConfiguration.few'),
        path: '/settings/apiconfigurations',
        icon: 'settings_input_composite',
      });
    }
    if (this.ability.can('read', 'PullJob')) {
      administrationItems.push({
        name: this.translate.instant('common.pullJob.few'),
        path: '/settings/pulljobs',
        icon: 'cloud_download',
      });
    }
    if (administrationItems.length > 0) {
      navGroups.push({
        name: this.translate.instant('pages.administration.title'),
        navItems: administrationItems,
      });
    }

    this.navGroups = navGroups;
  }
}
