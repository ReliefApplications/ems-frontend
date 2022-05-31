import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { Record } from '../../models/record.model';
import { MatEndDate, MatStartDate } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { SafeRecordModalComponent } from '../record-modal/record-modal.component';
import { SafeDownloadService } from '../../services/download.service';

/**
 * This is a component to access the history of a record
 */
@Component({
  selector: 'safe-record-history',
  templateUrl: './record-history.component.html',
  styleUrls: ['./record-history.component.scss'],
})
export class SafeRecordHistoryComponent implements OnInit {
  @Input() record: Record = {};
  @Input() revert: any;
  @Input() template?: string;
  @Output() cancel = new EventEmitter();

  public history: any[] = [];
  public filterHistory: any[] = [];
  public loading = true;
  public showMore = false;
  public displayedColumns: string[] = ['position'];
  public filtersDate = { startDate: '', endDate: '' };

  @ViewChild('startDate', { read: MatStartDate })
  startDate!: MatStartDate<string>;
  @ViewChild('endDate', { read: MatEndDate }) endDate!: MatEndDate<string>;
  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param dialog This is the Material dialog service that we will use to open the dialog.
   * @param downloadService This is the service that will be used to download files
   */
  constructor(
    public dialog: MatDialog,
    private downloadService: SafeDownloadService
  ) {}

  ngOnInit(): void {
    this.history = this.getHistory(this.record).filter(
      (item) => item.changes.length > 0
    );
    this.filterHistory = this.history;
    this.loading = false;
  }

  /**
   * Handles the cancelling of the edition of the history
   */
  onCancel(): void {
    this.cancel.emit(true);
  }

  /**
   * Get current and next record to see difference and put it in a string
   *
   * @param current The current record
   * @param after The next record
   * @returns The difference between the two records in string format
   */
  getDifference(current: any, after: any): string[] {
    const changes: any[] = [];
    if (current) {
      const keysCurrent = Object.keys(current);
      keysCurrent.forEach((key) => {
        if (
          typeof after[key] === 'boolean' ||
          typeof current[key] === 'boolean'
        ) {
          if (current[key] !== null && after[key] !== current[key]) {
            changes.push(this.modifyField(key, after, current));
          }
        } else if (!Array.isArray(after[key]) && !Array.isArray(current[key])) {
          if (after[key]) {
            if (after[key] instanceof Object && current[key]) {
              const element = this.modifyObjects(after, current, key);
              if (element.length > 0) {
                changes.push(element);
              }
            } else if (current[key] && after[key] !== current[key]) {
              changes.push(this.modifyField(key, after, current));
            }
          } else if (current[key]) {
            if (current[key] instanceof Object) {
              const element = this.modifyObjects(after, current, key);
              if (element.length > 0) {
                changes.push(element);
              }
            } else if (after[key] !== current[key]) {
              changes.push(this.modifyField(key, after, current));
            } else {
              changes.push(this.addField(key, current));
            }
          }
        } else {
          if (
            (!after[key] && current[key]) ||
            (current[key] &&
              after[key] &&
              after[key].toString() !== current[key].toString())
          ) {
            changes.push(this.modifyField(key, after, current));
          } else if (!after[key] && current[key]) {
            changes.push(this.addField(key, current));
          }
        }
      });
    }

    const keysAfter = Object.keys(after);
    keysAfter.forEach((key) => {
      if (typeof after[key] === 'boolean') {
        if ((!current || current[key]) === null && after[key] !== null) {
          changes.push(
            '<p><span class="add-field">Add field</span> <b>' +
              key +
              '</b> with value <b>' +
              after[key] +
              '</b> </p>'
          );
        }
      } else if (
        (!current || current[key] === null) &&
        !Array.isArray(after[key]) &&
        after[key] instanceof Object
      ) {
        const element = this.addObject(after, key);
        if (element.length > 0) {
          changes.push(element);
        }
      } else if ((!current || current[key] === null) && after[key]) {
        changes.push(
          '<p><span class="add-field">Add field</span> <b>' +
            key +
            '</b> with value <b>' +
            after[key] +
            '</b> </p>'
        );
      }
    });
    return changes;
  }

  private addObject(current: any, key: string): string {
    const currentKeys = Object.keys(current[key]);
    let currentValuesHTML = '';
    let element = `<p> <span class="add-field">Add field</span> <b> ${key} </b> with value  `;
    currentKeys.forEach((k) => {
      let currentValues;
      if (current[key][k] instanceof Object) {
        currentValues = Object.values(current[key][k]);
      } else {
        currentValues = current[key][k];
      }
      currentValuesHTML += `<b>${k} ( ${currentValues} )</b> `;
    });
    element += `${currentValuesHTML} </p>`;
    return element;
  }

  private addField(key: string, current: any): string {
    return (
      '<p><span class="add-field">Add field</span> <b>' +
      key +
      '</b> with value <b>' +
      current[key] +
      '</b> </p>'
    );
  }

  private modifyField(key: string, after: any, current: any): string {
    if (after[key] === null) {
      return (
        '<p> <span  class="remove-field">Remove field</span> <b>' +
        key +
        '</b> with value <b>' +
        current[key] +
        '</b> </p>'
      );
    } else {
      return (
        '<p> <span  class="modify-field">Change field</span> <b>' +
        key +
        '</b> from <b>' +
        current[key] +
        '</b> to <b>' +
        after[key] +
        '</b> </p>'
      );
    }
  }

  modifyObjects(after: any, current: any, key: string): string {
    const afterKeys = Object.keys(after[key] ? after[key] : current[key]);
    let element = `<p> <span class="modify-field">Change field</span> <b> ${key} </b> from  `;
    let afterValuesHTML = '';
    let currentValuesHTML = '';

    afterKeys.forEach((k) => {
      let afterValues = [];
      let currentValues = [];
      if (after[key] && after[key][k]) {
        if (after[key][k] instanceof Object) {
          afterValues = Object.values(after[key][k]);
        } else {
          afterValues = after[key][k];
        }
      }
      if (current[key] && current[key][k]) {
        if (current[key][k] instanceof Object) {
          currentValues = Object.values(current[key][k]);
        } else {
          currentValues = current[key][k];
        }
      }

      if (currentValues.toString() !== afterValues.toString()) {
        afterValuesHTML += `<b>${k} ( ${afterValues} )</b> `;
        currentValuesHTML += `<b>${k} ( ${currentValues} )</b> `;
      }
    });
    if (afterValuesHTML.length > 0) {
      element += `${currentValuesHTML} to ${afterValuesHTML}</p>`;
      return element;
    }
    return '';
  }

  /**
   * Get the history of a record
   *
   * @param record The record whose history we are getting
   * @returns the history in array format
   */
  private getHistory(record: Record): any[] {
    const res: any[] = [];
    const versions = record.versions || [];
    let difference;
    if (versions.length === 0) {
      difference = this.getDifference(null, record.data);
      res.push({
        created: record.createdAt,
        createdBy: record.createdBy?.name,
        changes: difference,
        id: record.id,
      });
      return res;
    }
    difference = this.getDifference(null, versions[0].data);
    res.push({
      created: versions[0].createdAt,
      createdBy: record.createdBy?.name,
      changes: difference,
      id: versions[0].id,
    });
    for (let i = 1; i < versions.length; i++) {
      difference = this.getDifference(versions[i - 1].data, versions[i].data);
      res.push({
        created: versions[i].createdAt,
        createdBy: versions[i - 1].createdBy?.name,
        changes: difference,
        id: versions[i].id,
      });
    }
    difference = this.getDifference(
      versions[versions.length - 1].data,
      record.data
    );
    res.push({
      created: record.modifiedAt,
      createdBy: versions[versions.length - 1].createdBy?.name,
      changes: difference,
      id: record.id,
    });
    return res.reverse();
  }

  /**
   * Handles the revertion of items
   *
   * @param item The item to revert
   */
  onRevert(item: any): void {
    const dialogRef = this.dialog.open(SafeRecordModalComponent, {
      data: {
        recordId: this.record.id,
        locale: 'en',
        compareTo: this.record.versions?.find((x) => x.id === item.id),
        template: this.template,
      },
      height: '98%',
      width: '100vw',
      panelClass: 'full-screen-modal',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.revert(item);
      }
    });
  }

  /**
   * Clears the date filter, empties it
   */
  clearDateFilter(): void {
    this.filtersDate.startDate = '';
    this.filtersDate.endDate = '';
    this.filterHistory = this.history;
    this.startDate.value = '';
    this.endDate.value = '';
  }

  /**
   * Applies a filter to the history
   */
  applyFilter(): void {
    const startDate = new Date(this.filtersDate.startDate).getTime();
    const endDate = new Date(this.filtersDate.endDate).getTime();
    this.filterHistory = this.history.filter(
      (item) =>
        !startDate ||
        !endDate ||
        (item.created >= startDate && item.created <= endDate)
    );
  }

  /**
   * Handles the download event
   *
   * @param type Type of document to download
   */
  onDownload(type: string): void {
    const path = `download/form/records/${this.record.id}/history`;
    const fileName = `${this.record.id}.${type}`;
    const queryString = new URLSearchParams({ type }).toString();
    this.downloadService.getFile(
      `${path}?${queryString}`,
      `text/${type};charset=utf-8;`,
      fileName
    );
  }
}
