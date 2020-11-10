import { Component, OnDestroy, OnInit } from '@angular/core';
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
  public title = 'Front-office';

  private authSubscription: Subscription;
  private applicationSubscription: Subscription;

  // === AVAILABLE ROUTES, DEPENDS ON USER ===
  public navGroups = [];

  constructor(
    private authService: WhoAuthService,
    private applicationService: ApplicationService,
    private snackBar: WhoSnackBarService
  ) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.user.subscribe((user: User) => {
      if (user) {
        if (user.applications.length > 0) {
          this.applicationService.loadApplication(user.applications[0].id);
        } else {
          this.snackBar.openSnackBar('No access provided to the platform.', { error: true });
        }
      }
    });
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      if (application) {
        this.navGroups = [
          {
            name: application.name,
            navItems: application.pages.map(x => {
              return {
                name: x.name,
                path: '/',
                icon: 'dashboard'
              };
            })
          }
        ];
        console.log(this.navGroups);
      } else {
        this.navGroups = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.applicationSubscription.unsubscribe();
  }

}
