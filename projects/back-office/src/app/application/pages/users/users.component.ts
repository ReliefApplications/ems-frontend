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
      if (application && application.users) {
        this.cachedUsers = application.users.edges.map((x: any) => x.node);
        this.users.data = this.cachedUsers.slice( ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
        this.pageInfo.length = application.users.totalCount;
        this.pageInfo.endCursor = application.users.pageInfo.endCursor;

        this.roles = application.roles || [];
        this.positionAttributeCategories = application.positionAttributeCategories || [];
      } else {
        this.users.data = [];
        this.roles = [];
      }
    });
    console.log('?????');
    console.log(this.users);
  }

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }

  onPage(e: any): void {
    // this.pageInfo.pageIndex = e.pageIndex;
    // if (e.pageIndex > e.previousPageIndex && e.length > this.cachedUsers.length) {
    //   this.usersQuery.fetchMore({
    //     variables: {
    //       first: ITEMS_PER_PAGE,
    //       afterCursor: this.pageInfo.endCursor
    //     },
    //     updateQuery: (prev, { fetchMoreResult }) => {
    //       if (!fetchMoreResult) { return prev; }
    //       return Object.assign({}, prev, {
    //         users: {
    //           edges: [...prev.users.edges, ...fetchMoreResult.users.edges],
    //           pageInfo: fetchMoreResult.users.pageInfo,
    //           totalCount: fetchMoreResult.users.totalCount
    //         }
    //       });
    //     }
    //   });
    // } else {
    //   this.users.data = this.cachedUsers.slice(
    //     ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
    // }
  }
}
