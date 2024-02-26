import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Application,
  ApplicationService,
  ContentType,
  UnsubscribeComponent,
} from '@oort-front/shared';
import get from 'lodash/get';
import { takeUntil } from 'rxjs/operators';

/**
 * Front-office Application component.
 */
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** Application title */
  public title = '';
  /** Current application */
  public application: Application | null = null;
  /** Use side menu or not */
  public sideMenu = false;
  /** Should hide menu by default ( only when vertical ) */
  public hideMenu = false;
  /** Is large device */
  public largeDevice: boolean;
  /** Loading indicator */
  public loading = true;

  /**
   * Front-office Application component.
   *
   * @param applicationService Shared application service
   * @param route Angular current route
   * @param router Angular router service
   */
  constructor(
    private applicationService: ApplicationService,
    public route: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.largeDevice = window.innerWidth > 1024;
  }

  /**
   * Change the display depending on windows size.
   *
   * @param event Event that implies a change in window size
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.largeDevice = event.target.innerWidth > 1024;
  }

  /**
   * Subscribes to current user change, and application change.
   * On load, try to open the first application accessible to the user.
   */
  ngOnInit(): void {
    this.setUpApplicationListeners();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.applicationService.leaveApplication();
  }

  /**
   * Initialize all the needed listeners to load the application content
   */
  private setUpApplicationListeners() {
    // Subscribe to params change
    // this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
    //   if (this.application) {
    //     if (params.id !== this.application.id) {
    //       this.loading = true;
    //       this.applicationService.loadApplication(params.id);
    //     }
    //   } else {
    //     this.loading = true;
    //     this.applicationService.loadApplication(params.id);
    //   }
    // });
    // Subscribe to application change
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
        if (application) {
          this.loading = false;
          this.title = application.name || '';
          if (!this.application || application.id !== this.application.id) {
            const firstPage = get(application, 'pages', [])[0];
            if (this.router.url.endsWith(application?.id || '') || !firstPage) {
              // If a page is configured
              if (firstPage) {
                this.router.navigate(
                  [
                    `./${firstPage.type}/${
                      firstPage.type === ContentType.form
                        ? firstPage.id
                        : firstPage.content
                    }`,
                  ],
                  { relativeTo: this.route }
                );
              } else {
                this.router.navigate(['./'], {
                  relativeTo: this.route,
                });
              }
            } else {
              if (!this.router.url.includes(application?.id || '')) {
                // If a page is configured
                if (firstPage) {
                  this.router.navigate(
                    [
                      `./${firstPage.type}/${
                        firstPage.type === ContentType.form
                          ? firstPage.id
                          : firstPage.content
                      }`,
                    ],
                    { relativeTo: this.route }
                  );
                } else {
                  this.router.navigate(['./'], {
                    relativeTo: this.route,
                  });
                }
              }
            }
          }
          this.application = application;
          this.hideMenu = this.application?.hideMenu ?? false;
        } else {
          this.title = '';
          this.loading = false;
        }
      });
  }
}
