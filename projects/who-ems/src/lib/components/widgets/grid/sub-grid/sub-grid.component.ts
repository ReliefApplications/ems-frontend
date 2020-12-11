import { Component, OnInit, OnChanges, Input, ViewChild, Renderer2 } from '@angular/core';
import { GridDataResult, PageChangeEvent, GridComponent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy, CompositeFilterDescriptor, filterBy } from '@progress/kendo-data-query';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
// import { WhoEmbeddedFormComponent } from '../../../embedded-form/embedded-form.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EditRecordMutationResponse, EDIT_RECORD } from '../../../../graphql/mutations';
import { GetResourceByIdQueryResponse, GET_RESOURCE_BY_ID, GetFormByIdQueryResponse, GET_FORM_BY_ID } from '../../../../graphql/queries';

const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);

@Component({
  selector: 'who-sub-grid',
  templateUrl: './sub-grid.component.html',
  styleUrls: ['./sub-grid.component.scss']
})
/*  Child grid of grid widget using KendoUI.
*/
export class WhoSubGridComponent implements OnInit, OnChanges {

  // === TEMPLATE REFERENCE TO KENDO GRID ===
  @ViewChild(GridComponent)
  private grid: GridComponent;

  // === DETECTION OF TRIGGER FOR INLINE EDITION ===
  private docClickSubscription: any;

  // === DATA ===
  public gridData: GridDataResult;
  private items: any[];
  private editedRowIndex: number;
  public formGroup: FormGroup;
  private isNew = false;
  private editedRowId: string;
  public loading = true;
  public fields: any[] = [];
  public canEdit = false;

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

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private renderer: Renderer2
  ) { }

  /*  Load the records.
  */
  ngOnInit(): void {
    this.items = this.parent[this.settings.field];
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    this.loading = false;
    this.loadItems();
    // if (this.settings.source) {
    //   this.getRecords();
    //   this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    // } else {
    //   this.loading = false;
    // }
  }

  /*  Detect changes of the settings to reload the data.
  */
  ngOnChanges(): void {
    this.items = this.parent[this.settings.field];
    this.loading = false;
    this.loadItems();
    // if (this.settings.source) {
    //   this.getRecords();
    // } else {
    //   this.loading = false;
    // }
  }

  /*  Set the data types.
  */
  private setDataType(data): any {
    for (const column of Object.keys(data)) {
      const field = this.settings.fields.find((el) => el.name === column);
      if (field && field.type === 'date') {
        data[column] = new Date(data[column]);
      }
    }
    return data;
  }

  /*  Load the data, using widget parameters.
  */
  private getRecords(loaded?: boolean): void {
    this.loading = true;
    const filters = [];
    if (this.settings.filter) {
      filters.push({
        name: this.settings.filter,
        equals: this.parent.id
      });
    }
  }

  /*  Set the list of items to display.
  */
  private loadItems(): void {
    this.gridData = {
      // tslint:disable-next-line: max-line-length
      data: (this.sort ? orderBy((this.filter ? filterBy(this.items, this.filter) : this.items), this.sort) :
        (this.filter ? filterBy(this.items, this.filter) : this.items))
        .slice(this.skip, this.skip + this.pageSize),
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
    if ((!this.canEdit || !this.settings || !this.settings.editable) || isEdited || (this.formGroup && !this.formGroup.valid)) {
      return;
    }

    if (this.isNew) {
      rowIndex += 1;
    }

    if (this.formGroup && this.editedRowId) {
      this.saveCurrent();
    }

    this.editedRowId = dataItem.id;
    this.formGroup = this.formBuilder.group(this.createFormGroup(dataItem));
    this.editedRowIndex = rowIndex;

    this.grid.editRow(rowIndex, this.formGroup);
  }

  /*  Set the available options for resource fields, and attach them to the field.
  */
  getResourceDropdown(): void {
    for (const field of this.fields) {
      if (field.resource) {
        this.apollo.watchQuery<GetResourceByIdQueryResponse>({
          query: GET_RESOURCE_BY_ID,
          variables: {
            id: field.resource
          }
        }).valueChanges.subscribe((res) => {
          field.dropdown = res.data.resource.records.map((el) => el = { id: el.id, data: el.data[field.displayField] });
        });
      }
    }
  }

  /*  Create the form for inline edition.
  */
  createFormGroup(dataItems): object {
    const formGroup = {};
    for (const column of Object.keys(dataItems)) {
      if (column !== 'id') {
        formGroup[column] = [dataItems[column]];
        const field = this.settings.fields.find((x) => x.name === column);
        if (field && field.isRequired) { formGroup[column].push(Validators.required); }
      }
    }
    return formGroup;
  }

  /*  Get values of the form for inline edition.
  */
  private getDirtyValues(): object {
    const dirtyValues = {};
    for (const control of Object.keys(this.formGroup.controls)) {
      if (this.formGroup.controls[control].dirty) {
        dirtyValues[control] = this.formGroup.controls[control].value;
      }
    }
    return dirtyValues;
  }

  /*  Update a record when inline edition completed.
  */
  public saveCurrent(): void {
    if (this.isNew) {
    } else {
      const data = this.getDirtyValues();
      this.apollo.mutate<EditRecordMutationResponse>({
        mutation: EDIT_RECORD,
        variables: {
          id: this.editedRowId,
          data,
          display: true
        }
      }).subscribe(res => {
        this.getRecords(true);
      });
    }
    this.closeEditor();
  }

  /*  Close the inline edition.
  */
  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);
    this.editedRowId = undefined;
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  /*  Detect document click to save record if outside the inline edition form.
  */
  private onDocumentClick(e: any): void {
    if (this.formGroup && this.formGroup.valid && this.editedRowId &&
      !matches(e.target, '#subCustomGrid tbody *, #customGrid .k-grid-toolbar .k-button')) {
      this.saveCurrent();
    }
  }

  // === EDITION ===
  /*  For previous version of record edition, a button was displayed at the right of each row.
    This method opens a modal to display the SurveyJS form for the record.
  */
  // public editHandler(event: any): void {
  //   const dialogRef = this.dialog.open(WhoEmbeddedFormComponent, {
  //     data: {
  //       template: this.settings.addTemplate,
  //       locale: 'en',
  //       recordId: event.dataItem.id
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(res => {
  //     if (res) {
  //       this.getRecords();
  //     }
  //   });
  // }
}
