import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Application } from '@who-ems/builder';
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
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.applicationService.loadApplication(params.id);
    });
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      console.log(application);
      if (application) {
        this.application = application;
        this.title = application.name;
        this.navGroups = [
          {
            name: 'Pages',
            navItems: [
              {
                name: 'Add a page',
                path: '/add-page',
                icon: 'add_circle',
                class: 'nav-item-add'
              }
            ].concat(application.pages.filter(x => x.content).map(x => {
              return {
                name: x.name,
                path: `./${x.type}/${x.content}`,
                icon: 'dashboard',
                class: null
              };
            }))
          },
          {
            name: 'Admnistration',
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
      } else {
        this.title = '';
        this.navGroups = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.applicationSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }
}
