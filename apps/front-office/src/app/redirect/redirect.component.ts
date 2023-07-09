import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Application,
  SafeAuthService,
  SafeUnsubscribeComponent,
  User,
} from '@oort-front/safe';
import { takeUntil } from 'rxjs';

/**
 * Redirect page of front-office.
 */
@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss'],
})
export class RedirectComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
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
   */
  constructor(private authService: SafeAuthService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User | null) => {
        if (user) {
          this.applications = user?.applications || [];
          if (user.favoriteApp) {
            if (this.applications.find((app) => app.id === user.favoriteApp)) {
              this.router.navigate([`./${user.favoriteApp}`]);
            } else {
              this.router.navigate([`./${this.applications[0].id}`]);
            }
          } else {
            this.router.navigate([`./${this.applications[0].id}`]);
          }
        } else {
          this.applications = [];
        }
      });
  }
}
