import { Component, Input, OnInit } from '@angular/core';
import { GridDataResult, SelectableSettings, SelectionEvent } from '@progress/kendo-angular-grid';
import { MatDialog } from '@angular/material/dialog';
import { MAT_SELECT_SCROLL_STRATEGY, MatSelect } from '@angular/material/select';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { PopupService } from '@progress/kendo-angular-popup';
import { SafeRecordModalComponent } from '../record-modal/record-modal.component';
import { QueryBuilderService } from '../../services/query-builder.service';

const DISABLED_FIELDS = ['id', 'createdAt', 'modifiedAt'];

const MULTISELECT_TYPES: string[] = ['checkbox', 'tagbox'];

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

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

  public queryForm: any;
  public settings: any;

  // === CONST ACCESSIBLE IN TEMPLATE ===
  public multiSelectTypes: string[] = MULTISELECT_TYPES;

  // === INPUTS ===
  public id = '';
  public field = '';
  public selectedIds: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);
  public readOnly = false;

  // === DATA ===
  public gridData: GridDataResult = {data: [], total: 0};
  public availableRecords: any[] = [];
  public canDeleteSelectedRows = false;

  private items: any[] = [];
  private updatedItems: any[] = [];

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

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private queryBuilder: QueryBuilderService
  ) {
  }

  ngOnInit(): void {
    const queryName = this.queryBuilder.getQueryNameFromResourceName('CoreForm');
    const fields = this.queryBuilder.getFields(queryName);
    const firstField = this.queryBuilder.addNewField(fields[0], true);
    const obj: any = {};
    Object.keys(firstField.controls).map((f: any) => {
      console.log(firstField.controls[f].value);
      obj[f] = firstField.controls[f].value;
    });
    this.settings = {query: {name: queryName, fields: [obj]}};
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
    this.updatedItems = [];

    // Child grid
    // if (!!this.parent) {
    //   this.items = this.parent[this.settings.name];
    //   if (this.items.length > 0) {
    //     this.fields = this.getFields(this.settings.fields);
    //     this.convertDateFields(this.items);
    //     this.originalItems = cloneData(this.items);
    //     this.detailsField = this.settings.fields.find((x: any) => x.kind === 'LIST');
    //   } else {
    //     this.originalItems = [];
    //     this.fields = [];
    //     this.detailsField = '';
    //   }
    //   this.gridData = {
    //     data: this.items,
    //     total: this.items.length
    //   };
    //   this.loading = false;

    // Parent grid
    // } else {
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
              // this.setGridData.emit(this.gridData);
            }
          }
        },
        () => this.loading = false);
    } else {
      this.loading = false;
    }
    // }
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
    // const deselectedRows = selection.deselectedRows || [];
    // const selectedRows = selection.selectedRows || [];
    // if (deselectedRows.length > 0) {
    //   const deselectIndex = deselectedRows.map((item => item.index));
    //   this.selectedRowsIndex = [...this.selectedRowsIndex.filter((item) => !deselectIndex.includes(item))];
    // }
    // if (selectedRows.length > 0) {
    //   const selectedItems = selectedRows.map((item) => item.index);
    //   this.selectedRowsIndex = this.selectedRowsIndex.concat(selectedItems);
    // }
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

  public onDeleteRow(items: number[]): void {
    // const rowsSelected = items.length;
    // const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
    //   data: {
    //     title: `Delete row${rowsSelected > 1 ? 's' : ''}`,
    //     content: `Do you confirm the deletion of ${rowsSelected > 1 ?
    //       'these ' + rowsSelected : 'this'} row${rowsSelected > 1 ? 's' : ''} ?`,
    //     confirmText: 'Delete',
    //     confirmColor: 'warn'
    //   }
    // });
    // dialogRef.afterClosed().subscribe(value => {
    //   if (value) {
    //     if (resourcesFilterValues.getValue()[0].value.trim().length > 0) {
    //       this.fetchData();
    //     } else {
    //       items.forEach(i => this.availableRecords.push(this.gridData.data[i]));
    //     }
    //     const selectedRecords: any[] = this.gridData.data.filter((_, index) => !items.includes(index));
    //     this.selectedIds.next(selectedRecords.map(x => x.value));
    //     this.gridData = {
    //       data: selectedRecords,
    //       total: selectedRecords.length
    //     };
    //     this.selectedRowsIndex = [];
    //   }
    // });
  }

  public onShowDetails(index: number): void {
    this.dialog.open(SafeRecordModalComponent, {
      data: {
        recordId: this.gridData.data[index].id,
      }
    });
  }

  onFilter(value: any): void {
    console.log(value);
  }

  onExpandComment(value: any): void {
    console.log('onExpandComment', value);
  }
}
