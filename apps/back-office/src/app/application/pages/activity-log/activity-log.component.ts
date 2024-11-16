import { Component } from '@angular/core';
/**
 * Archive page component for application preview.
 */
@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss'],
})
export class ActivityLogComponent {
  /** Loading state */
  public loading = true;

  /** Application pages */
  constructor() {
    console.log('Activity log component created in application');
  }
}
