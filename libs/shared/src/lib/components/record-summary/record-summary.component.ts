import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Record } from '../../models/record.model';

/**
 * This component is used to show a summary of a record and its informations
 */
@Component({
  selector: 'shared-record-summary',
  templateUrl: './record-summary.component.html',
  styleUrls: ['./record-summary.component.scss'],
})
export class RecordSummaryComponent {
  @Input() cacheDate?: Date;
  @Input() record?: Record;
  @Output() showHistory = new EventEmitter();
  @Output() clear = new EventEmitter();
}
