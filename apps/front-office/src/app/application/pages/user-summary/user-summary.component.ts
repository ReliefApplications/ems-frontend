import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Application, ApplicationService } from '@oort-front/shared';

/**
 * User Summary page component.
 */
@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss'],
})
export class UserSummaryComponent implements OnInit {
  /** Current application id */
  public id = '';
  /** Current application */
  public application!: Application;
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * User summary page component.
   *
   * @param route Angular active route
   * @param applicationService Shared application service
   */
  constructor(
    private route: ActivatedRoute,
    public applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    const routeSubscription = this.route.params.subscribe((val: any) => {
      this.id = val.id;
    });
    routeSubscription.unsubscribe();
    this.applicationService.application$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((application: Application | null) => {
        if (application) {
          this.application = application;
        }
      });
    // applicationSubscription.unsubscribe();
  }
}
