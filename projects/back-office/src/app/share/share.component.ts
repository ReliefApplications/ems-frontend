import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { Dashboard, SafeSnackBarService } from '@safe/builder';
import { Subscription } from 'rxjs';
import { gql } from 'apollo-angular';

// === GET URL NEEDED INFO FROM AN SPECIFIC DASHBOARD ID ===
export const GET_SHARE_DASHBOARD_BY_ID = gql`
  query GetDashboardById($id: ID!) {
    dashboard(id: $id) {
      id
      page {
        application {
          id
        }
      }
    }
  }
`;

export interface GetShareDashboardByIdQueryResponse {
  loading: boolean;
  dashboard: Dashboard;
}

/**
 * Share URL access component.
 */
@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent implements OnInit, OnDestroy {
  private routeSubscription?: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private translateService: TranslateService
  ) {}

  /**
   * Query dashboard information from share url and redirect to dashboard page.
   */
  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.apollo
        .query<GetShareDashboardByIdQueryResponse>({
          query: GET_SHARE_DASHBOARD_BY_ID,
          variables: {
            id: params.id,
          },
        })
        .subscribe((res) => {
          let url = '/applications';

          if (res.data.dashboard) {
            url += '/' + res.data.dashboard.page?.application?.id;
            url += '/dashboard/' + res.data.dashboard.id;
          } else {
            // Error handling
            this.snackBar.openSnackBar(
              this.translateService.instant(
                'common.notifications.accessNotProvided',
                {
                  type: this.translateService
                    .instant('common.dashboard.one')
                    .toLowerCase(),
                  error: '',
                }
              ),
              { error: true }
            );
          }
          this.router.navigate([url]);
        });
    });
  }

  // http://localhost:4200/share/62542e5915e63d22f5924b17 ( workflow )

  // http://localhost:4200/share/61a4da46de315f49de578396 ( page )

  /**
   * Destroy subscriptions.
   */
  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }
}
