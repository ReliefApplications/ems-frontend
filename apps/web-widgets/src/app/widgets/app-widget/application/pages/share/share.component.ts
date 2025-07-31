import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import {
  Application,
  ApplicationService,
  Dashboard,
  DashboardQueryResponse,
} from '@oort-front/shared';
import { GET_SHARE_DASHBOARD_BY_ID } from './graphql/queries';
import { SnackbarService } from '@oort-front/ui';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Share URL access component.
 */
@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent implements OnInit {
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * Share URL access component.
   *
   * @param router Angular router service
   * @param route Angular shared route service
   * @param apollo Apollo client service
   * @param snackBar Shared snackbar service
   * @param translateService Angular Translate service
   * @param applicationService Application service
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private translateService: TranslateService,
    private applicationService: ApplicationService
  ) {}

  /**
   * Query dashboard information from share url and redirect to dashboard page.
   */
  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: any) => {
        this.apollo
          .query<DashboardQueryResponse>({
            query: GET_SHARE_DASHBOARD_BY_ID,
            variables: {
              id: params.id,
            },
          })
          .subscribe(({ data }) => {
            let url = '';
            const dashboard: Dashboard = data.dashboard;
            if (dashboard) {
              if (dashboard.step) {
                url +=
                  '/' +
                  this.applicationService.getApplicationPath(
                    data.dashboard.step?.workflow?.page
                      ?.application as Application
                  );
                url += '/workflow/' + data.dashboard.step?.workflow?.id;
                url += '/dashboard/' + data.dashboard.id;
              } else {
                url +=
                  '/' +
                  this.applicationService.getApplicationPath(
                    data.dashboard.page?.application as Application
                  );
                url += '/dashboard/' + data.dashboard.id;
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
}
