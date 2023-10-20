import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Apollo } from 'apollo-angular';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';
import { GridSettings } from '../ui/core-grid/models/grid-settings.model';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphQLSelectModule } from '@oort-front/ui';
import { CoreGridModule } from '../ui/core-grid/core-grid.module';
import { TranslateModule } from '@ngx-translate/core';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { DialogModule, FormWrapperModule, ButtonModule } from '@oort-front/ui';

/**
 * A constant that is used to set the number of items to be displayed on the page.
 */
const ITEMS_PER_PAGE = 10;

/**
 * Interface that describes the structure of the data used in the dialog
 */
interface DialogData {
  targetForm: any;
  targetFormField: string;
  targetFormQuery: any;
}

/**
 * Component used for the modals that allow the users to chose records
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreGridModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    FormWrapperModule,
    GraphQLSelectModule,
  ],
  selector: 'shared-choose-record-modal',
  templateUrl: './choose-record-modal.component.html',
  styleUrls: ['./choose-record-modal.component.scss'],
})
export class ChooseRecordModalComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  // === REACTIVE FORM ===
  public chooseRecordForm = this.fb.group({
    record: ['', Validators.required],
  });

  // === GRID SETTINGS ===
  public settings: GridSettings = {};

  // === DATA ===
  private filter: CompositeFilterDescriptor | undefined;
  public dataQuery: any;

  // === LOAD DATA ===
  public isSearchActivated = false;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param queryBuilder This is the service that will be used to build the query.
   * @param fb This is used to create the form that will be used to search for records.
   * @param apollo This is the Apollo service that we will use to make our GraphQL queries.
   * @param dialogRef This is the dialog that will be opened
   * @param data This is the data that is passed into the modal when it is opened.
   * @param document Document
   */
  constructor(
    private queryBuilder: QueryBuilderService,
    private fb: FormBuilder,
    private apollo: Apollo,
    public dialogRef: DialogRef<ChooseRecordModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    @Inject(DOCUMENT) public document: Document
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = { query: this.data.targetFormQuery };
    this.filter = this.settings.query?.filter || undefined;
    if (!this.settings.query?.name) return;

    const builtQuery = this.queryBuilder.buildQuery({
      ...this.settings,
      query: {
        ...this.settings.query,
        fields: [{ kind: 'SCALAR', name: this.data.targetFormField }],
      },
    });
    if (!builtQuery) return;

    this.dataQuery = this.apollo.watchQuery({
      query: builtQuery,
      variables: {
        ...{
          first: ITEMS_PER_PAGE,
          filter: this.filter,
          sortField:
            this.settings.query?.sort && this.settings.query.sort.field
              ? this.settings.query.sort.field
              : undefined,
          sortOrder: this.settings.query?.sort?.order || '',
        },
      },
    });

    this.settings = {
      query: this.data.targetFormQuery,
      actions: {
        delete: false,
        history: false,
        convert: false,
        update: false,
        inlineEdition: false,
        remove: false,
      },
    };
  }

  /**
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  onSearchChange(search: string): void {
    const variables = this.dataQuery.variables;
    this.dataQuery.refetch({
      ...variables,
      filter: {
        logic: 'and',
        filters: [
          {
            field: this.data.targetFormField,
            operator: 'contains',
            value: search,
          },
        ],
      },
    });
  }

  /**
   * Update the modal when rows selected changes
   *
   * @param rows Rows of the grid
   */
  onSelectionChange(rows: any): void {
    if (rows.selectedRows && rows.selectedRows.length > 0) {
      this.chooseRecordForm
        .get('record')
        ?.setValue(rows.selectedRows[0].dataItem.id);
    } else {
      this.chooseRecordForm.get('record')?.setValue(null);
    }
  }
}
