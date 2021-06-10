import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

const DISABLED_FIELDS = ['id', 'createdAt', 'modifiedAt'];

const MULTISELECT_TYPES: string[] = ['checkbox', 'tagbox'];

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
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
    {provide: MAT_SELECT_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay]}
  ]
})
export class SafeResourceGridComponent implements OnInit {

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
  public field = '';
  public readOnly = false;

  // === DATA ===
  public gridData: GridDataResult = {data: [], total: 0};
  public availableRecords: any[] = [];
  public canDeleteSelectedRows = false;

  private items: any[] = [];

  private metaQuery: any;
  private metaFields: any;
  private dataQuery: any;

  private dataSubscription?: Subscription;
  private originalItems: any[] = [];
  public detailsField: any;

  public loading = true;

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
    private downloadService: SafeDownloadService
  ) {
  }

  ngOnInit(): void {
    this.selectableSettings.mode = this.multiSelect ? 'multiple' : 'single';
    this.dataQuery = this.queryBuilder.buildQuery(this.settings);
    this.metaQuery = this.queryBuilder.buildMetaQuery(this.settings);
    if (this.metaQuery) {
      this.metaQuery.subscribe((res: any) => {
        for (const field in res.data) {
          if (Object.prototype.hasOwnProperty.call(res.data, field)) {
            this.metaFields = res.data[field];
          }
        }
        this.getRecords();
      });
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
        this.originalItems = cloneData(this.items);
        this.detailsField = this.settings.fields.find((x: any) => x.kind === 'LIST');
      } else {
        this.originalItems = [];
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
                this.originalItems = cloneData(this.items);
                this.detailsField = fields.find((x: any) => x.kind === 'LIST');
                if (this.detailsField) {
                  this.detailsField = {...this.detailsField, actions: this.settings.actions};
                }
                this.gridData = {
                  data: this.items,
                  total: this.items.length
                };
                this.getSelectedRows();
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
      }
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

  /* Dialog to open if text or comment overlows
  */
  public onExpandComment(item: any, rowTitle: any): void {
    // this.expandComment.emit({item, rowTitle});
  }

  /* Check if element overflows
  */
  isEllipsisActive(e: any): boolean {
    return (e.offsetWidth < e.scrollWidth);
  }

  /* Download the file.
*/
  public onDownload(file: any): void {
    const path = `download/file/${file.content}`;
    this.downloadService.getFile(path, file.type, file.name);
  }

}
