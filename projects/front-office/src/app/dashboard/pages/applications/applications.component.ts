import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Application,
  User,
  Role,
  SafeAuthService,
  SafeSnackBarService,
  SafeApplicationService,
  Permission,
} from '@safe/builder';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/**
 * Front-Office home page.
 */
@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent implements OnInit, OnDestroy {
  /** Application title */
  public title = '';
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
  /** User favorite page */
  public favorite = '';
  /** User subscription */
  private authSubscription?: Subscription;
  /** Current user */
  private user: User | null = null;

  /**
   * Front-Office home page.
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
    private applicationService: SafeApplicationService,
    public route: ActivatedRoute,
    private snackBar: SafeSnackBarService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.title = translate.instant('common.myApplications');
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.user$.subscribe(
      (user: User | null) => {
        if (user) {
          this.user = user;
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

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  /**
   * Opens an application, contacting the application service.
   *
   * @param appID The id of the application to open
   */
  onOpenApplication(appID: any): void {
    this.applicationService.loadApplication(appID);
  }
}
