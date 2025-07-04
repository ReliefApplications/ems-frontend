import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Application, ApplicationService } from '@oort-front/shared';

/**
 * Role summary page
 */
@Component({
  selector: 'app-role-summary',
  templateUrl: './role-summary.component.html',
  styleUrls: ['./role-summary.component.scss'],
})
export class RoleSummaryComponent implements OnInit {
  /** Current application id */
  public id = '';
  /** Current application */
  public application!: Application;
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * Role summary page
   *
   * @param route Angular current route
   * @param applicationService Shared application service
   */
  constructor(
    private route: ActivatedRoute,
    public applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val: any) => {
        this.id = val.id;
      });
    this.applicationService.application$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((application: Application | null) => {
        if (application) {
          this.application = application;
        }
      });
  }
}
