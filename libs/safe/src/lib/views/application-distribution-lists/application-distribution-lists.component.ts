import { Component, OnInit } from '@angular/core';
import { SafeUnsubscribeComponent } from '../../components/utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { Application } from '../../models/application.model';
import { SafeApplicationService } from '../../services/application/application.service';

/**
 * Page to view distribution lists within app.
 */
@Component({
  selector: 'safe-application-distribution-lists',
  templateUrl: './application-distribution-lists.component.html',
  styleUrls: ['./application-distribution-lists.component.scss'],
})
export class SafeApplicationDistributionListsComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  public loading = true;
  public templates = new Array<any>();

  /**
   * Page to view distribution lists within app.
   *
   * @param applicationService application service
   */
  constructor(public applicationService: SafeApplicationService) {
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
