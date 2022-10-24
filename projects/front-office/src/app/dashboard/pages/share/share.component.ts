import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { Dashboard, SafeSnackBarService } from '@safe/builder';
import { Subscription } from 'rxjs';
import {
  GetShareDashboardByIdQueryResponse,
  GET_SHARE_DASHBOARD_BY_ID,
} from './graphql/queries';

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
  private apolloSubscription?: Subscription;

  /**
   * Share URL access component.
   *
   * @param router Angular shared router service
   * @param route Angular shared route service
   * @param apollo Apollo client service
   * @param snackBar Shared snackbar service
   * @param translateService Angular Translate service
   */
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
      this.apolloSubscription = this.apollo
        .query<GetShareDashboardByIdQueryResponse>({
          query: GET_SHARE_DASHBOARD_BY_ID,
          variables: {
            id: params.id,
          },
        })
        .subscribe((res) => {
          let url = '';
          const dashboard: Dashboard = res.data.dashboard;
          if (dashboard) {
            if (dashboard.step) {
              url +=
                '/' + res.data.dashboard.step?.workflow?.page?.application?.id;
              url += '/workflow/' + res.data.dashboard.step?.workflow?.id;
              url += '/dashboard/' + res.data.dashboard.id;
            } else {
              url += '/' + res.data.dashboard.page?.application?.id;
              url += '/dashboard/' + res.data.dashboard.id;
            }
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

  /**
   * Destroy subscriptions.
   */
  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    if (this.apolloSubscription) {
      this.apolloSubscription.unsubscribe();
    }
  }
}
