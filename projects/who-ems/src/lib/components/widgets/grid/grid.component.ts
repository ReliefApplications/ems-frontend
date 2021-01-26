import {
  Component, OnInit, Input, OnChanges, ViewChild, Renderer2,
  OnDestroy, Output, EventEmitter,
  ComponentFactoryResolver, ComponentFactory, TemplateRef, ViewContainerRef
} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { SortDescriptor, orderBy, CompositeFilterDescriptor, filterBy } from '@progress/kendo-data-query';
import {
  GridDataResult, PageChangeEvent, GridComponent as KendoGridComponent,
  SelectionEvent, RowArgs, SelectableSettings
} from '@progress/kendo-angular-grid';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  EditRecordMutationResponse, EDIT_RECORD,
  ConvertRecordMutationResponse, CONVERT_RECORD,
  PublishNotificationMutationResponse, PUBLISH_NOTIFICATION,
  DeleteRecordMutationResponse,
  DELETE_RECORD,
  PublishMutationResponse, PUBLISH
} from '../../../graphql/mutations';
import { WhoFormModalComponent } from '../../form-modal/form-modal.component';
import { Subscription } from 'rxjs';
import { QueryBuilderService } from '../../../services/query-builder.service';
import { WhoConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { WhoConvertModalComponent } from '../../convert-modal/convert-modal.component';
import { Form } from '../../../models/form.model';
import { GetRecordDetailsQueryResponse, GET_RECORD_DETAILS } from '../../../graphql/queries';
import { WhoRecordHistoryComponent } from '../../record-history/record-history.component';
import { LayoutService } from '../../../services/layout.service';


const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);

const DEFAULT_FILE_NAME = 'grid.xlsx';

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

const DISABLED_FIELDS = ['id', 'createdAt'];

const SELECTABLE_SETTINGS: SelectableSettings = {
  checkboxOnly: true,
  mode: 'multiple',
  drag: false
};

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
  public detailsField: string;
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

  // === PARENT DATA FOR CHILDREN-GRID ===
  @Input() parent;

  // === EXCEL ===
  public excelFileName: string;

  // === ACTIONS ON SELECTION ===
  public selectedRow: RowArgs;
  public selectedRowsIndex = [];
  public hasEnabledActions: boolean;
  public selectableSettings = SELECTABLE_SETTINGS;

  // === EMIT STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  get hasChanges(): boolean {
    return this.updatedItems.length > 0;
  }

  // === HISTORY COMPONENT TO BE INJECTED IN LAYOUT SERVICE ===
  public factory: ComponentFactory<any>;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private queryBuilder: QueryBuilderService,
    private layoutService: LayoutService,
    private resolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit(): void {
    this.factory = this.resolver.resolveComponentFactory(WhoRecordHistoryComponent);
  }

  /*  Detect changes of the settings to (re)load the data.
  */
  ngOnChanges(): void {
    this.hasEnabledActions = !this.settings.actions ||
      Object.entries(this.settings.actions).filter((action) => action.includes(true)).length > 0;
    this.excelFileName = this.settings.title ? `${this.settings.title}.xlsx` : DEFAULT_FILE_NAME;

    this.dataQuery = this.queryBuilder.buildQuery(this.settings);
    this.getRecords();
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
  }

  private flatDeep(arr: any[]): any[] {
    return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? this.flatDeep(val) : val), []);
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
            editor: this.getEditor(f.type),
            disabled
          };
        }
      }
    }));
  }

  /*  Load the data, using widget parameters.
  */
  private getRecords(): void {
    this.loading = true;
    this.updatedItems = [];

    // Child grid
    if (!!this.parent) {
      this.items = this.parent[this.settings.name];
      if (this.items.length > 0) {
        this.originalItems = cloneData(this.items);
        this.fields = this.getFields(this.settings.fields);
        this.detailsField = this.settings.fields.find(x => x.kind === 'LIST');
      } else {
        this.originalItems = [];
        this.fields = [];
        this.detailsField = null;
      }
      this.gridData = {
        data: this.items,
        total: this.items.length
      };
      this.loading = false;

    // Parent grid
    } else {
      if (this.dataQuery) {
        this.dataSubscription = this.dataQuery.valueChanges.subscribe(res => {
          const fields = this.settings.query.fields;
          for (const field in res.data) {
            if (Object.prototype.hasOwnProperty.call(res.data, field)) {
              this.loading = false;
              this.items = cloneData(res.data[field]);
              this.originalItems = cloneData(this.items);
              this.fields = this.getFields(fields);
              this.detailsField = fields.find(x => x.kind === 'LIST');
              if (this.detailsField) {
                Object.assign(this.detailsField, { actions: this.settings.actions });
              }
              this.gridData = {
                data: this.items,
                total: this.items.length
              };
            }
          }
        },
          () => this.loading = false);
      } else {
        this.loading = false;
      }
    }
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
      Object.assign(item, { ...value, id });
    } else {
      this.updatedItems.push({ ...value, id });
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

  /* Save all in-line changes and then reload data
  */
  public onSaveChanges(): void {
    this.closeEditor();
    if (this.hasChanges) {
      Promise.all(this.promisedChanges()).then(() => this.reloadData());
    }
  }

  private promisedChanges(): Promise<any>[] {
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
    return promises;
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

  private getEditor(type: any): string {
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
      default: {
        return null;
      }
    }
  }

  public createFormGroup(dataItem: any): FormGroup {
    const formGroup = {};
    for (const field of this.fields.filter(x => !DISABLED_FIELDS.includes(x.name) && !x.disabled)) {
      formGroup[field.name] = [(field.type === 'Date' || field.type === 'DateTime') ?
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
    if (selection.deselectedRows.length > 0) {
      const deselectIndex = selection.deselectedRows.map((item => item.index));
      this.selectedRowsIndex = [...this.selectedRowsIndex.filter((item) => !deselectIndex.includes(item))];
    }
    if (selection.selectedRows.length > 0) {
      const selectedItems = selection.selectedRows.map((item) => item.index);
      this.selectedRowsIndex = this.selectedRowsIndex.concat(selectedItems);
    }
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
        this.reloadData();
      }
    });
  }

  public onViewHistory(): void {
    this.apollo.query<GetRecordDetailsQueryResponse>({
      query: GET_RECORD_DETAILS,
      variables: {
        id: this.selectedRow.dataItem.id
      }
    }).subscribe(res => {
      this.layoutService.setRightSidenav({
        factory: this.factory,
        inputs: {
          record: res.data.record
        }
      });
    });
  }

  /* Open a confirmation modal and then delete the selected record
  */
  public onDeleteRow(items: number[]): void {
    const rowsSelected = items.length;
    const dialogRef = this.dialog.open(WhoConfirmModalComponent, {
      data: {
        title: `Delete row${rowsSelected > 1 ? 's' : ''}`,
        content: `Do you confirm the deletion of ${rowsSelected > 1 ?
          'these ' + rowsSelected : 'this'} row${rowsSelected > 1 ? 's' : ''} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        const promises = [];
        for (const index of items) {
          const id = this.gridData.data[index].id;
          promises.push(this.apollo.mutate<DeleteRecordMutationResponse>({
            mutation: DELETE_RECORD,
            variables: { id }
          }).toPromise());
        }
        Promise.all(promises).then(() => {
          this.reloadData();
        });
      }
    });
  }

  /* Open a dialog component which provide tools to convert the selected record
  */
  public onConvertRecord(items: number[]): void {
    const rowsSelected = items.length;
    const record: string = this.gridData.data[items[0]].id;
    const dialogRef = this.dialog.open(WhoConvertModalComponent, {
      data: {
        title: `Convert record${rowsSelected > 1 ? 's' : ''}`,
        record
      },
    });
    dialogRef.afterClosed().subscribe((value: { targetForm: Form, copyRecord: boolean }) => {
      if (value) {
        const promises = [];
        for (const index of items) {
          const id = this.gridData.data[index].id;
          promises.push(this.apollo.mutate<ConvertRecordMutationResponse>({
            mutation: CONVERT_RECORD,
            variables: {
              id,
              form: value.targetForm.id,
              copyRecord: value.copyRecord
            }
          }).toPromise());
        }
        Promise.all(promises).then(() => {
          this.reloadData();
        });
      }
    });
  }

  /* Reload data and unselect all rows
  */
  private reloadData(): void {
    if (!this.parent) {
      this.dataSubscription.unsubscribe();
      this.dataQuery = this.queryBuilder.buildQuery(this.settings);
    }
    this.getRecords();
    this.selectedRow = null;
    this.selectedRowsIndex = [];
  }

  /* Execute action enabled by settings for the floating button
  */
  public async onFloatingButtonClick(): Promise<void> {
    if (this.settings.floatingButton.autoSave) {
      await Promise.all(this.promisedChanges());
    }
    if (this.settings.floatingButton.modifySelectedRows) {
      await Promise.all(this.promisedRowsModifications());
    }
    if (this.selectedRowsIndex.length > 0) {
      const selectedRecords = this.gridData.data.filter((x, index) => this.selectedRowsIndex.includes(index));
      const promises = [];
      if (this.settings.floatingButton.notify) {
        promises.push(this.apollo.mutate<PublishNotificationMutationResponse>({
          mutation: PUBLISH_NOTIFICATION,
          variables: {
            action: this.settings.floatingButton.notificationMessage ? this.settings.floatingButton.notificationMessage : 'Records update',
            content: selectedRecords,
            channel: this.settings.floatingButton.notificationChannel
          }
        }).toPromise());
      }
      if (this.settings.floatingButton.publish) {
        promises.push(this.apollo.mutate<PublishMutationResponse>({
          mutation: PUBLISH,
          variables: {
            ids: selectedRecords.map(x => x.id),
            channel: this.settings.floatingButton.publicationChannel
          }
        }).toPromise());
      }
      if (promises.length > 0) {
        await Promise.all(promises);
      }
    }
    if (this.settings.floatingButton.goToNextStep) {
      this.goToNextStep.emit(true);
    }
    this.reloadData();
  }

  /* Return a list of promises containing all the mutations in order to modify selected records accordingly to settings
  */
  private promisedRowsModifications(): Promise<any>[] {
    const promises = [];
    for (const index of this.selectedRowsIndex) {
      const record = this.gridData.data[index];
      const data = Object.assign({}, record);
      for (const modification of this.settings.floatingButton.modifications) {
        data[modification.field.name] = modification.value;
      }
      delete data.id;
      promises.push(this.apollo.mutate<EditRecordMutationResponse>({
        mutation: EDIT_RECORD,
        variables: {
          id: record.id,
          data
        }
      }).toPromise());
    }
    return promises;
  }

  /* Set selected row on three dots menu button click
  */
  setSelectedRow(index): void {
    this.selectedRow = {
      dataItem: this.gridData.data[index],
      index
    };
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
