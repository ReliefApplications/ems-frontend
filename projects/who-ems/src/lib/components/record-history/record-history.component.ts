import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Record } from '../../models/record.model';

@Component({
  selector: 'who-record-history',
  templateUrl: './record-history.component.html',
  styleUrls: ['./record-history.component.scss']
})
export class WhoRecordHistoryComponent implements OnInit {

  @Input() record: Record;
  @Input() revert: any;
  @Output() cancel = new EventEmitter();

  public history: any[] = [];
  public loading = true;
  public displayedColumns: string[] = ['position'];

  ngOnInit(): void {
    this.history = this.getHistory(this.record).filter((item) => item.changes.length > 0);
  }

  onCancel(): void {
    this.cancel.emit(true);
  }

  /*  Get current and next record to see difference and put it in a string
  */
  getDifference(current, after): {changes: string[], data: {}} {
    const changes = [];
    const affectedData = {};
    const keysCurrent = Object.keys(current);
    keysCurrent.forEach(key => {
      if (after[key]) {
        if (after[key] !== current[key]) {
          changes.push('Change value of field <i>' + key + '</i> from <b>' + after[key] +
            '</b> to <b>' + current[key] + '</b>');
          affectedData[key] = current[key];
        }
      } else {
        changes.push('Add field <i>' + key + '</i> with value <b>' + current[key] + '</b>');
        affectedData[key] = current[key];
      }
    });

    const keysAfter = Object.keys(after);
    keysAfter.forEach(key => {
      if (!current[key]) {
        changes.push('Add field <i>' + key + '</i> with value <b>' + after[key] + '</b>');
      }
    });
    return {changes, data: affectedData};
  }

  private getHistory(record: Record): any[] {
    const res = [];
    const versions = record.versions;
    if (versions.length === 0) {
      return res;
    }
    let difference;
    for (let i = 1; i < versions.length; i++) {
      difference = this.getDifference(versions[i - 1].data, versions[i].data);
      res.push({
        created: versions[i - 1].createdAt,
        createdBy: versions[i - 1].createdBy?.name,
        changes: difference.changes,
        data: difference.data,
        id: versions[i - 1].id
      });
    }
    difference = this.getDifference(record.data, versions[versions.length - 1].data);
    res.push({
      created: versions[versions.length - 1].createdAt,
      createdBy: versions[versions.length - 1].createdBy?.name,
      changes: difference.changes,
      id: versions[versions.length - 1].id
    });
    return res.reverse();
  }

  onRevert(version: any): void {
    this.revert(version);
  }
}
