import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { Apollo } from 'apollo-angular';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';
import { GridSettings } from '../ui/core-grid/models/grid-settings.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SpinnerModule } from '@oort-front/ui';
import { SafeResourceDropdownModule } from '../resource-dropdown/resource-dropdown.module';
import { SafeApplicationDropdownModule } from '../application-dropdown/application-dropdown.module';
import { SafeRecordDropdownModule } from '../record-dropdown/record-dropdown.module';
import { SafeCoreGridModule } from '../ui/core-grid/core-grid.module';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@oort-front/ui';
import { ButtonModule } from '@oort-front/ui';

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
 * Interface that describes the structure of the data for the records
 */
interface IRecord {
  value: string;
  label: any;
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
    MatSelectModule,
    MatButtonModule,
    SpinnerModule,
    SafeResourceDropdownModule,
    SafeApplicationDropdownModule,
    SafeRecordDropdownModule,
    SafeCoreGridModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
  ],
  selector: 'safe-choose-record-modal',
  templateUrl: './choose-record-modal.component.html',
  styleUrls: ['./choose-record-modal.component.scss'],
})
export class SafeChooseRecordModalComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === REACTIVE FORM ===
  chooseRecordForm: UntypedFormGroup = new UntypedFormGroup({});

  // === GRID SETTINGS ===
  public settings: GridSettings = {};

  // === DATA ===
  private records = new BehaviorSubject<IRecord[]>([]);
  public records$!: Observable<IRecord[]>;
  private filter: any;
  private dataQuery: any;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };

  @ViewChild('recordSelect') recordSelect?: MatSelect;

  // === LOAD DATA ===
  public loading = true;
  public isSearchActivated = false;
  public selectedRows: any[] = [];

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param queryBuilder This is the service that will be used to build the
   * query.
   * @param formBuilder This is used to create the form that will be used
   * to search for records.
   * @param apollo This is the Apollo service that we will use to make our GraphQL
   * queries.
   * @param dialogRef This is the dialog that will be opened
   * @param data This is the data that is passed into the modal when it is
   * opened.
   */
  constructor(
    private queryBuilder: QueryBuilderService,
    private formBuilder: UntypedFormBuilder,
    private apollo: Apollo,
    public dialogRef: DialogRef<SafeChooseRecordModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = { query: this.data.targetFormQuery };
    this.filter = this.settings.query?.filter || {};
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
    if (this.dataQuery) {
      this.records$ = this.records.asObservable();
      this.dataQuery.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
        next: ({ data, loading }: any) => {
          this.updateValues(data, loading);
        },
        complete: () => (this.loading = false),
      });
    } else {
      this.loading = false;
    }
    this.chooseRecordForm = this.formBuilder.group({
      record: [null, Validators.required],
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
   * Set the boolean isSearchActivated to true on search
   */
  onSearch(): void {
    this.isSearchActivated = !this.isSearchActivated;
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

  /**
   * Closes the modal without sending data.
   */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Adds scroll listener to select.
   *
   * @param e open select event.
   */
  onOpenSelect(e: any): void {
    if (e && this.recordSelect) {
      const panel = this.recordSelect.panel.nativeElement;
      panel.addEventListener('scroll', (event: any) =>
        this.loadOnScroll(event)
      );
    }
  }

  /**
   * Fetches more resources on scroll.
   *
   * @param e scroll event.
   */
  private loadOnScroll(e: any): void {
    if (
      e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop) <
      50
    ) {
      if (!this.loading && this.pageInfo.hasNextPage) {
        this.loading = true;
        this.dataQuery
          .fetchMore({
            variables: {
              first: ITEMS_PER_PAGE,
              skip: this.records.getValue().length,
              afterCursor: this.pageInfo.endCursor,
            },
          })
          .then((results: any) =>
            this.updateValues(results.data, results.loading)
          );
      }
    }
  }

  /**
   * Update record data value
   *
   * @param data query response data
   * @param loading loading status
   */
  private updateValues(data: any, loading: boolean) {
    for (const field in data) {
      if (Object.prototype.hasOwnProperty.call(data, field)) {
        const nodes =
          data[field].edges.map((x: any) => ({
            value: x.node.id,
            label: x.node[this.data.targetFormField],
          })) || [];
        this.pageInfo = data[field].pageInfo;
        this.records.next(nodes);
      }
    }
    this.loading = loading;
  }
}
