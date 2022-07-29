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
import { Apollo } from 'apollo-angular';
import {
  GetRecordByIdQueryResponse,
  GetRecordHistoryByIdResponse,
  GET_RECORD_BY_ID_FOR_HISTORY,
  GET_RECORD_HISTORY_BY_ID,
} from './graphql/queries';
import { Version } from '../../models/form.model';
import { RecordHistory, Change } from '../../models/recordsHistory';
import { TranslateService } from '@ngx-translate/core';

/**
 * Return the type of the old value if existing, else the type of the new value.
 *
 * @param oldVal The previous value
 * @param newVal The next value
 * @returns The type of the value: primitive, object or array
 */
const getValueType = (
  oldVal: any,
  newVal: any
): 'primitive' | 'object' | 'array' => {
  if (oldVal) {
    if (Array.isArray(oldVal)) return 'array';
    if (oldVal instanceof Object) return 'object';
    return 'primitive';
  }
  if (Array.isArray(newVal)) return 'array';
  if (newVal instanceof Object) return 'object';
  return 'primitive';
};

/**
 * This is a component to access the history of a record
 */
@Component({
  selector: 'safe-record-history',
  templateUrl: './record-history.component.html',
  styleUrls: ['./record-history.component.scss'],
})
export class SafeRecordHistoryComponent implements OnInit {
  @Input() id!: string;
  @Input() revert!: (version: Version) => void;
  @Input() template?: string;
  @Output() cancel = new EventEmitter();

  public record!: Record;
  public history: RecordHistory = [];
  public filterHistory: RecordHistory = [];
  public loading = true;
  public showMore = false;
  public displayedColumns: string[] = ['position'];
  public filtersDate = { startDate: '', endDate: '' };
  public sortedFields: any[] = [];

  @ViewChild('startDate', { read: MatStartDate })
  startDate!: MatStartDate<string>;
  @ViewChild('endDate', { read: MatEndDate }) endDate!: MatEndDate<string>;
  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param dialog This is the Material dialog service that we will use to open the dialog.
   * @param downloadService This is the service that will be used to download files
   * @param apollo The apollo client
   * @param translate The translation service
   */
  constructor(
    public dialog: MatDialog,
    private downloadService: SafeDownloadService,
    private apollo: Apollo,
    private translate: TranslateService
  ) {}

  /**
   * Gets formated date string from date
   *
   * @param date The date string
   * @param section wheater to get the time or date of the data string
   * @returns The formated date string
   */
  getDateLocale(date: string, section: 'date' | 'time'): string {
    const d = new Date(date);
    switch (section) {
      case 'date':
        return d.toLocaleDateString(this.translate.currentLang);
      case 'time':
        return d.toLocaleTimeString(this.translate.currentLang);
    }
  }

  ngOnInit(): void {
    // this.sortFields();

    this.apollo
      .query<GetRecordByIdQueryResponse>({
        query: GET_RECORD_BY_ID_FOR_HISTORY,
        variables: {
          id: this.id,
        },
      })
      .subscribe((res) => {
        this.record = res.data.record;
        this.sortedFields = this.sortFields(this.getFields());
      });

    this.apollo
      .query<GetRecordHistoryByIdResponse>({
        query: GET_RECORD_HISTORY_BY_ID,
        variables: {
          id: this.id,
        },
      })
      .subscribe((res) => {
        this.history = res.data.recordHistory.filter(
          (item) => item.changes.length
        );
        this.filterHistory = this.history;
        this.loading = false;
      });
  }

  /**
   * Transforms a object in a more readable inline string (or list)
   *
   * @param object The object
   * @returns A 'readable' version of that object, in which the the format key (value1, value2)
   */
  toReadableObjectValue(object: any): any {
    // base case
    if (typeof object !== 'object') return object;

    // arrys
    if (Array.isArray(object)) {
      return object.map((elem) => this.toReadableObjectValue(elem));
    }

    // objects - non arrays
    const res: any[] = [];
    const keys = Object.keys(object);
    keys.forEach((key, i) => {
      res.push(
        `${i ? ' ' : ''}${key} (${this.toReadableObjectValue(object[key])})`
      );
    });

    return res;
  }

  /**
   * Gets the HTML element from a change object
   *
   * @param change The field change object
   * @returns the innerHTML for the listing
   */
  getHTMLFromChange(change: Change) {
    const translations = {
      withValue: this.translate.instant('components.history.changes.withValue'),
      from: this.translate.instant('components.history.changes.from'),
      to: this.translate.instant('components.history.changes.to'),
      add: this.translate.instant('components.history.changes.add'),
      remove: this.translate.instant('components.history.changes.remove'),
      modify: this.translate.instant('components.history.changes.modify'),
    };

    let oldVal = change.old ? JSON.parse(change.old) : undefined;
    let newVal = change.new ? JSON.parse(change.new) : undefined;

    const valueType = getValueType(oldVal, newVal);

    if (valueType === 'object') {
      if (oldVal) oldVal = this.toReadableObjectValue(oldVal);
      if (newVal) newVal = this.toReadableObjectValue(newVal);
    }

    if (valueType === 'array') {
      if (oldVal && !(oldVal[0] instanceof Object)) oldVal = oldVal.join(', ');
      else if (oldVal) oldVal = this.toReadableObjectValue(oldVal);
      if (newVal && !(newVal[0] instanceof Object)) newVal = newVal.join(', ');
      else if (newVal) newVal = this.toReadableObjectValue(newVal);
    }

    switch (change.type) {
      case 'remove':
      case 'add':
        return `
            <p>
              <span class="${change.type}-field">
              ${translations[change.type]}
              </span>
              <b> ${change.displayName} </b>
              ${translations.withValue}
              <b> ${change.type === 'add' ? newVal : oldVal}</b>
            <p>
            `;
      case 'modify':
        return `
            <p>
              <span class="${change.type}-field">
              ${translations[change.type]}
              </span>
              <b> ${change.displayName} </b>
              ${translations.from}
              <b> ${oldVal}</b>
              ${translations.to}
              <b> ${newVal}</b>
            <p>
            `;
    }
  }

  /**
   * Get fields from the form
   *
   * @returns Returns an array with all the fields.
   */
  private getFields(): any[] {
    const fields: any[] = [];
    // No form, break the display
    if (this.record.form) {
      // Take the fields from the form
      this.record.form.fields?.map((field: any) => {
        fields.push(Object.assign({}, field));
      });
      if (this.record.form.structure) {
        const structure = JSON.parse(this.record.form.structure);
        if (!structure.pages || !structure.pages.length) {
          return [];
        }
        for (const page of structure.pages) {
          this.extractFields(page, fields);
        }
      }
    }
    return fields;
  }

  /**
   * Extract fields from form structure in order to get titles.
   *
   * @param object Structure to inspect, can be a page, a panel.
   * @param fields Array of fields.
   */
  private extractFields(object: any, fields: any[]): void {
    if (object.elements) {
      for (const element of object.elements) {
        if (element.type === 'panel') {
          this.extractFields(element, fields);
        } else {
          const field = fields.find((x) => x.name === element.name);
          if (field && element.title) {
            if (typeof element.title === 'string') {
              field.title = element.title;
            } else {
              field.title = element.title.default;
            }
          }
        }
      }
    }
  }

  /**
   * Handles the cancelling of the edition of the history
   */
  onCancel(): void {
    this.cancel.emit(true);
  }

  /**
   * Parses the structure of the record and sorts the fields
   * based on their names or lables, if available
   *
   * @param fields Array of fields
   * @returns sorted array of fields
   */
  sortFields(fields: any[]) {
    const unsortedFields = [...fields];
    return unsortedFields.sort((a, b) => {
      const compA: string = a.title || a.name;
      const compB: string = b.title || b.name;
      return compA.toLowerCase() > compB.toLowerCase() ? 1 : -1;
    });
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

  /**
   * Add an object addition in the history
   *
   * @param current current version
   * @param key key of field
   * @returns new history entry for the object addition
   */
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

  /**
   * Add a field addition in the history
   *
   * @param key key of field
   * @param current current version
   * @returns new history entry for the field addition
   */
  private addField(key: string, current: any): string {
    return (
      '<p><span class="add-field">Add field</span> <b>' +
      key +
      '</b> with value <b>' +
      current[key] +
      '</b> </p>'
    );
  }

  /**
   * Add a field update in the history
   *
   * @param key key of field
   * @param after next version
   * @param current current version
   * @returns new history entry for the field update
   */
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

  /**
   * Add an object update in the history
   *
   * @param after next version
   * @param current current version
   * @param key key of field
   * @returns new history entry for the field update
   */
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
   * Handle the download event. Send a request to the server to get excel / csv file.
   *
   * @param type Type of document to download
   */
  onDownload(type: string): void {
    const path = `download/form/records/${this.id}/history`;
    const fileName = `${this.record.incrementalId}.${type}`;
    const queryString = new URLSearchParams({
      type,
      from: `${new Date(this.filtersDate.startDate).getTime()}`,
      to: `${new Date(this.filtersDate.endDate).getTime()}`,
    }).toString();
    this.downloadService.getFile(
      `${path}?${queryString}`,
      `text/${type};charset=utf-8;`,
      fileName
    );
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
   * Triggers when the selected date and field filters are changed
   * and filters the history accordingly
   */
  applyFilter(): void {
    const startDate = this.filtersDate.startDate
      ? new Date(this.filtersDate.startDate)
      : undefined;
    if (startDate) startDate.setHours(0, 0, 0, 0);
    const endDate = this.filtersDate.endDate
      ? new Date(this.filtersDate.endDate)
      : undefined;
    if (endDate) endDate.setHours(23, 59, 59, 99);

    // filtering by date
    this.filterHistory = this.history.filter((item) => {
      const createdAt = new Date(item.createdAt);
      return (
        !startDate ||
        !endDate ||
        (createdAt >= startDate && createdAt <= endDate)
      );
    });
  }
}
