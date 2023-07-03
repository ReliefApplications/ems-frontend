import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Application,
  SafeApplicationService,
  SafeUnsubscribeComponent,
} from '@oort-front/safe';
import { takeUntil } from 'rxjs/operators';

/**
 * User Summary page component.
 */
@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss'],
})
export class UserSummaryComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  public id = '';
  public application!: Application;

  /**
   * User summary page component.
   *
   * @param route Angular active route
   * @param applicationService Shared application service
   */
  constructor(
    private route: ActivatedRoute,
    public applicationService: SafeApplicationService
  ) {
    super();
  }

  ngOnInit(): void {
    const routeSubscription = this.route.params.subscribe((val: any) => {
      this.id = val.id;
    });
    routeSubscription.unsubscribe();
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
        if (application) {
          this.application = application;
        }
      });
    // applicationSubscription.unsubscribe();
  }
}
