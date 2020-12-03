import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Application, Permissions, WhoAuthService } from '@who-ems/builder';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { ApplicationService } from '../services/application.service';
import { PreviewService } from '../services/preview.service';

@Component({
  selector: 'app-app-preview',
  templateUrl: './app-preview.component.html',
  styleUrls: ['./app-preview.component.scss']
})
export class AppPreviewComponent implements OnInit, OnDestroy {

  // === HEADER TITLE ===
  public title: string;

  // === AVAILABLE ROUTES, DEPENDS ON USER ===
  public navGroups = [];

  // === APPLICATION ===
  private applicationSubscription: Subscription;

  // === PREVIEWED ROLE ID ===
  public role: string;

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private previewService: PreviewService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.previewService.roleId.subscribe((role: string) => {
        this.applicationService.loadApplication(params.id, role);
        this.role = role;
      });
    });
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      if (application) {
        this.title = application.name + ' (Preview)';
        const role = application.roles.find(x => this.role ? x.id === this.role : true);
        const adminNavItems = [];
        if (role.permissions.some(x => x.type === Permissions.canSeeUsers && !x.global)) {
          adminNavItems.push({
            name: 'Users',
            path: './settings/users',
            icon: 'supervisor_account'
          });
        }
        if (role.permissions.some(x => x.type === Permissions.canSeeRoles && !x.global)) {
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
                path: `./${x.type}/${x.content}`,
                icon: this.getNavIcon(x.type)
              };
            })
          },
          {
            name: 'Administration',
            navItems: adminNavItems
          }
        ];
      } else {
        this.navGroups = [];
      }
    });
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
    this.applicationSubscription.unsubscribe();
  }

}
