import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Application,
  ApplicationService,
  UnsubscribeComponent,
} from '@oort-front/shared';
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
  extends UnsubscribeComponent
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
    public applicationService: ApplicationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((val: any) => {
      this.id = val.id;
    });
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
        if (application) {
          this.application = application;
        }
      });
  }
}
