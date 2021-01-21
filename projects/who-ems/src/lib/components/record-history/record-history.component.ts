import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Record } from '../../models/record.model';

interface DialogData {
  record: Record;
}

@Component({
  selector: 'who-record-history',
  templateUrl: './record-history.component.html',
  styleUrls: ['./record-history.component.scss']
})
export class WhoRecordHistoryComponent implements OnInit {

  public data;
  public history: any[] = [];
  public loading = true;
  public displayedColumns: string[] = ['position'];


  ngOnInit(): void {
    this.getHistory(this.data);
  }

  /*  Get current and next record to see difference and put it in a string
  */
  getDifference(current, after): any[] {
    const changes = [];
    const keysCurrent = Object.keys(current);
    keysCurrent.forEach(key => {
      if (after[key]) {
        if (after[key] !== current[key]) {
          changes.push('Change value of field <i>' + key + '</i> from <b>' + after[key] +
            '</b> to <b>' + current[key] + '</b>');
        }
      } else {
        changes.push('Add field <i>' + key + '</i> with value <b>' + current[key] + '</b>');
      }
    });

    const keysAfter = Object.keys(after);
    keysAfter.forEach(key => {
      if (!current[key]) {
        changes.push('Add field <i>' + key + '</i> with value <b>' + after[key] + '</b>');
      }
    });
    return changes;
  }

  private getHistory(record: Record): any[] {
    const res = [];
    const versions = record.versions;
    if (versions.length === 0) {
      return res;
    }
    for (let i = 1; i < versions.length; i++) {
      res.push({
        created: versions[i - 1].createdAt, createdBy: versions[i - 1].createdBy?.name,
        changes: this.getDifference(versions[i - 1].data, versions[i].data)
      });
    }
    res.push({
      created: versions[versions.length - 1].createdAt,
      createdBy: versions[versions.length - 1].createdBy?.name,
      changes: this.getDifference(record.data, versions[versions.length - 1].data)
    });
    return res.reverse();
  }
}
