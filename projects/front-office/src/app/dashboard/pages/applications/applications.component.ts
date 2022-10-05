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
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
    /** Application title */
    public title = 'Front-Office';
    /** Stores current app ID */
    public appID = '';
    /** Stores current app page */
    public appPage = '';
    /** List of accessible applications */
    public applications: Application[] = [];
    /** List of list of accessible applications */
    public applicationsList: Application[][] = [];
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
    console.log("TEST");
    this.authSubscription = this.authService.user$.subscribe(
      (user: User | null) => {
        if (user) {
          // this.favorite = '63204a5987cde9001e1176b2';
          this.favorite = user.favoriteApp || '';
          this.applications = user.applications || [];
          if (this.applications.length === 0) {
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
    console.log((appID || ''));
    this.router.navigate([`${appID}`]);
  }
}
