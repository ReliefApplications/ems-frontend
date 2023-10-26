import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Application } from '../../../../models/application.model';

/**
 * This interface describes the data structure of the status of the application
 */
interface IStatus {
  name: string;
  short: string;
  color: string;
  focusColor: string;
}

/**
 * This component is used to display the summary cards for with the information for each application on the home page
 */
@Component({
  selector: 'shared-application-summary',
  templateUrl: './application-summary.component.html',
  styleUrls: ['./application-summary.component.scss'],
})
export class ApplicationSummaryComponent {
  /** Application input */
  @Input() application!: Application;
  /** Preview event emitter */
  @Output() preview = new EventEmitter();
  /** Delete event emitter */
  @Output() delete = new EventEmitter();
  /** Clone event emitter */
  @Output() clone = new EventEmitter();
  /** Edit access event emitter */
  @Output() editAccess = new EventEmitter();
  /** Statuses */
  statuses: IStatus[] = [
    {
      name: 'active',
      short: 'A',
      color: 'rgba(149, 221, 101, 0.2)',
      focusColor: '#95DD65',
    },
    {
      name: 'pending',
      short: 'P',
      color: 'rgba(244, 174, 82, 0.2)',
      focusColor: '#F4AE52',
    },
    {
      name: 'archived',
      short: 'D',
      color: 'rgba(241, 67, 67, 0.19)',
      focusColor: '#F14343',
    },
  ];

  /**
   * Getter for the status of the application
   *
   * @returns the status of the application
   */
  get status(): IStatus | undefined {
    return this.statuses.find((x) => x.name === this.application.status);
  }

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param translate the translating service
   */
  constructor(translate: TranslateService) {
    this.statuses[0].short = translate
      .instant('common.status_active')[0]
      .toUpperCase();
    this.statuses[1].short = translate
      .instant('common.status_pending')[0]
      .toUpperCase();
    this.statuses[2].short = translate
      .instant('common.status_archived')[0]
      .toUpperCase();
  }
}
