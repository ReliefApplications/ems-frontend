import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  User,
  Role,
  SafeApplicationService,
  SafeApplicationUsersService,
  PositionAttributeCategory,
  SafeUnsubscribeComponent,
} from '@safe/builder';
import { takeUntil } from 'rxjs/operators';

/**
 * Application users page component.
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
  public positionAttributeCategories: PositionAttributeCategory[] = [];
  public loadingApp = true;

  /**
   * Application users page component
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

  ngOnInit(): void {
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application) => {
        if (application) {
          this.roles = application.roles || [];
          this.positionAttributeCategories =
            application.positionAttributeCategories || [];
        } else {
          this.roles = [];
        }
        this.loadingApp = false;
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
