import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Application, SafeApplicationService } from '@safe/builder';
import { Subscription } from 'rxjs';

/**
 * User Summary page component.
 */
@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss'],
})
export class UserSummaryComponent implements OnInit, OnDestroy {
  public id = '';
  public application!: Application;
  private applicationSubscription?: Subscription;

  /**
   * User summary page component.
   *
   * @param route Angular active route
   */
  constructor(
    private route: ActivatedRoute,
    public applicationService: SafeApplicationService
  ) {}

  ngOnInit(): void {
    const routeSubscription = this.route.params.subscribe((val: any) => {
      this.id = val.id;
    });
    routeSubscription.unsubscribe();
    this.applicationSubscription =
      this.applicationService.application$.subscribe(
        (application: Application | null) => {
          if (application) {
            this.application = application;
          }
        }
      );
    // applicationSubscription.unsubscribe();
  }

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
