import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Application, WhoConfirmModalComponent, ContentType } from '@who-ems/builder';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../services/application.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit, OnDestroy {

  // === HEADER TITLE ===
  public title: string;

  // === AVAILABLE ROUTES, DEPENDS ON USER ===
  public navGroups = [];

  // === APPLICATION ===
  public application: Application;
  private applicationSubscription: Subscription;

  // === ROUTE ===
  private routeSubscription: Subscription;

  constructor(
    private applicationService: ApplicationService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.applicationService.loadApplication(params.id);
    });
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      if (application) {
        this.application = application;
        this.title = application.name;
        this.navGroups = [
          {
            name: 'Display',
            callback: (event) => this.onReorder(event),
            navItems: []
            .concat(application.pages.filter(x => x.content).map(x => {
              return {
                id: x.id,
                name: x.name,
                path: (x.type === ContentType.form) ? `./${x.type}/${x.id}` : `./${x.type}/${x.content}`,
                icon: this.getNavIcon(x.type),
                class: null,
                orderable: true,
                action: {
                  icon: 'delete',
                  callback: () => this.onDelete(x)
                }
              };
            }))
            .concat(
              {
                name: 'Add a page',
                path: './add-page',
                icon: 'add_circle',
                class: 'nav-item-add',
                isAddPage: true
              }
            )
          },
          {
            name: 'Administration',
            navItems: [
              {
                name: 'Settings',
                path: './settings/edit',
                icon: 'settings'
              }
              ,
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
      } else {
        this.title = '';
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

  onDelete(item: any): void {
    const dialogRef = this.dialog.open(WhoConfirmModalComponent, {
      data: {
        title: 'Delete page',
        content: `Do you confirm the deletion of the page ${item.name} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if ( value ) { this.applicationService.deletePage(item.id); }
    });
  }

  onReorder(event: any): void {
    this.applicationService.reorderPages(event.filter(x => x.id).map(x => x.id));
  }

  ngOnDestroy(): void {
    this.applicationSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }
}
