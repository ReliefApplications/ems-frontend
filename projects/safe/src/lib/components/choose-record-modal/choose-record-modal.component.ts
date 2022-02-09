import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { QueryBuilderService } from '../../services/query-builder.service';
import { GridSettings } from '../ui/core-grid/models/grid-settings.model';

const ITEMS_PER_PAGE = 10;

interface DialogData {
  targetForm: any;
  targetFormField: string;
  targetFormQuery: any;
}

interface IRecord {
  value: string;
  label: any;
}

@Component({
  selector: 'safe-choose-record-modal',
  templateUrl: './choose-record-modal.component.html',
  styleUrls: ['./choose-record-modal.component.scss'],
})
export class SafeChooseRecordModalComponent implements OnInit, OnDestroy {
  // === REACTIVE FORM ===
  chooseRecordForm: FormGroup = new FormGroup({});

  // === GRID SETTINGS ===
  public settings: GridSettings = {};

  // === DATA ===
  private records = new BehaviorSubject<IRecord[]>([]);
  public records$!: Observable<IRecord[]>;
  private filter: any;
  private dataQuery: any;
  private dataSubscription?: Subscription;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };

  @ViewChild('recordSelect') recordSelect?: MatSelect;

  // === LOAD DATA ===
  public loading = true;
  public isSearchActivated = false;
  public selectedRows: any[] = [];

  constructor(
    private queryBuilder: QueryBuilderService,
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    public dialogRef: MatDialogRef<SafeChooseRecordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.settings = { query: this.data.targetFormQuery };
    this.filter = this.settings.query?.filter || {};
    const builtQuery = this.queryBuilder.buildQuery({
      ...this.settings,
      query: {
        ...this.settings.query,
        fields: [{ kind: 'SCALAR', name: this.data.targetFormField }],
      },
    });
    this.dataQuery = this.apollo.watchQuery<any>({
      query: builtQuery,
      variables: {
        ...builtQuery.variables,
        ...{
          first: ITEMS_PER_PAGE,
          filter: this.filter,
          sortField:
            this.settings.query?.sort && this.settings.query.sort.field
              ? this.settings.query.sort.field
              : null,
          sortOrder: this.settings.query?.sort?.order || '',
        },
      },
    });
    if (this.dataQuery) {
      this.records$ = this.records.asObservable();
      this.dataSubscription = this.dataQuery.valueChanges.subscribe(
        (res: any) => {
          for (const field in res.data) {
            if (Object.prototype.hasOwnProperty.call(res.data, field)) {
              const nodes =
                res.data[field].edges.map((x: any) => ({
                  value: x.node.id,
                  label: x.node[this.data.targetFormField],
                })) || [];
              this.pageInfo = res.data[field].pageInfo;
              this.records.next(nodes);
            }
          }
          this.loading = false;
        },
        () => (this.loading = false)
      );
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
      },
    };
  }

  onSearch(): void {
    this.isSearchActivated = !this.isSearchActivated;
  }

  onSelectionChange(rows: any): void {
    if (rows.selectedRows && rows.selectedRows.length > 0) {
      this.chooseRecordForm
        .get('record')
        ?.setValue(rows.selectedRows[0].dataItem.id);
    } else {
      this.chooseRecordForm.get('record')?.setValue(null);
    }
  }
  /*  Close the modal without sending data.
   */
  onClose(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
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
        this.dataQuery.fetchMore({
          variables: {
            first: ITEMS_PER_PAGE,
            skip: this.records.getValue().length,
            afterCursor: this.pageInfo.endCursor,
            filter: this.filter,
            sortField:
              this.settings.query?.sort && this.settings.query.sort.field
                ? this.settings.query.sort.field
                : null,
            sortOrder: this.settings.query?.sort?.order || '',
          },
          updateQuery: (prev: any, { fetchMoreResult }: any) => {
            if (!fetchMoreResult) {
              return prev;
            }
            for (const field in fetchMoreResult) {
              if (
                Object.prototype.hasOwnProperty.call(fetchMoreResult, field)
              ) {
                return Object.assign({}, prev, {
                  [field]: {
                    edges: [
                      ...prev[field].edges,
                      ...fetchMoreResult[field].edges,
                    ],
                    pageInfo: fetchMoreResult[field].pageInfo,
                    totalCount: fetchMoreResult[field].totalCount,
                  },
                });
              } else {
                return prev;
              }
            }
            return prev;
          },
        });
      }
    }
  }
}
