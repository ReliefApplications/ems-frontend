import { Component, OnInit } from '@angular/core';
import { SafeUnsubscribeComponent } from '../../components/utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { Application } from '../../models/application.model';
import { SafeApplicationService } from '../../services/application/application.service';

/**
 * Application templates page component.
 */
@Component({
  selector: 'safe-application-templates',
  templateUrl: './application-templates.component.html',
  styleUrls: ['./application-templates.component.scss'],
})
export class SafeApplicationTemplatesComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  public loading = true;
  public templates = new Array<any>();

  /**
   * Application templates page component
   *
   * @param applicationService Shared application service
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
