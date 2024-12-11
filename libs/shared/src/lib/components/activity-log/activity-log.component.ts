import { Component, Input } from '@angular/core';

/**
 * Shared activity log component.
 */
@Component({
  selector: 'shared-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss'],
})
export class ActivityLogComponent {
  /** User ID to filter activities. */
  @Input() userId: string | undefined;
  /** Application ID to filter activities. */
  @Input() applicationId: string | undefined;
}
