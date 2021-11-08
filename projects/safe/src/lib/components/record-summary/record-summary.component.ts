import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Record } from '../../models/record.model';

@Component({
  selector: 'safe-record-summary',
  templateUrl: './record-summary.component.html',
  styleUrls: ['./record-summary.component.scss']
})
export class SafeRecordSummaryComponent implements OnInit {

  @Input() cacheDate?: Date;
  @Input() record?: Record;
  @Output() showHistory = new EventEmitter();
  @Output() clear = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
