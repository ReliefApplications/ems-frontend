import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Application, ContentType, Permissions, SafeApplicationService } from '@safe/builder';
import { Subscription } from 'rxjs';
import { PreviewService } from '../services/preview.service';

@Component({
  selector: 'app-app-preview',
  templateUrl: './app-preview.component.html',
  styleUrls: ['./app-preview.component.scss']
})
export class AppPreviewComponent implements OnInit, OnDestroy {

  // === HEADER TITLE ===
  public title = '';

  // === AVAILABLE ROUTES, DEPENDS ON USER ===
  public navGroups: any[] = [];

  // === APPLICATION ===
  public application: Application | null = null;
  private applicationSubscription?: Subscription;

  // === PREVIEWED ROLE ID ===
  public role = '';

  constructor(
    private route: ActivatedRoute,
    private applicationService: SafeApplicationService,
    private previewService: PreviewService,
    private router: Router
  ) { }

  /**
   * Generates the routes from the application that is loaded.
   */
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.previewService.roleId$.subscribe((role: string) => {
        this.applicationService.loadApplication(params.id, role);
        this.role = role;
      });
    });
    this.applicationSubscription = this.applicationService.application$.subscribe((application: Application | null) => {
      if (application) {
        this.title = application.name + ' (Preview)';
        const role = application.roles?.find(x => this.role ? x.id === this.role : true);
        const adminNavItems = [];
        if (role) {
          if (role.permissions?.some(x => x.type === Permissions.canSeeUsers && !x.global)) {
            adminNavItems.push({
              name: 'Users',
              path: './settings/users',
              icon: 'supervisor_account'
            });
          }
          if (role.permissions?.some(x => x.type === Permissions.canSeeRoles && !x.global)) {
            adminNavItems.push({
              name: 'Roles',
              path: './settings/roles',
              icon: 'admin_panel_settings'
            });
          }
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
          if (this.router.url.endsWith('/') || (this.application && (application.id !== this.application?.id)) || !firstPage) {
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

  /**
   * Returns nav icon from the page's content type.
   *
   * @param type content type of the page.
   * @returns name of the icon.
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

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
