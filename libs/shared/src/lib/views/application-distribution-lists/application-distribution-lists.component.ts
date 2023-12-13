import { Component, OnInit } from '@angular/core';
import { UnsubscribeComponent } from '../../components/utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { Application } from '../../models/application.model';
import { ApplicationService } from '../../services/application/application.service';

/**
 * Page to view distribution lists within app.
 */
@Component({
  selector: 'shared-application-distribution-lists',
  templateUrl: './application-distribution-lists.component.html',
  styleUrls: ['./application-distribution-lists.component.scss'],
})
export class ApplicationDistributionListsComponent
  extends UnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  /** Loading state */
  public loading = true;
  /** Templates */
  public templates = new Array<any>();

  /**
   * Page to view distribution lists within app.
   *
   * @param applicationService application service
   */
  constructor(public applicationService: ApplicationService) {
    super();
  }

  ngOnInit(): void {
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
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
