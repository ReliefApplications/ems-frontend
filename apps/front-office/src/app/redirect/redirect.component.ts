import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  Application,
  ApplicationService,
  AuthService,
  User,
} from '@oort-front/shared';

/**
 * Redirect page of front-office.
 */
@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss'],
})
export class RedirectComponent implements OnInit {
  /** List of accessible applications */
  applications: Application[] = [];
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

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
  ) {}

  ngOnInit(): void {
    this.authService.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user: User | null) => {
        if (user) {
          this.applications = user?.applications || [];
          const redirectPath = localStorage.getItem('redirectPath');
          if (redirectPath) {
            this.router.navigateByUrl(redirectPath);
            localStorage.removeItem('redirectPath');
          } else if (user.favoriteApp) {
            const favoriteApp = this.applications.find(
              (application) => application.id === user.favoriteApp
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
