import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { GridDataResult, SelectableSettings, SelectionEvent } from '@progress/kendo-angular-grid';
import { MatDialog } from '@angular/material/dialog';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { PopupService } from '@progress/kendo-angular-popup';
import { SafeRecordModalComponent } from '../record-modal/record-modal.component';
import { QueryBuilderService } from '../../services/query-builder.service';
import { SafeDownloadService } from '../../services/download.service';
import { GradientSettings } from '@progress/kendo-angular-inputs';
import { MAT_TOOLTIP_SCROLL_STRATEGY } from '@angular/material/tooltip';
import { SafeApiProxyService } from '../../services/api-proxy.service';

const DISABLED_FIELDS = ['id', 'createdAt', 'modifiedAt'];

const MULTISELECT_TYPES: string[] = ['checkbox', 'tagbox', 'owner'];

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  const block = () => overlay.scrollStrategies.block();
  return block;
}


const GRADIENT_SETTINGS: GradientSettings = {
  opacity: false
};

@Component({
  selector: 'safe-resource-grid',
  templateUrl: './resource-grid.component.html',
  styleUrls: ['./resource-grid.component.scss'],
  providers: [
    PopupService,
    { provide: MAT_SELECT_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] },
    { provide: MAT_TOOLTIP_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] }
  ]
})
export class SafeResourceGridComponent implements OnInit, OnDestroy {

  @Input()
  multiSelect = false;

  @Input()
  settings: any = {};

  @Input()
  selectedRows: string[] = [];

  // === PARENT DATA FOR CHILDREN-GRID ===
  @Input() parent: any;

  @Output()
  rowSelected: EventEmitter<any> = new EventEmitter<any>();

  public queryForm: any;

  // === CONST ACCESSIBLE IN TEMPLATE ===
  public multiSelectTypes: string[] = MULTISELECT_TYPES;

  // === INPUTS ===
  public id = '';
  public readOnly = false;

  // === DATA ===
  public gridData: GridDataResult = { data: [], total: 0 };
  public availableRecords: any[] = [];
  public canDeleteSelectedRows = false;

  private items: any[] = [];

  private metaQuery: any;
  private metaFields: any;
  private dataQuery: any;

  private dataSubscription?: Subscription;
  public detailsField: any;

  public loading = true;
  public queryError = false;

  public fields: any[] = [];

  public fieldForms: any[] = [];

  // === ACTIONS ON SELECTION ===
  public selectedRowsIndex: number[] = [];
  public selectableSettings: SelectableSettings = {
    checkboxOnly: true,
    mode: this.multiSelect ? 'multiple' : 'single',
    drag: false
  };

  public gradientSettings = GRADIENT_SETTINGS;
  public editionActive = false;

  constructor(
    public dialog: MatDialog,
    private queryBuilder: QueryBuilderService,
    private downloadService: SafeDownloadService,
    private apiProxyService: SafeApiProxyService
  ) { }

  ngOnInit(): void {
    this.selectableSettings.mode = this.multiSelect ? 'multiple' : 'single';
    this.init();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public init(): void {
    this.dataQuery = this.queryBuilder.buildQuery(this.settings);
    this.metaQuery = this.queryBuilder.buildMetaQuery(this.settings, this.parent);
    if (this.metaQuery) {
      this.metaQuery.subscribe(async (res: any) => {
        for (const field in res.data) {
          if (Object.prototype.hasOwnProperty.call(res.data, field)) {
            this.metaFields = Object.assign({}, res.data[field]);
            await this.populateMetaFields();
          }
        }
        this.getRecords();
      });
    } else {
      this.loading = false;
      this.queryError = true;
    }
  }

  private getRecords(): void {
    this.loading = true;

    // Child grid
    if (!!this.parent) {
      this.items = this.parent[this.settings.name];
      if (this.items.length > 0) {
        this.fields = this.getFields(this.settings.fields);
        this.convertDateFields(this.items);
        this.detailsField = this.settings.fields.find((x: any) => x.kind === 'LIST');
      } else {
        this.fields = [];
        this.detailsField = '';
      }
      this.gridData = {
        data: this.items,
        total: this.items.length
      };
      this.loading = false;
      // Parent grid
    } else {
      if (this.dataQuery) {
        this.dataSubscription = this.dataQuery.valueChanges.subscribe((res: any) => {
          const fields = this.settings.query.fields;
          for (const field in res.data) {
            if (Object.prototype.hasOwnProperty.call(res.data, field)) {
              this.loading = false;
              this.fields = this.getFields(fields);
              this.items = cloneData(res.data[field] ? res.data[field] : []);
              this.convertDateFields(this.items);
              this.detailsField = fields.find((x: any) => x.kind === 'LIST');
              if (this.detailsField) {
                this.detailsField = { ...this.detailsField, actions: this.settings.actions };
              }
              this.gridData = {
                data: this.items,
                total: this.items.length
              };
              if (!this.readOnly) {
                this.getSelectedRows();
              }
            }
          }
        },
          () => this.loading = false);
      } else {
        this.loading = false;
      }
    }
  }

  private getSelectedRows(): void {
    if (this.selectedRows.length > 0) {
      this.gridData.data.forEach((row: any, index: number) => {
        if (this.selectedRows.includes(row.id)) {
          this.selectedRowsIndex.push(index);
        }
      });
    }
  }

  private getFields(fields: any[], prefix?: string, disabled?: boolean): any[] {
    return this.flatDeep(fields.filter(x => x.kind !== 'LIST').map(f => {
      switch (f.kind) {
        case 'OBJECT': {
          return this.getFields(f.fields, f.name, true);
        }
        default: {
          return {
            name: prefix ? `${prefix}.${f.name}` : f.name,
            title: f.label ? f.label : f.name,
            type: f.type,
            format: this.getFormat(f.type),
            editor: this.getEditor(f.type),
            filter: this.getFilter(f.type),
            meta: this.metaFields[f.name],
            disabled: disabled || DISABLED_FIELDS.includes(f.name)
            // disabled: disabled || DISABLED_FIELDS.includes(f.name) || this.metaFields[f.name].readOnly
          };
        }
      }
    }));
  }

  private convertDateFields(items: any[]): void {
    const dateFields = this.fields.filter(x => ['Date', 'DateTime', 'Time'].includes(x.type)).map(x => x.name);
    items.map(x => {
      for (const [key, value] of Object.entries(x)) {
        if (dateFields.includes(key)) {
          x[key] = x[key] && new Date(x[key]);
        }
      }
    });
  }

  private flatDeep(arr: any[]): any[] {
    return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? this.flatDeep(val) : val), []);
  }

  private getEditor(type: any): string {
    switch (type) {
      case 'Int': {
        return 'numeric';
      }
      case 'Float': {
        return 'float';
      }
      case 'Boolean': {
        return 'boolean';
      }
      case 'Date': {
        return 'date';
      }
      case 'DateTime': {
        return 'datetime';
      }
      case 'Time': {
        return 'time';
      }
      case 'JSON': {
        return '';
      }
      default: {
        return 'text';
      }
    }
  }

  private getFormat(type: any): string {
    switch (type) {
      case 'Date':
        return 'dd/MM/yy';
      case 'DateTime':
        return 'dd/MM/yy HH:mm';
      case 'Time':
        return 'HH:mm';
      default:
        return '';
    }
  }

  private getFilter(type: any): string {
    switch (type) {
      case 'Int': {
        return 'numeric';
      }
      case 'Boolean': {
        return 'boolean';
      }
      case 'Date': {
        return 'date';
      }
      case 'DateTime': {
        return 'date';
      }
      case 'Time': {
        return 'date';
      }
      case 'JSON': {
        return '';
      }
      default: {
        return 'text';
      }
    }
  }

  selectionChange(selection: SelectionEvent): void {
    this.rowSelected.emit(selection);
  }

  onAdd(event: any): void {
    // const matSelect: MatSelect = event.source;
    // matSelect.writeValue(null);
    // const value = this.availableRecords.filter(d => d.value === event.value)[0];
    // if (value) {
    //   const selectedRecords: any[] = this.gridData.data;
    //   selectedRecords.push(value);
    //   this.selectedIds.next(selectedRecords.map(x => x.value));
    //   this.gridData = {
    //     data: selectedRecords,
    //     total: selectedRecords.length
    //   };
    //   this.availableRecords = this.availableRecords.filter(d => d.value !== value.value);
    // }
  }

  public onShowDetails(index: number): void {
    this.dialog.open(SafeRecordModalComponent, {
      data: {
        recordId: this.gridData.data[index].id,
        locale: 'en',
      },
      height: '98%',
      width: '100vw',
      panelClass: 'full-screen-modal',
    });
  }

  onFilter(value: any): void {
    this.selectedRowsIndex = [];
    this.selectedRows = [];
    const filteredData: any[] = [];
    this.items.forEach((data: any) => {
      const auxData = data;
      delete auxData.canDelete;
      delete auxData.canUpdate;
      delete auxData.__typename;
      if (Object.values(auxData).filter((o: any) => !!o && o.toString().toLowerCase().includes(value.value.toLowerCase())).length > 0) {
        filteredData.push(data);
      }
    });
    this.gridData = {
      data: filteredData,
      total: filteredData.length
    };
  }

  /**
   * Displays text instead of values for questions with select.
   * @param meta meta data of the question.
   * @param value question value.
   * @returns text value of the question.
   */
  public getDisplayText(value: string | string[], meta: { choices?: { value: string, text: string }[] }): string | string[] {
    if (meta.choices) {
      if (Array.isArray(value)) {
        return meta.choices.reduce((acc: string[], x) => value.includes(x.value) ? acc.concat([x.text]) : acc, []);
      } else {
        return meta.choices.find(x => x.value === value)?.text || '';
      }
    } else {
      return value;
    }
  }

  /* Dialog to open if text or comment overlows
  */
  public onExpandComment(item: any, rowTitle: any): void {
    // this.expandComment.emit({item, rowTitle});
  }

  /* Check if element overflows
  */
  // isEllipsisActive(e: any): boolean {
  //   return (e.offsetWidth < e.scrollWidth);
  // }

  /**
   * Downloads the file.
   * @param file file to download.
   */
  public onDownload(file: any): void {
    const path = `download/file/${file.content}`;
    this.downloadService.getFile(path, file.type, file.name);
  }

  /**
   * Fetch choices from URL if needed
   */
  private async populateMetaFields(): Promise<void> {
    for (const fieldName of Object.keys(this.metaFields)) {
      const meta = this.metaFields[fieldName];
      if (meta.choicesByUrl) {
        const url: string = meta.choicesByUrl.url;
        const localRes = localStorage.getItem(url);
        if (localRes) {
          this.metaFields[fieldName] = {
            ...meta,
            choices: this.extractChoices(JSON.parse(localRes), meta.choicesByUrl)
          };
        } else {
          const res: any = await this.apiProxyService.promisedRequestWithHeaders(url);
          localStorage.setItem(url, JSON.stringify(res));
          this.metaFields[fieldName] = {
            ...meta,
            choices: this.extractChoices(res, meta.choicesByUrl)
          };
        }
      }
    }
  }

  /**
   * Extracts choices using choicesByUrl properties
   * @param res Result of http request.
   * @param choicesByUrl Choices By Url property.
   * @returns list of choices.
   */
  private extractChoices(res: any, choicesByUrl: { path?: string, value?: string, text?: string }): { value: string, text: string }[] {
    const choices = choicesByUrl.path ? [...res[choicesByUrl.path]] : [...res];
    return choices ? choices.map((x: any) => ({
      value: (choicesByUrl.value ? x[choicesByUrl.value] : x).toString(),
      text: choicesByUrl.text ? x[choicesByUrl.text] : choicesByUrl.value ? x[choicesByUrl.value] : x
    })) : [];
  }
}
