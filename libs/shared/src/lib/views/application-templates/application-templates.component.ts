import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Application } from '../../models/application.model';
import { ApplicationService } from '../../services/application/application.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Application templates page component.
 */
@Component({
  selector: 'shared-application-templates',
  templateUrl: './application-templates.component.html',
  styleUrls: ['./application-templates.component.scss'],
})
export class ApplicationTemplatesComponent implements OnInit {
  // === DATA ===
  /** Loading state */
  public loading = true;
  /** Templates */
  public templates = new Array<any>();
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * Application templates page component
   *
   * @param applicationService Shared application service
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
