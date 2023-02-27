import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Record } from '../../models/record.model';

/**
 * This component is used to show a summary of a record and its informations
 */
@Component({
  selector: 'safe-record-summary',
  templateUrl: './record-summary.component.html',
  styleUrls: ['./record-summary.component.scss'],
})
export class SafeRecordSummaryComponent implements OnInit {
  @Input() cacheDate?: Date;
  @Input() record?: Record;
  @Output() showHistory = new EventEmitter();
  @Output() clear = new EventEmitter();

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   */
  constructor() {}

  ngOnInit(): void {}
}
