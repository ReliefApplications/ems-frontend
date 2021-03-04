import {Component, OnInit, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import { Record } from '../../models/record.model';
import { MatEndDate, MatStartDate } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { WhoRecordModalComponent } from '../record-modal/record-modal.component';

@Component({
  selector: 'who-record-history',
  templateUrl: './record-history.component.html',
  styleUrls: ['./record-history.component.scss'],
})
export class WhoRecordHistoryComponent implements OnInit {

  @Input() record: Record;
  @Input() revert: any;
  @Output() cancel = new EventEmitter();

  public history: any[] = [];
  public filterHistory = [];
  public loading = true;
  public displayedColumns: string[] = ['position'];
  public filtersDate = {startDate: '', endDate: ''};

  @ViewChild('startDate', { read: MatStartDate}) startDate: MatStartDate<string>;
  @ViewChild('endDate', { read: MatEndDate}) endDate: MatEndDate<string>;


  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.history = this.getHistory(this.record).filter((item) => item.changes.length > 0);
    this.filterHistory = this.history;
    this.loading = false;
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
          changes.push('<p> <span  class="modify-field">Change field</span> <b>' + key + '</b> from <b>' + after[key] +
            '</b> to <b>' + current[key] + '</b> </p>');
          affectedData[key] = current[key];
        }
      } else {
        changes.push('<p><span class="add-field">Add field</span> <b>' + key + '</b> with value <b>' + current[key] + '</b> </p>');
        affectedData[key] = current[key];
      }
    });

    const keysAfter = Object.keys(after);
    keysAfter.forEach(key => {
      if (!current[key]) {
        changes.push('<p><span class="add-field">Add field</span> <b>' + key + '</b> with value <b>' + after[key] + '</b> </p>');
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

  onRevert(item: any): void {
    const dialogRef = this.dialog.open(WhoRecordModalComponent, {
      data: {
        recordId: this.record.id,
        locale: 'en',
        compareTo: this.record.versions.find(x => x.id === item.id)
      },
      height: '98%',
      width: '100vw',
      panelClass: 'full-screen-modal',
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) { this.revert(item); }
    });
  }

  clearDateFilter(): void {
    this.filtersDate.startDate = '';
    this.filtersDate.endDate = '';
    this.filterHistory = this.history;
    // ignore that error
    this.startDate.value = '';
    this.endDate.value = '';
  }

  applyFilter(): void {
    const startDate = new Date(this.filtersDate.startDate).getTime();
    const endDate = new Date(this.filtersDate.endDate).getTime();
    this.filterHistory = this.history.filter(item  => !startDate || !endDate || item.created >=  startDate && item.created <= endDate);
  }
}
