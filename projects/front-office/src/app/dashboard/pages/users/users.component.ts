import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  Application,
  User,
  Role,
  SafeApplicationService,
  SafeUnsubscribeComponent,
} from '@safe/builder';
import { takeUntil } from 'rxjs/operators';

/**
 * Users page.
 */
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends SafeUnsubscribeComponent implements OnInit {
  /** Loading state of the page */
  public loading = true;
  /** List of users */
  public users = new MatTableDataSource<User>([]);
  /** List of application roles */
  public roles: Role[] = [];

  /**
   * Users page.
   *
   * @param applicationService Shared application service
   */
  constructor(public applicationService: SafeApplicationService) {
    super();
  }

  /**
   * Subscribes to application service to load the roles and users.
   */
  ngOnInit(): void {
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
        if (application) {
          this.users.data = application.users || [];
          this.roles = application.roles || [];
        } else {
          this.users.data = [];
          this.roles = [];
        }
        this.loading = false;
      });
  }
}
