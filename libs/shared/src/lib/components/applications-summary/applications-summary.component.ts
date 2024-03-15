import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Application } from '../../models/application.model';

/**
 * This component is used to display the most recent applications and a button to create a new application
 */
@Component({
  selector: 'shared-applications-summary',
  templateUrl: './applications-summary.component.html',
  styleUrls: ['./applications-summary.component.scss'],
})
export class ApplicationsSummaryComponent {
  /** Loading indicator */
  @Input() loading = false;
  /** Can user create new applications */
  @Input() canCreate = false;
  /** Available applications */
  @Input() applications: Application[] = [];
  /** Emits an event when a new application is added. */
  @Output() add = new EventEmitter();
  /** Emits an event with the application ID when an application is opened. */
  @Output() openApplication = new EventEmitter<string>();
  /** Emits an event with the application when a preview is requested. */
  @Output() preview = new EventEmitter<Application>();
  /** Emits an event with the application when a deletion is requested. */
  @Output() delete = new EventEmitter<Application>();
  /** Emits an event with the application when a clone is requested. */
  @Output() clone = new EventEmitter<Application>();
  /** Emits an event with the application when a clone is requested. */
  @Output() editAccess = new EventEmitter<Application>();
}
