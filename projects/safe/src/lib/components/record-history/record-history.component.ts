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
  public sortedFields: any[] = [];
  public filterField = 'all';

  @ViewChild('startDate', { read: MatStartDate })
  startDate!: MatStartDate<string>;
  @ViewChild('endDate', { read: MatEndDate }) endDate!: MatEndDate<string>;

  constructor(
    public dialog: MatDialog,
    private downloadService: SafeDownloadService,
    private translate: TranslateService,
    private dateFormat: SafeDateTranslateService
  ) {}

  ngOnInit(): void {
    this.sortFields();

    this.history = this.getHistory(this.record).filter(
      (item) => item.changes.length > 0
    );
    this.filterHistory = this.history;
    this.loading = false;
  }

  onCancel(): void {
    this.cancel.emit(true);
  }

  /*  Get current and next record to see difference and put it in a string
   */
  getDifference(
    current: any,
    after: any
  ): { changes: string[]; touched: string[] } {
    const touched: string[] = [];
    const changes: any[] = [];
    if (current) {
      const keysCurrent = Object.keys(current);
      keysCurrent.forEach((key) => {
        let touchedFlag = false;
        if (
          typeof after[key] === 'boolean' ||
          typeof current[key] === 'boolean'
        ) {
          if (current[key] !== null && after[key] !== current[key]) {
            changes.push(this.modifyField(key, after, current));
            touchedFlag = true;
          }
        } else if (!Array.isArray(after[key]) && !Array.isArray(current[key])) {
          if (after[key]) {
            if (after[key] instanceof Object && current[key]) {
              const element = this.modifyObjects(after, current, key);
              if (element.length > 0) {
                changes.push(element);
                touchedFlag = true;
              }
            } else if (current[key] && after[key] !== current[key]) {
              changes.push(this.modifyField(key, after, current));
              touchedFlag = true;
            }
          } else if (current[key]) {
            if (current[key] instanceof Object) {
              const element = this.modifyObjects(after, current, key);
              if (element.length > 0) {
                changes.push(element);
                touchedFlag = true;
              }
            } else if (after[key] !== current[key]) {
              changes.push(this.modifyField(key, after, current));
              touchedFlag = true;
            } else {
              changes.push(this.addField(key, current));
              touchedFlag = true;
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
            touchedFlag = true;
          } else if (!after[key] && current[key]) {
            changes.push(this.addField(key, current));
            touchedFlag = true;
          }
        }
        if (touchedFlag) touched.push(key);
      });
    }

    const keysAfter = Object.keys(after);
    keysAfter.forEach((key) => {
      let touchedFlag = false;
      if (typeof after[key] === 'boolean') {
        if ((!current || current[key]) === null && after[key] !== null) {
          changes.push(
            '<p><span class="add-field">Add field</span> <b>' +
              this.getFieldTitle(key) +
              '</b> with value <b>' +
              after[key] +
              '</b> </p>'
          );
          touchedFlag = true;
        }
      } else if (
        (!current || current[key] === null) &&
        !Array.isArray(after[key]) &&
        after[key] instanceof Object
      ) {
        const element = this.addObject(after, key);
        if (element.length > 0) {
          changes.push(element);
          touchedFlag = true;
        }
      } else if ((!current || current[key] === null) && after[key]) {
        changes.push(
          '<p><span class="add-field">Add field</span> <b>' +
            this.getFieldTitle(key) +
            '</b> with value <b>' +
            after[key] +
            '</b> </p>'
        );
        touchedFlag = true;
      }
      if (touchedFlag && !touched.find((_key) => key === _key))
        touched.push(key);
    });
    return { changes, touched };
  }

  private addObject(current: any, key: string): string {
    const currentKeys = Object.keys(current[key]);
    let currentValuesHTML = '';
    let element = `<p> <span class="add-field">Add field</span> <b> ${this.getFieldTitle(
      key
    )} </b> with value  `;
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
      this.getFieldTitle(key) +
      '</b> with value <b>' +
      current[key] +
      '</b> </p>'
    );
  }

  private modifyField(key: string, after: any, current: any): string {
    if (after[key] === null) {
      return (
        '<p> <span  class="remove-field">Remove field</span> <b>' +
        this.getFieldTitle(key) +
        '</b> with value <b>' +
        current[key] +
        '</b> </p>'
      );
    } else {
      return (
        '<p> <span  class="modify-field">Change field</span> <b>' +
        this.getFieldTitle(key) +
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
    let element = `<p> <span class="modify-field">Change field</span> <b> ${this.getFieldTitle(
      key
    )} </b> from  `;
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

  private getHistory(record: Record): any[] {
    const res: any[] = [];
    const versions = record.versions || [];
    let difference;
    if (versions.length === 0) {
      difference = this.getDifference(null, record.data);
      res.push({
        created: record.createdAt,
        createdBy: record.createdBy?.name,
        id: record.id,
        ...difference,
      });
      return res;
    }
    difference = this.getDifference(null, versions[0].data);
    res.push({
      created: versions[0].createdAt,
      createdBy: record.createdBy?.name,
      id: versions[0].id,
      ...difference,
    });
    for (let i = 1; i < versions.length; i++) {
      difference = this.getDifference(versions[i - 1].data, versions[i].data);
      res.push({
        created: versions[i].createdAt,
        createdBy: versions[i - 1].createdBy?.name,
        id: versions[i].id,
        ...difference,
      });
    }
    difference = this.getDifference(
      versions[versions.length - 1].data,
      record.data
    );
    res.push({
      created: record.modifiedAt,
      createdBy: versions[versions.length - 1].createdBy?.name,
      id: record.id,
      ...difference,
    });
    return res.reverse();
  }

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

  clearDateFilter(): void {
    this.filtersDate.startDate = '';
    this.filtersDate.endDate = '';
    this.filterHistory = this.history;
    this.startDate.value = '';
    this.endDate.value = '';
  }

  applyFilter(filterField?: string): void {
    this.filterField = filterField || this.filterField;

    const startDate = new Date(this.filtersDate.startDate).setHours(0, 0, 0, 0);
    const endDate = new Date(this.filtersDate.endDate).setHours(23, 59, 59, 99);

    // filtering by date
    this.filterHistory = this.history.filter(
      (item) =>
        !startDate ||
        !endDate ||
        (item.created >= startDate && item.created <= endDate)
    );

    // filtering by field
    if (this.filterField !== 'all')
      this.filterHistory = this.filterHistory.filter(
        (item) =>
          !!item.touched.find(
            (op: string) => `field-${op}` === this.filterField
          )
      );
  }

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

    console.log(structure);

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

  /**
   * @param key field name
   * @returns the field name or it's title, when avaiable
   */
  getFieldTitle(key: string): string {
    const field = this.sortedFields.find((item) => item.name === key);
    return field.title || field.name;
  }

  getFieldValue(key: string, value: any): any {}
}
