import {
  Component,
  DestroyRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Application,
  ApplicationService,
  ContentType,
} from '@oort-front/shared';
import get from 'lodash/get';

/**
 * Front-office Application component.
 */
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent implements OnInit, OnDestroy {
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
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

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

  ngOnDestroy(): void {
    this.applicationService.leaveApplication();
  }

  /**
   * Initialize all the needed listeners to load the application content
   */
  private setUpApplicationListeners() {
    // Subscribe to params change
    // this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((application: Application | null) => {
        this.loading = false;
        if (application) {
          this.title = application.name || '';
          if (!this.application || application.id !== this.application.id) {
            const firstPage = get(application, 'pages', [])[0];
            if (
              this.router.url.endsWith(application?.id || '') ||
              (application?.shortcut &&
                this.router.url.endsWith(application?.shortcut || '')) ||
              !firstPage
            ) {
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
              if (
                !this.router.url.includes(application?.id || '') &&
                !this.router.url.includes(application?.shortcut || '')
              ) {
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
        }
      });
  }
}
