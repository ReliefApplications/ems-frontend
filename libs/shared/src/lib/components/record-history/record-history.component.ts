import { Dialog } from '@angular/cdk/dialog';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Inject,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Version } from '../../models/form.model';
import { DateTranslateService } from '../../services/date-translate/date-translate.service';
import { DownloadService } from '../../services/download/download.service';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { Record, RecordQueryResponse } from '../../models/record.model';
import {
  Change,
  RecordHistory,
  RecordHistoryResponse,
} from '../../models/records-history.model';
import {
  GET_RECORD_BY_ID_FOR_HISTORY,
  GET_RECORD_HISTORY_BY_ID,
} from './graphql/queries';
import { FormControl, FormGroup } from '@angular/forms';
import { startCase, isNil } from 'lodash';
import { ResizeEvent } from 'angular-resizable-element';
import { DOCUMENT } from '@angular/common';
import { Field } from '../../services/query-builder/query-builder.service';

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
  selector: 'shared-record-history',
  templateUrl: './record-history.component.html',
  styleUrls: ['./record-history.component.scss'],
})
export class RecordHistoryComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Id of the record */
  @Input() id!: string;
  /** Function to revert to a version */
  @Input() revert!: (version: Version) => void;
  /** Template of the record */
  @Input() template?: string;
  /** Show history header ( need to disable it when in modal mode ) */
  @Input() showHeader = true;
  /** Refresh content of the history */
  @Input() refresh$?: Subject<boolean> = new Subject<boolean>();
  /** Boolean indicating whether the dialog is resizable. */
  @Input() resizable = false;
  /** Available fields for the user */
  @Input() availableFields?: Field[];
  /** Event emitter for cancel event */
  @Output() cancel = new EventEmitter();

  /** Record to display */
  public record!: Record | null;
  /** Record history */
  public history: RecordHistory = [];
  /** Filtered history */
  public filterHistory: RecordHistory = [];
  /** Loading state */
  public loading = true;
  /** Show more state */
  public showMore = false;
  /** Displayed columns array */
  public displayedColumns: string[] = ['position'];
  /** Form group for date filters */
  public filters = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    fields: new FormControl([]),
  });
  /** Sorted fields */
  public sortedFields: any[] = [];
  /** Table columns */
  public displayedColumnsHistory: string[] = [
    'variable',
    'date',
    'time',
    'person',
    'action',
    'originalValue',
    'modifiedValue',
  ];
  /** Translations for chips */
  translations = {
    withValue: this.translate.instant('components.history.changes.withValue'),
    from: this.translate.instant('components.history.changes.from'),
    to: this.translate.instant('components.history.changes.to'),
    add: this.translate.instant('components.history.changes.add'),
    remove: this.translate.instant('components.history.changes.remove'),
    modify: this.translate.instant('components.history.changes.modify'),
  };
  /** Data source for history as a table */
  historyForTable: any[] = [];
  /** Should view as table */
  viewAsTable = new FormControl(true);
  /** size style */
  public style: any = {};

  /** @returns filename from current date and record inc. id */
  get fileName(): string {
    const today = new Date();
    const formatDate = `${today.toLocaleString('en-us', {
      month: 'short',
      day: 'numeric',
    })} ${today.getFullYear()}`;
    return `${this.record?.incrementalId} ${formatDate}`;
  }

  /**
   * Record history component
   *
   * @param dialog CDK dialog service
   * @param downloadService Shared download service
   * @param translate Angular translation service
   * @param dateFormat DateTranslation service
   * @param apollo Apollo client
   * @param snackBar Shared snackbar service
   * @param document Document
   */
  constructor(
    public dialog: Dialog,
    private downloadService: DownloadService,
    private translate: TranslateService,
    private dateFormat: DateTranslateService,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  ngOnInit(): void {
    const setSubscription = () => {
      this.apollo
        .query<RecordQueryResponse>({
          query: GET_RECORD_BY_ID_FOR_HISTORY,
          variables: {
            id: this.id,
          },
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          this.record = data.record;
          this.sortedFields = this.sortFields(this.getFields());
        });

      this.apollo
        .query<RecordHistoryResponse>({
          query: GET_RECORD_HISTORY_BY_ID,
          variables: {
            id: this.id,
            lang: this.translate.currentLang,
          },
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ errors, data }) => {
          if (errors) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.history.error', {
                error: errors[0].message,
              }),
              { error: true }
            );
            this.cancel.emit(true);
          } else {
            data.recordHistory.map((item) => {
              item.changes = item.changes.filter(
                (change) =>
                  !this.availableFields ||
                  this.availableFields.findIndex(
                    (availableField) => availableField.name === change.field
                  ) !== -1
              );
              return item;
            });
            this.history = data.recordHistory.filter(
              (item) => item.changes.length
            );
            this.filterHistory = this.history;
            this.historyForTable = [];
            this.history.map((elt) => {
              elt.changes.map((change) => {
                this.setHistoryForTableFromChange(change, elt);
              });
            });
            this.loading = false;
          }
        });
    };
    if (this.refresh$) {
      // Set subscription to load records
      this.refresh$?.pipe(takeUntil(this.destroy$)).subscribe(() => {
        setSubscription();
      });
      // Send first refresh event to load data
      this.refresh$?.next(true);
    } else {
      setSubscription();
    }

    this.filters.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const startDate = this.filters.get('startDate')?.value
        ? new Date(this.filters.get('startDate')?.value as any)
        : undefined;
      if (startDate) startDate.setHours(0, 0, 0, 0);
      const endDate = this.filters.get('endDate')?.value
        ? new Date(this.filters.get('endDate')?.value as any)
        : undefined;
      if (endDate) endDate.setHours(23, 59, 59, 99);
      this.filterHistory = this.history.filter((item) => {
        const createdAt = new Date(item.createdAt);
        return (
          !startDate ||
          !endDate ||
          (createdAt >= startDate && createdAt <= endDate)
        );
      });

      const fields: any = this.filters.get('fields')?.value;
      if (fields.length > 0) {
        this.filterHistory = this.filterHistory
          .filter(
            (item) =>
              !!item.changes.find((change) => fields.includes(change.field))
          )
          .map((item) => {
            const newItem = Object.assign({}, item);
            newItem.changes = item.changes.filter((change) =>
              fields.includes(change.field)
            );
            return newItem;
          });
      }
      this.historyForTable = [];
      this.filterHistory.map((elt) => {
        elt.changes.map((change) => {
          this.setHistoryForTableFromChange(change, elt);
        });
      });
    });
  }

  /**
   * On resize action
   *
   * @param event resize event
   */
  onResizing(event: ResizeEvent): void {
    this.style = {
      width: `${event.rectangle.width}px`,
      // height: `${event.rectangle.height}px`,
    };
  }

  /**
   * Check if resize event is valid
   *
   * @param event resize event
   * @returns boolean
   */
  validate(event: ResizeEvent): boolean {
    const dashboardNavbars =
      this.document.getElementsByTagName('shared-navbar');
    let dashboardNavbarWidth = 0;
    if (dashboardNavbars[0]) {
      if (
        (dashboardNavbars[0] as any).offsetWidth <
        this.document.documentElement.clientWidth
      ) {
        // Only if the sidenav is not horizontal
        dashboardNavbarWidth = (dashboardNavbars[0] as any).offsetWidth;
      }
    }
    // set the min width as 30% of the screen size available
    const minWidth = Math.round(
      (this.document.documentElement.clientWidth - dashboardNavbarWidth) * 0.3
    );
    // set the max width as 95% of the screen size available
    const maxWidth = Math.round(
      (this.document.documentElement.clientWidth - dashboardNavbarWidth) * 0.95
    );
    if (
      event.rectangle.width &&
      (event.rectangle.width < minWidth || event.rectangle.width > maxWidth)
    ) {
      return false;
    }
    return true;
  }

  /**
   * Handles the cancelling of the edition of the history
   */
  onCancel(): void {
    this.cancel.emit(true);
  }

  /**
   * Push correct values to historyForTable list
   *
   * @param change Change to push
   * @param filterHistoryElement Filter history element (used for createdAt and createdBy)
   */
  setHistoryForTableFromChange(change: Change, filterHistoryElement: any) {
    this.historyForTable.push({
      displayName: change.displayName,
      new: change.new ? JSON.parse(change.new) : undefined,
      old: change.old ? JSON.parse(change.old) : undefined,
      type: change.type,
      createdAt: filterHistoryElement.createdAt,
      createdBy: filterHistoryElement.createdBy,
    });
  }

  /**
   * Get HTML for type chip
   *
   * @param change The field change object
   * @returns the HTML for the chip
   */
  getChipFromChange(change: Change) {
    switch (change.type) {
      case 'remove':
      case 'add':
        return `
            <span class="${change.type}-field">
            ${this.translations[change.type]}
            </span>
          `;
      case 'modify':
        return `
            <span class="${change.type}-field">
            ${this.translations[change.type]}
            </span>
          `;
    }
  }

  /**
   * Gets the HTML element from a change object
   *
   * @param change The field change object
   * @returns the innerHTML for the listing
   */
  getHTMLFromChange(change: Change) {
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
            ${this.getChipFromChange(change)}
            <b> ${change.displayName} </b>
            ${this.translations.withValue}
            <b> ${change.type === 'add' ? newVal : oldVal}</b>
          <p>
          `;
      case 'modify':
        return `
          <p>
          ${this.getChipFromChange(change)}
            <b> ${change.displayName} </b>
            ${this.translations.from}
            <b> ${oldVal}</b>
            ${this.translations.to}
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

    // arrays
    if (Array.isArray(object)) {
      return object.map((elem) => this.toReadableObjectValue(elem));
    }

    // objects - non arrays
    const res: any[] = [];
    // Prevent errors to be thrown on null objects
    if (!isNil(object)) {
      const keys = Object.keys(object);
      keys.forEach((key, i) => {
        res.push(
          `${i ? ' ' : ''}${key} (${this.toReadableObjectValue(object[key])})`
        );
      });
    }
    return res;
  }

  /**
   * Display a modal to show previous version, and revert to it if user accepts.
   *
   * @param version The version to revert
   */
  async onRevert(version: any): Promise<void> {
    const { RecordModalComponent } = await import(
      '../record-modal/record-modal.component'
    );
    const dialogRef = this.dialog.open(RecordModalComponent, {
      data: {
        recordId: this.id,
        compareTo: this.history.find((item) => item.version?.id === version.id)
          ?.version,
        template: this.template,
      },
      autoFocus: false,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.revert(version);
      }
    });
  }

  /**
   * Handle the download event. Send a request to the server to get excel / csv file.
   *
   * @param type Type of document to download
   */
  onDownload(type: string): void {
    const path = `download/form/records/${this.id}/history`;
    const fields: any = this.filters.get('fields')?.value;
    const queryString = new URLSearchParams({
      type,
      from: `${new Date(
        this.filters.get('startDate')?.value as any
      ).getTime()}`,
      to: `${new Date(this.filters.get('endDate')?.value as any).getTime()}`,
      lng: this.translate.currentLang,
      dateLocale: this.dateFormat.currentLang,
      ...(fields && { fields: fields.join(',') }),
    }).toString();
    this.downloadService.getFile(
      `${path}?${queryString}`,
      `text/${type};charset=utf-8;`,
      `${this.fileName}.${type}`
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
    if (this.record?.resource) {
      // Take the fields from the form
      this.record.resource.fields?.map((field: any) => {
        if (
          !this.availableFields ||
          this.availableFields.findIndex(
            (availableField) => availableField.name === field.name
          ) !== -1
        ) {
          fields.push(Object.assign({}, field));
        }
      });
      if (this.record.form && this.record.form.structure) {
        const structure = JSON.parse(this.record.form.structure);
        if (!structure.pages || !structure.pages.length) {
          return [];
        }
        for (const page of structure.pages) {
          this.extractFields(page, fields);
        }
      }
      for (const field of fields) {
        if (!field.title) {
          field.title = startCase(field.name);
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
   * Clear date filter
   */
  public clearDateFilters() {
    this.filters.get('startDate')?.reset();
    this.filters.get('endDate')?.reset();
  }
}
