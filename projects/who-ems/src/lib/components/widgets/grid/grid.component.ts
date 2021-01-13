import { Component, OnInit, Input, OnChanges, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { SortDescriptor, orderBy, CompositeFilterDescriptor, filterBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, GridComponent as KendoGridComponent,
  SelectionEvent, RowArgs } from '@progress/kendo-angular-grid';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditRecordMutationResponse, EDIT_RECORD, PublishNotificationMutationResponse, PUBLISH_NOTIFICATION } from '../../../graphql/mutations';
import { GetType, GET_TYPE } from '../../../graphql/queries';
import { DeleteRecordMutationResponse, DELETE_RECORD } from '../../../graphql/mutations';
import { WhoFormModalComponent } from '../../form-modal/form-modal.component';
import { Subscription } from 'rxjs';
import { QueryBuilderService } from '../../../services/query-builder.service';
import { WhoConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';

const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);

const DEFAULT_FILE_NAME = 'grid.xlsx';

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

const DISABLED_FIELDS = ['id', 'createdAt'];

@Component({
  selector: 'who-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
/*  Grid widget using KendoUI.
*/
export class WhoGridComponent implements OnInit, OnChanges, OnDestroy {

  // === TEMPLATE REFERENCE TO KENDO GRID ===
  @ViewChild(KendoGridComponent)
  private grid: KendoGridComponent;

  // === DETECTION OF TRIGGER FOR INLINE EDITION ===
  private docClickSubscription: any;

  // === DATA ===
  public gridData: GridDataResult;
  private items: any[];
  private originalItems: any[] = [];
  private updatedItems: any[] = [];
  private editedRowIndex: number;
  private editedRecordId: string;
  public formGroup: FormGroup;
  private isNew = false;
  public loading = true;
  public fields: any[] = [];
  public canEdit = false;
  private dataQuery: any;
  private dataSubscription: Subscription;

  // === SORTING ===
  public sort: SortDescriptor[];

  // === PAGINATION ===
  public pageSize = 10;
  public skip = 0;

  // === FILTER ===
  public filter: CompositeFilterDescriptor;

  // === SETTINGS ===
  @Input() header = true;
  @Input() settings: any = null;

  // === EXCEL ===
  public excelFileName: string;

  // === ACTIONS ON SELECTION
  public selectedRow: RowArgs;

  get hasChanges(): boolean {
    return this.updatedItems.length > 0;
  }

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private queryBuilder: QueryBuilderService
  ) { }

  ngOnInit(): void {}

  /*  Detect changes of the settings to (re)load the data.
  */
  ngOnChanges(): void {
    this.excelFileName = this.settings.title ? `${this.settings.title}.xlsx` : DEFAULT_FILE_NAME;

    this.dataQuery = this.queryBuilder.buildQuery(this.settings);

    if (this.dataQuery) {
      this.getRecords();
      this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    } else {
      this.loading = false;
    }
  }

  /*  Load the data, using widget parameters.
  */
  private getRecords(): void {
    this.loading = true;
    this.updatedItems = [];

    this.dataSubscription = this.dataQuery.valueChanges.subscribe(res => {
      for (const field in res.data) {
        if (Object.prototype.hasOwnProperty.call(res.data, field)) {
          this.items = res.data[field];
          this.items = this.convertDate(this.items);
          this.originalItems = cloneData(this.items);
          if (this.items.length > 0) {
            this.apollo.watchQuery<GetType>({
              query: GET_TYPE,
              variables: {
                name: this.items[0].__typename
              }
            }).valueChanges.subscribe(res2 => {
              this.loading = res2.loading;
              const settingsFields = this.settings.fields;
              const fields = res2.data.__type.fields.filter(x => x.type.kind === 'SCALAR')
                .map(x => ({ ...x, editor: this.getEditor(x.type) }));
              this.fields = settingsFields.map(x => fields.find(f => f.name === x));
              this.gridData = {
                data: this.items,
                total: res.data[field].length
              };
            });
          } else {
            this.loading = false;
          }
        }
      }
    },
      (err) => this.loading = false);
  }

  /*  Set the list of items to display.
  */
  private loadItems(): void {
    if (this.settings.pageable) {
      this.gridData = {
        data: (this.sort ? orderBy((this.filter ? filterBy(this.items, this.filter) : this.items), this.sort) :
          (this.filter ? filterBy(this.items, this.filter) : this.items))
          .slice(this.skip, this.skip + this.pageSize),
        total: this.items.length
      };
    } else {
      this.gridData = {
        data: (this.sort ? orderBy((this.filter ? filterBy(this.items, this.filter) : this.items), this.sort) :
          (this.filter ? filterBy(this.items, this.filter) : this.items)),
        total: this.items.length
      };
    }
  }

  /*  Display an embedded form in a modal to add new record.
    Create a record if result not empty.
  */
  public onAdd(): void {
    const dialogRef = this.dialog.open(WhoFormModalComponent, {
      data: {
        template: this.settings.addTemplate,
        locale: 'en'
      }
    });
  }

  /*  Inline edition of the data.
  */
  public cellClickHandler({ isEdited, dataItem, rowIndex }): void {
    if (isEdited || (this.formGroup && !this.formGroup.valid)) {
      return;
    }

    if (this.isNew) {
      rowIndex += 1;
    }

    if (this.editedRecordId) {
      this.updateCurrent();
    }

    this.formGroup = this.createFormGroup(dataItem);
    this.editedRecordId = dataItem.id;
    this.editedRowIndex = rowIndex;

    this.grid.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler(): void {
    this.closeEditor();
  }

  /*  Set the available options for resource fields, and attach them to the field.
  */
  // getResourceDropdown(): void {
  //   for (const field of this.fields) {
  //     if (field.resource) {
  //       this.apollo.watchQuery<GetResourceByIdQueryResponse>({
  //         query: GET_RESOURCE_BY_ID,
  //         variables: {
  //           id: field.resource
  //         }
  //       }).valueChanges.subscribe((res) => {
  //         field.dropdown = res.data.resource.records.map((el) => el = { id: el.id, data: el.data[field.displayField] });
  //       });
  //     }
  //   }
  // }

  /*  Update a record when inline edition completed.
  */
  public updateCurrent(): void {
    if (this.isNew) {
    } else {
      if (this.formGroup.dirty) {
        this.update(this.editedRecordId, this.formGroup.value);
      }
    }
    this.closeEditor();
  }

  private update(id: string, value: any): void {
    const item = this.updatedItems.find(x => x.id === id);
    if (item) {
      Object.assign(item, {...value, id});
    } else {
      this.updatedItems.push({...value, id});
    }
    Object.assign(this.items.find(x => x.id === id), value);
  }

  /*  Close the inline edition.
  */
  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);
    this.grid.cancelCell();
    this.isNew = false;
    this.editedRowIndex = undefined;
    this.editedRecordId = undefined;
    this.formGroup = undefined;
  }

  public onSaveChanges(): void {
    this.closeEditor();
    if (this.hasChanges) {
      const promises = [];
      for (const item of this.updatedItems) {
        const data = Object.assign({}, item);
        delete data.id;
        promises.push(this.apollo.mutate<EditRecordMutationResponse>({
          mutation: EDIT_RECORD,
          variables: {
            id: item.id,
            data
          }
        }).toPromise());
      }
      if (this.settings.channel) {
        promises.push(this.apollo.mutate<PublishNotificationMutationResponse>({
          mutation: PUBLISH_NOTIFICATION,
          variables: {
            action: 'Records update',
            content: this.updatedItems,
            channel: this.settings.channel
          }
        }).toPromise());
      }
      Promise.all(promises).then(() => this.getRecords());
    }
    // this.getRecords();
  }

  public onCancelChanges(): void {
    this.closeEditor();
    this.updatedItems = [];
    this.items = this.originalItems;
    this.originalItems = cloneData(this.originalItems);
    this.loadItems();
  }

  /*  Detect document click to save record if outside the inline edition form.
  */
  private onDocumentClick(e: any): void {
    if (this.formGroup && this.formGroup.valid &&
      !matches(e.target, '#customGrid tbody *, #customGrid .k-grid-toolbar .k-button')) {
      this.updateCurrent();
    }
  }


  public createFormGroup(dataItem: any): FormGroup {
    const formGroup = {};
    for (const field of this.fields.filter(x => !DISABLED_FIELDS.includes(x.name))) {
      formGroup[field.name] = [(field.type.name === 'Date' || field.type.name === 'DateTime') ?
        new Date(dataItem[field.name]) : dataItem[field.name]];
    }
    return this.formBuilder.group(formGroup);
  }

  // TODO: check how to implement something like that.
  private isReadOnly(field: string): boolean {
    // const readOnlyColumns = ['UnitPrice', 'UnitsInStock'];
    // return readOnlyColumns.indexOf(field) > -1;
    return false;
  }

  /*  Detect sort events and update the items loaded.
  */
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.skip = 0;
    this.loadItems();
  }

  /*  Detect pagination events and update the items loaded.
  */
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }

  /*  Detect filtering events and update the items loaded.
  */
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.loadItems();
  }

  /* Detect selection event and display actions available on rows.
  */
  public selectionChange(selection: SelectionEvent): void {
    this.selectedRow = selection.selectedRows[0];

  }

  /* Open the form corresponding to selected row in order to update it
  */
  public onUpdateRow(): void {
    const dialogRef = this.dialog.open(WhoFormModalComponent, {
      data: {
        recordId: this.selectedRow.dataItem.id,
        locale: 'en'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.dataQuery = this.queryBuilder.buildQuery(this.settings);
        this.getRecords();
        this.selectedRow = null;
      }
    });
  }

  /* Open a dialog component which provide tools to convert the selected record
  */
  public onConvertRecord(): void {
  }

  /* Open a component which display record's history
  */
  public onViewHistory(): void {

  }

  /* Open a confirmation modal and then delete the selected record
  */
  public onDeleteRow(): void {
    const dialogRef = this.dialog.open(WhoConfirmModalComponent, {
      data: {
        title: 'Delete row',
        content: `Do you confirm the deletion of this row ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        const id = this.selectedRow.dataItem.id;
        this.apollo.mutate<DeleteRecordMutationResponse>({
          mutation: DELETE_RECORD,
          variables: {
            id
          }
        }).subscribe(res => {
          this.dataQuery = this.queryBuilder.buildQuery(this.settings);
          this.getRecords();
          this.selectedRow = null;
        });
      }
    });
  }

  /*
    determines the format of the grid cells in case it is a date-like format
  */


  private convertDate(entry) {
    let tempItems = entry.map( item => {
      if(item.date) { //here we should also add item.date_time, but currently it is the wrong format from BE
        item.date = new Date(item.date);
      }
      if(item.date_time_local) { //here we should also add item.date_time, but currently it is the wrong format from BE
        item.date_time_local = new Date(item.date_time_local);
      }
      return item;
    })
    return tempItems;
  }

  private getEditor(type: any): string {
    switch (type.name) {
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
      default: {
        return null;
      }
    }
  }

  gridCellFormat(name: string, format: boolean): string {
    switch (name) {
      case 'date':
        return format ? '{0:dd/MM/yy}' : 'date';
      case 'date_time':
        return format ? '{0:dd/MM/yy HH:mm}' : '';
      case 'date_time_local':
        return format ? '{0:dd/MM/yy HH:mm}' : '';
      case 'time':
        return format ? '{0:HH:mm}' : '';
      default:
        return '';
    }
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
