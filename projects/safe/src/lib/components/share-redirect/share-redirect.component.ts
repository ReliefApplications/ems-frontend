import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { SafeSnackBarService } from '../../services/snackbar.service';
import {
  GetShareDashboardByIdQueryResponse,
  GET_SHARE_DASHBOARD_BY_ID,
} from '../../graphql/queries';

@Component({
  selector: 'safe-share-redirect',
  templateUrl: './share-redirect.component.html',
  styleUrls: ['./share-redirect.component.scss'],
})
export class SafeShareRedirectComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private translateService: TranslateService
  ) {}

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
          console.log(res);
          let url = '/applications';

          if (res.data.dashboard) {
            url += '/' + res.data.dashboard.page?.application?.id;
            url += '/dashboard/' + res.data.dashboard.id;
          } else {
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

  ngOnDestroy(): void {}
}
