import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Application, User, Role, SafeApplicationService, PositionAttributeCategory} from '@safe/builder';
import { Subscription } from 'rxjs';

const ITEMS_PER_PAGE = 10;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  // === DATA ===
  public loading = true;
  public users = new MatTableDataSource<User>([]);
  public cachedUsers: User[] = [];
  public roles: Role[] = [];
  public positionAttributeCategories: PositionAttributeCategory[] = [];
  private applicationSubscription?: Subscription;

  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: ''
  };

  constructor(
    public applicationService: SafeApplicationService
  ) { }

  ngOnInit(): void {
    console.log('YSL');
    this.loading = false;
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application | null) => {
      console.log('application');
      console.log(application);
      if (application) {
        this.users.data = application.users || [];
        this.roles = application.roles || [];
        this.positionAttributeCategories = application.positionAttributeCategories || [];
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
