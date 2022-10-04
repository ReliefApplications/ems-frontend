import { Component, OnInit } from '@angular/core';
import {
  Application,
  User,
  Role,
  SafeAuthService,
  SafeSnackBarService,
  SafeApplicationService,
  Permission,
  Permissions,
  ContentType,
} from '@safe/builder';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-applications',
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent implements OnInit {
    /** Application title */
    public title = '';
    /** Stores current app ID */
    public appID = '';
    /** Stores current app page */
    public appPage = '';
    /** List of accessible applications */
    public applications: Application[] = [];
    /** List of application pages */
    public navGroups: any[] = [];
    /** Current application */
    public application: Application | null = null;
    /** User subscription */
    private authSubscription?: Subscription;

    public favorite = '';

    public loading = false;

/**
   * Main component of Front-Office navigation.
   *
   * @param authService Shared authentication service
   * @param applicationService Shared application service
   * @param route Angular current route
   * @param snackBar Shared snackbar service
   * @param router Angular router
   * @param translate Angular translate service
   */
  constructor(
    private authService: SafeAuthService,
    public route: ActivatedRoute,
    private snackBar: SafeSnackBarService,
    private router: Router,
    private translate: TranslateService
  ) {}


  ngOnInit(): void {
    console.log("init My application");
    this.authSubscription = this.authService.user$.subscribe(
      (user: User | null) => {
        if (user) {
          // this.favorite = '63204a5987cde9001e1176b2';
          this.favorite = user.favoriteApp || '';
          console.log("USER FAVORITE APP", user);
          const applications = user.applications || [];
          if (applications.length > 0) {
            this.applications = applications;
            console.log(this.applications[0].pages);
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant(
                'common.notifications.platformAccessNotGranted'
              ),
              { error: true }
            );
          }
        }
      }
    );
  }

  /**
   * Opens an application, contacting the application service.
   *
   * @param application Application to open
   */
  onOpenApplication(appID: any): void {
    console.log("TEST");
    console.log(appID);
    console.log('/' + (appID || ''));
    this.router.navigate(['/dashboard/' + (appID || '')]);
  }

  /**
   * Search all informations needed.
   * 
   * 
   */
  getApplicationsInfo(): any[] {
    let applicationsInfo: any[] = [];
    return applicationsInfo;
  }
}
