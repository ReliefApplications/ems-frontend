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
import { TranslateService } from '@ngx-translate/core';
import { SafeDateTranslateService } from '../../services/date-translate.service';
import { Apollo } from 'apollo-angular';
import {
  GetRecordHistoryByIdResponse,
  GET_RECORD_HISTORY_BY_ID,
} from '../../graphql/queries';
import { Change, RecordHistory } from '../../models/recordsHistory';

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
  @Input() record: Record = {};
  @Input() revert: any;
  @Input() template?: string;
  @Output() cancel = new EventEmitter();

  public history: RecordHistory = [];
  public filterHistory: RecordHistory = [];
  public loading = true;
  public showMore = false;
  public displayedColumns: string[] = ['position'];
  public filtersDate = { startDate: '', endDate: '' };
  public sortedFields: any[] = [];
  public filterField = 'all';

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
    private downloadService: SafeDownloadService,
    private translate: TranslateService,
    private dateFormat: SafeDateTranslateService,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.sortFields();

    this.apollo
      .query<GetRecordHistoryByIdResponse>({
        query: GET_RECORD_HISTORY_BY_ID,
        variables: {
          id: this.record.id,
          lang: this.translate.currentLang,
        },
      })
      .subscribe((res) => {
        this.history = res.data.recordHistory.filter(
          (version) => version.changes.length
        );
        this.filterHistory = this.history;
        this.loading = false;
      });
  }

  /**
   * Handles the cancelling of the edition of the history
   */
  onCancel(): void {
    this.cancel.emit(true);
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

  applyFilter(filterField?: string): void {
    this.filterField = filterField || this.filterField;

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
      const createdAt = new Date(item.created);
      return (
        !startDate ||
        !endDate ||
        (createdAt >= startDate && createdAt <= endDate)
      );
    });

    // filtering by field
    if (this.filterField !== 'all') {
      this.filterHistory = this.filterHistory.filter(
        (version) =>
          !!version.changes.find(
            (change) => this.filterField === `field-${change.field}`
          )
      );
    }
  }

  /**
   * Handles the download event
   *
   * @param type Type of document to download
   */
  onDownload(type: string): void {
    const path = `download/form/records/${this.record.id}/history`;
    const fileName = `${this.record.incrementalId}.${type}`;
    const queryString = new URLSearchParams({
      type,
      from: `${new Date(this.filtersDate.startDate).getTime()}`,
      to: `${new Date(this.filtersDate.endDate).getTime()}`,
      field: this.filterField.slice(6),
      lng: this.translate.currentLang,
      dateLocale: this.dateFormat.currentLang,
    }).toString();
    this.downloadService.getFile(
      `${path}?${queryString}`,
      `text/${type};charset=utf-8;`,
      fileName
    );
  }

  /**
   * Parses the structure of the record and sorts the fields
   * based on their names or lables, if available
   */
  sortFields() {
    if (!this.record.form || !this.record.form.structure) return;
    const structure = JSON.parse(this.record.form.structure);

    if (!structure.pages || !structure.pages.length) return;
    for (const page of structure.pages) {
      this.sortedFields.push(...page.elements);
    }

    this.sortedFields.sort((a, b) => {
      const compA = a.title || a.name;
      const compB = b.title || b.name;
      return compA.localeCompare(compB);
    });
  }
}
