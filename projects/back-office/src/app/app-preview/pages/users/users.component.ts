import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  User,
  Role,
  SafeApplicationService,
  SafeApplicationUsersService,
  SafeUnsubscribeComponent,
} from '@safe/builder';
import { takeUntil } from 'rxjs/operators';

/**
 * Users page for application preview.
 */
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends SafeUnsubscribeComponent implements OnInit {
  // === DATA ===
  public users = new MatTableDataSource<User>([]);
  public loadingUsers = true;

  public autoUsers = new MatTableDataSource<User>([]);
  public loadingAutoUsers = true;

  public roles: Role[] = [];
  public loadingRoles = true;

  /**
   * Users page for application preview
   *
   * @param applicationService Shared application service
   * @param appUsersService Application users service
   */
  constructor(
    public applicationService: SafeApplicationService,
    public appUsersService: SafeApplicationUsersService
  ) {
    super();
  }

  /**
   * Gets the list of users from loaded application.
   */
  ngOnInit(): void {
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application) => {
        if (application) {
          this.roles = application.roles || [];
        } else {
          this.roles = [];
        }
        this.loadingRoles = false;
      });

    this.appUsersService.users$
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.users.data = users;
        this.loadingUsers = false;
      });

    this.appUsersService.autoAssignedUsers$
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.autoUsers.data = users;
        this.loadingAutoUsers = false;
      });
  }
}
