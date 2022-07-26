import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Application, User, Role, SafeApplicationService } from '@safe/builder';
import { Subscription } from 'rxjs';

/**
 * Users page for application preview.
 */
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  // === DATA ===
  public loading = true;
  public users = new MatTableDataSource<User>([]);
  public roles: Role[] = [];
  private applicationSubscription?: Subscription;

  /**
   * Users page for application preview
   *
   * @param applicationService Shared application service
   */
  constructor(public applicationService: SafeApplicationService) {}

  /**
   * Gets the list of users from loaded application.
   */
  ngOnInit(): void {
    this.applicationSubscription =
      this.applicationService.application$.subscribe(
        (application: Application | null) => {
          if (application) {
            this.users.data = application.users || [];
            this.roles = application.roles || [];
          } else {
            this.users.data = [];
            this.roles = [];
          }
          this.loading = false;
        }
      );
  }

  /**
   * Destroys all the subscriptions of the page.
   */
  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
