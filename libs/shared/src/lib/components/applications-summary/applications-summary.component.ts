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
  /** Defines if the component is loading. */
  @Input() loading = false;
  /** Defines if a new application can be created. */
  @Input() canCreate = false;
  /** List of applications. */
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
