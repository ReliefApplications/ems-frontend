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
  GetRecordByIdQueryResponse,
  GetRecordHistoryByIdResponse,
  GET_RECORD_BY_ID_FOR_HISTORY,
  GET_RECORD_HISTORY_BY_ID,
} from '../../graphql/queries';
import { Change, RecordHistory } from '../../models/recordsHistory';
import { Version } from '../../models/form.model';

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
  public filterField: string | null = null;

  @ViewChild('startDate', { read: MatStartDate })
  startDate!: MatStartDate<string>;
  @ViewChild('endDate', { read: MatEndDate }) endDate!: MatEndDate<string>;

  /**
   * Constructor of the record history component
   *
   * @param dialog The material dialog service
   * @param downloadService The download service
   * @param translate The translation service
   * @param dateFormat The dateTranslation service
   * @param apollo The apollo client
   */
  constructor(
    public dialog: MatDialog,
    private downloadService: SafeDownloadService,
    private translate: TranslateService,
    private dateFormat: SafeDateTranslateService,
    private apollo: Apollo
  ) {}

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
          lang: this.translate.currentLang,
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
   * Handles the revertion of the record to a previous version
   *
   * @param version The version to revert
   */
  onRevert(version: any): void {
    const dialogRef = this.dialog.open(SafeRecordModalComponent, {
      data: {
        recordId: this.id,
        locale: 'en',
        compareTo: this.history.find((item) => item.version?.id === version.id)
          ?.version,
        template: this.template,
      },
      height: '98%',
      width: '100vw',
      panelClass: 'full-screen-modal',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.revert(version);
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
   *
   * @param filterField the name of the field being filtered, if any
   */
  applyFilter(filterField?: string): void {
    // undefined => function called from date change
    // null => 'All fields' selected
    // other => Field name for filter
    if (filterField !== undefined) this.filterField = filterField || null;

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

    // filtering by field
    if (this.filterField !== null) {
      this.filterHistory = this.filterHistory
        .filter(
          (item) =>
            !!item.changes.find((change) => this.filterField === change.field)
        )
        .map((item) => {
          const newItem = Object.assign({}, item);
          newItem.changes = item.changes.filter(
            (change) => change.field === this.filterField
          );
          return newItem;
        });
    }
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
      lng: this.translate.currentLang,
      dateLocale: this.dateFormat.currentLang,
      ...(this.filterField && { field: this.filterField }),
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
}
