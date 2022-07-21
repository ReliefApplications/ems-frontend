import { Apollo } from 'apollo-angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import {
  PermissionsManagement,
  PermissionType,
  SafeAuthService,
  SafeSnackBarService,
} from '@safe/builder';
import {
  DeleteDashboardMutationResponse,
  DELETE_DASHBOARD,
  AddDashboardMutationResponse,
  ADD_DASHBOARD,
} from './graphql/mutations';
import {
  GetDashboardsQueryResponse,
  GET_DASHBOARDS,
} from '../../../graphql/queries';
import { AddDashboardComponent } from './components/add-dashboard/add-dashboard.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
})
export class DashboardsComponent implements OnInit, OnDestroy {
  // === DATA ===
  public loading = true;
  public dashboards: any[] = [];
  public displayedColumns = ['name', 'createdAt', 'actions'];

  // === PERMISSIONS ===
  canAdd = false;
  private authSubscription?: Subscription;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    private translateService: TranslateService
  ) {}

  /** Load the data and check if user can add new dashboards. */
  ngOnInit(): void {
    this.apollo
      .watchQuery<GetDashboardsQueryResponse>({
        query: GET_DASHBOARDS,
      })
      .valueChanges.subscribe((res) => {
        this.dashboards = res.data.dashboards;
        this.loading = res.loading;
      });
    this.authSubscription = this.authService.user$.subscribe(() => {
      this.canAdd = this.authService.userHasClaim(
        PermissionsManagement.getRightFromPath(
          this.router.url,
          PermissionType.create
        )
      );
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  /** Delete a dashboard if authorized. */
  deleteDashboard(id: any, e: any): void {
    e.stopPropagation();
    this.apollo
      .mutate<DeleteDashboardMutationResponse>({
        mutation: DELETE_DASHBOARD,
        variables: {
          id,
        },
      })
      .subscribe((res) => {
        if (res.data) {
          this.snackBar.openSnackBar(
            this.translateService.instant(
              'common.notifications.objectDeleted',
              {
                value: this.translateService.instant('common.dashboard.one'),
              }
            )
          );
          this.dashboards = this.dashboards.filter(
            (x) => x.id !== res.data?.deleteDashboard.id
          );
        }
      });
  }

  /** Display the AddDashboard component.
    Add a new dashboard once closed, if result exists. */
  onAdd(): void {
    const dialogRef = this.dialog.open(AddDashboardComponent);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.apollo
          .mutate<AddDashboardMutationResponse>({
            mutation: ADD_DASHBOARD,
            variables: {
              name: value.name,
            },
          })
          .subscribe((res) => {
            this.snackBar.openSnackBar(
              this.translateService.instant(
                'common.notifications.objectCreated',
                {
                  type: this.translateService
                    .instant('common.dashboard.one')
                    .toLowerCase(),
                  value: value.name,
                }
              )
            );
            const id = res.data?.addDashboard.id;
            this.router.navigate(['/dashboards', id]);
          });
      }
    });
  }
}
