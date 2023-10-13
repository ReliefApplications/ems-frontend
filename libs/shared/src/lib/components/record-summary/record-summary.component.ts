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
  /** Cache date */
  @Input() cacheDate?: Date;
  /** Record */
  @Input() record?: Record;
  /** Show history event emitter */
  @Output() showHistory = new EventEmitter();
  /** Clear event emitter */
  @Output() clear = new EventEmitter();
}
