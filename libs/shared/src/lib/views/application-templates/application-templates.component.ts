import { Component, OnInit } from '@angular/core';
import { UnsubscribeComponent } from '../../components/utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { Application } from '../../models/application.model';
import { ApplicationService } from '../../services/application/application.service';

/**
 * Application templates page component.
 */
@Component({
  selector: 'shared-application-templates',
  templateUrl: './application-templates.component.html',
  styleUrls: ['./application-templates.component.scss'],
})
export class ApplicationTemplatesComponent
  extends UnsubscribeComponent
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
