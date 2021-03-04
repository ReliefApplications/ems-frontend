import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Application, User, Role, WhoApplicationService, PositionAttributeCategory} from '@who-ems/builder';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  // === DATA ===
  public loading = true;
  public users = new MatTableDataSource<User>([]);
  public roles: Role[];
  public positionAttributeCategories: PositionAttributeCategory[];
  private applicationSubscription: Subscription;

  constructor(
    private applicationService: WhoApplicationService
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      if (application) {
        this.users.data = application.users;
        this.roles = application.roles;
        this.positionAttributeCategories = application.positionAttributeCategories;
      } else {
        this.users.data = [];
        this.roles = [];
      }
    });
  }

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
