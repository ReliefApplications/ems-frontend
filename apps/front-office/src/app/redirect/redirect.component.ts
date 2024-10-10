import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Application,
  ApplicationService,
  AuthService,
  UnsubscribeComponent,
  User,
} from '@oort-front/shared';
import { takeUntil } from 'rxjs';

/**
 * Redirect page of front-office.
 */
@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss'],
})
export class RedirectComponent extends UnsubscribeComponent implements OnInit {
  /** List of accessible applications */
  applications: Application[] = [];

  /** @returns True if applications is empty */
  get empty(): boolean {
    return this.applications.length === 0;
  }

  /**
   * Redirect page of front-office.
   *
   * @param authService shared authentication service
   * @param router Angular router
   * @param applicationService Application service
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private applicationService: ApplicationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User | null) => {
        if (user) {
          this.applications = user?.applications || [];
          const redirectPath = localStorage.getItem('redirectPath');
          if (redirectPath) {
            this.router.navigateByUrl(redirectPath);
            localStorage.removeItem('redirectPath');
          } else if (user.favoriteApp) {
            const favoriteApp = this.applications.find(
              (app) => app.id === user.favoriteApp
            );
            if (favoriteApp) {
              this.router.navigate([
                `./${this.applicationService.getApplicationPath(favoriteApp)}`,
              ]);
            } else {
              this.router.navigate([
                `./${this.applicationService.getApplicationPath(
                  this.applications[0]
                )}`,
              ]);
            }
          } else {
            this.router.navigate([
              `./${this.applicationService.getApplicationPath(
                this.applications[0]
              )}`,
            ]);
          }
        } else {
          this.applications = [];
        }
      });
  }
}
