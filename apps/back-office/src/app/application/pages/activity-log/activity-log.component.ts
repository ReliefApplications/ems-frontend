import { Component } from '@angular/core';
import { ApplicationService } from '@oort-front/shared';
import { Observable } from 'rxjs';
import { Application } from '@oort-front/shared';

/**
 * Archive page component for application preview.
 */
@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss'],
})
export class ActivityLogComponent {
  /** Observable for the application */
  public application$: Observable<Application | null>;

  /**
   * Constructor to inject the ApplicationService
   *
   * @param applicationService The ApplicationService for interacting with the application state
   */
  constructor(private applicationService: ApplicationService) {
    this.application$ = this.applicationService.application$;
  }
}
