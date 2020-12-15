import { Component, OnInit, OnChanges, Input, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { GridDataResult, PageChangeEvent, GridComponent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy, CompositeFilterDescriptor, filterBy } from '@progress/kendo-data-query';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
// import { WhoEmbeddedFormComponent } from '../../../embedded-form/embedded-form.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EditRecordMutationResponse, EDIT_RECORD } from '../../../../graphql/mutations';
import { GetResourceByIdQueryResponse, GET_RESOURCE_BY_ID, GetFormByIdQueryResponse, GET_FORM_BY_ID, GetType, GET_TYPE } from '../../../../graphql/queries';
import { Subscription } from 'rxjs';

const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);

const DEFAULT_FILE_NAME = 'grid.xlsx';

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

const DISABLED_FIELDS = ['id', 'createdAt'];

@Component({
  selector: 'who-sub-grid',
  templateUrl: './sub-grid.component.html',
  styleUrls: ['./sub-grid.component.scss']
})
/*  Child grid of grid widget using KendoUI.
*/
export class WhoSubGridComponent implements OnInit, OnChanges, OnDestroy {

  // === TEMPLATE REFERENCE TO KENDO GRID ===
  @ViewChild(GridComponent)
  private grid: GridComponent;

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
  private dataSubscription: Subscription;

  // === SORTING ===
  public sort: SortDescriptor[];

  // === PAGINATION ===
  public pageSize = 10;
  public skip = 0;

  // === FILTER ===
  public filter: CompositeFilterDescriptor;

  // === SETTINGS ===
  @Input() settings: any = null;
  @Input() parent: any;

  // === EXCEL ===
  public excelFileName: string;

  get hasChanges(): boolean {
    return this.updatedItems.length > 0;
  }

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void { }

  /*  Detect changes of the settings to (re)load the data.
  */
  ngOnChanges(): void {
    this.excelFileName = DEFAULT_FILE_NAME;
    this.items = this.parent[this.settings.field];
    this.getRecords();
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
  }

  /*  Load the data, using widget parameters.
  */
  private getRecords(): void {
    this.loading = true;
    this.updatedItems = [];
    if (this.items.length > 0) {
      if (this.items.length > 0) {
        this.apollo.watchQuery<GetType>({
          query: GET_TYPE,
          variables: {
            name: this.items[0].__typename
          }
        }).valueChanges.subscribe(res => {
          this.loading = res.loading;
          const fields = res.data.__type.fields.filter(x => x.type.kind === 'SCALAR');
          this.fields = fields.map(x => ({ ...x, editor: this.getEditor(x.type) }));
        });
      } else {
        this.loading = false;
      }
      this.gridData = {
        data: this.items,
        total: this.items.length
      };
    } else {
      this.loading = false;
    }
  }

  /*  Set the list of items to display.
  */
  private loadItems(): void {
    this.gridData = {
      data: (this.sort ? orderBy((this.filter ? filterBy(this.items, this.filter) : this.items), this.sort) :
        (this.filter ? filterBy(this.items, this.filter) : this.items)),
      total: this.items.length
    };
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

  /*  Display an embedded form in a modal to add new record.
    Create a record if result not empty.
  */
  public onAdd(): void {
    // const dialogRef = this.dialog.open(WhoEmbeddedFormComponent, {
    //   data: {
    //     template: this.settings.addTemplate,
    //     locale: 'en'
    //   }
    // });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.items.push(res.data.data);
    //     this.loadItems();
    //   }
    // });
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
      !matches(e.target, '#subCustomGrid tbody *, #customGrid .k-grid-toolbar .k-button')) {
        this.updateCurrent();
    }
  }

  private getEditor(type: any): string {
    switch (type.name) {
      case 'Int': {
        return 'numeric';
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

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
