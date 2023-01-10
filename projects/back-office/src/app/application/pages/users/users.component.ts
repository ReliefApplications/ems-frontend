import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  Application,
  User,
  Role,
  SafeApplicationService,
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
  public loading = true;
  public users = new MatTableDataSource<User>([]);
  public roles: Role[] = [];
  public positionAttributeCategories: PositionAttributeCategory[] = [];

  /**
   * Application users page component
   *
   * @param applicationService Shared application service
   */
  constructor(public applicationService: SafeApplicationService) {
    super();
  }

  ngOnInit(): void {
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
        if (application) {
          this.users.data = application.users || [];
          this.roles = application.roles || [];
          this.positionAttributeCategories =
            application.positionAttributeCategories || [];
        } else {
          this.users.data = [];
          this.roles = [];
        }
        this.loading = false;
      });
  }
}
