import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Application } from '../../models/application.model';
import { ApplicationService } from '../../services/application/application.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Page to view distribution lists within application.
 */
@Component({
  selector: 'shared-application-distribution-lists',
  templateUrl: './application-distribution-lists.component.html',
  styleUrls: ['./application-distribution-lists.component.scss'],
})
export class ApplicationDistributionListsComponent implements OnInit {
  // === DATA ===
  /** Loading state */
  public loading = true;
  /** Templates */
  public templates = new Array<any>();
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * Page to view distribution lists within application.
   *
   * @param applicationService application service
   */
  constructor(public applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.applicationService.application$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((application: Application | null) => {
        if (application) {
          this.templates = application.templates || [];
          this.loading = false;
        } else {
          this.templates = [];
        }
      });
  }
}
