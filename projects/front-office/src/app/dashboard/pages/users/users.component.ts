import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Application, User, Role, SafeApplicationService } from '@safe/builder';
import { Subscription } from 'rxjs';

/**
 * Users page.
 */
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  /** Loading state of the page */
  public loading = true;
  /** List of users */
  public users = new MatTableDataSource<User>([]);
  /** List of application roles */
  public roles: Role[] = [];
  /** Subscribes to application service */
  private applicationSubscription?: Subscription;

  /**
   * Users page.
   *
   * @param applicationService Shared application service
   */
  constructor(public applicationService: SafeApplicationService) {}

  /**
   * Subscribes to application service to load the roles and users.
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
   * Removes the subscriptions of the page.
   */
  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
