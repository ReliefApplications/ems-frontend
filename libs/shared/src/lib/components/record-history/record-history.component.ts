import { Dialog } from '@angular/cdk/dialog';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Inject,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs';
import { map, scan, switchMap, takeUntil } from 'rxjs/operators';
import { Version } from '../../models/form.model';
import { DateTranslateService } from '../../services/date-translate/date-translate.service';
import { DownloadService } from '../../services/download/download.service';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { Record, RecordQueryResponse } from '../../models/record.model';
import {
  RecordHistory,
  RecordHistoryResponse,
} from '../../models/records-history.model';
import {
  GET_RECORD_BY_ID_FOR_HISTORY,
  GET_RECORD_HISTORY_BY_ID,
} from './graphql/queries';
import { FormControl, FormGroup } from '@angular/forms';
import { startCase } from 'lodash';
import { ResizeEvent } from 'angular-resizable-element';
import { DOCUMENT } from '@angular/common';

/** Number of history entries fetched per page */
export const HISTORY_PAGE_SIZE = 20;

/**
 * This is a component to access the history of a record
 */
@Component({
  selector: 'shared-record-history',
  templateUrl: './record-history.component.html',
  styleUrls: [
    './record-history-panels.scss',
    './record-history.component.scss',
  ],
})
export class RecordHistoryComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Id of the record */
  @Input() id!: string;
  /** Function to revert to a version */
  @Input() revert!: (version: Version) => void;
  /** Template of the record */
  @Input() template?: string;
  /** Show history header ( need to disable it when in modal mode ) */
  @Input() showHeader = true;
  /** Refresh content of the history */
  @Input() refresh$?: Subject<boolean> = new Subject<boolean>();
  /** Boolean indicating whether the dialog is resizable. */
  @Input() resizable = false;
  /** Event emitter for cancel event */
  @Output() cancel = new EventEmitter();

  /** Record to display */
  public record!: Record | null;
  /** Record history */
  public history: RecordHistory = [];
  /** Filtered history */
  public filterHistory: RecordHistory = [];
  /** Loading state */
  public loading = true;
  /** Loading state for the "load more" pagination action */
  public loadingMore = false;
  /** Emits history page load requests; 'reload' restarts from the first page */
  private page$ = new Subject<'reload' | 'next'>();
  /** Whether more history entries can be loaded */
  public hasMoreHistory = false;
  /** Displayed columns array */
  public displayedColumns: string[] = ['position'];
  /** Form group for date filters */
  public filters = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    fields: new FormControl([]),
  });
  /** Sorted fields */
  public sortedFields: any[] = [];
  /** Should view as table */
  viewAsTable = new FormControl(true);
  /** size style */
  public style: any = {};

  /** @returns filename from current date and record inc. id */
  get fileName(): string {
    const today = new Date();
    const formatDate = `${today.toLocaleString('en-us', {
      month: 'short',
      day: 'numeric',
    })} ${today.getFullYear()}`;
    return `${this.record?.incrementalId} ${formatDate}`;
  }

  /**
   * Record history component
   *
   * @param dialog CDK dialog service
   * @param downloadService Shared download service
   * @param translate Angular translation service
   * @param dateFormat DateTranslation service
   * @param apollo Apollo client
   * @param snackBar Shared snackbar service
   * @param document Document
   */
  constructor(
    public dialog: Dialog,
    private downloadService: DownloadService,
    private translate: TranslateService,
    private dateFormat: DateTranslateService,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  ngOnInit(): void {
    // Load history pages through a single stream: switchMap cancels any
    // in-flight request whenever a new page load is triggered
    this.page$
      .pipe(
        scan((page, action) => (action === 'reload' ? 1 : page + 1), 0),
        switchMap((page) =>
          this.queryHistoryPage(page).pipe(map((result) => ({ page, result })))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(({ page, result: { errors, data } }) => {
        this.loadingMore = false;
        if (errors) {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.history.error', {
              error: errors[0].message,
            }),
            { error: true }
          );
          if (page === 1) {
            this.cancel.emit(true);
          }
        } else {
          this.appendHistoryPage(data.recordHistory);
          this.loading = false;
        }
      });

    const setSubscription = () => {
      this.apollo
        .query<RecordQueryResponse>({
          query: GET_RECORD_BY_ID_FOR_HISTORY,
          variables: {
            id: this.id,
          },
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          this.record = data.record;
          this.sortedFields = this.sortFields(this.getFields());
        });

      this.reloadHistory();
    };
    if (this.refresh$) {
      // Set subscription to load records
      this.refresh$?.pipe(takeUntil(this.destroy$)).subscribe(() => {
        setSubscription();
      });
      // Send first refresh event to load data
      this.refresh$?.next(true);
    } else {
      setSubscription();
    }

    // Field and date filters are applied by the API, so the history must be
    // fetched again from the first page whenever they change
    this.filters.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.reloadHistory();
    });
  }

  /**
   * Reloads the history from the first page, using the current field filters.
   */
  private reloadHistory(): void {
    this.loading = true;
    // A reload cancels any in-flight "load more" request
    this.loadingMore = false;
    this.history = [];
    this.page$.next('reload');
  }

  /**
   * Queries a single page of the record's history.
   *
   * @param page Page to fetch, 1-indexed
   * @returns Observable of the GraphQL response for that page
   */
  private queryHistoryPage(page: number) {
    const { fromDate, toDate } = this.getDateRange();
    return this.apollo.query<RecordHistoryResponse>({
      query: GET_RECORD_HISTORY_BY_ID,
      variables: {
        id: this.id,
        lang: this.translate.currentLang,
        first: HISTORY_PAGE_SIZE,
        skip: (page - 1) * HISTORY_PAGE_SIZE,
        fields: this.filters.get('fields')?.value ?? [],
        fromDate,
        toDate,
      },
    });
  }

  /**
   * Gets the current date range filter, normalized to whole days.
   * Dates left unset by the user are returned as null.
   *
   * @returns The start and end dates of the current filter
   */
  private getDateRange(): { fromDate: Date | null; toDate: Date | null } {
    const startDate = this.filters.get('startDate')?.value;
    const fromDate = startDate ? new Date(startDate) : null;
    if (fromDate) fromDate.setHours(0, 0, 0, 0);
    const endDate = this.filters.get('endDate')?.value;
    const toDate = endDate ? new Date(endDate) : null;
    if (toDate) toDate.setHours(23, 59, 59, 999);
    return { fromDate, toDate };
  }

  /**
   * Appends a freshly fetched page of history entries to the current history,
   * and recomputes the filtered / table views.
   *
   * @param recordHistory Page of history entries returned by the API
   */
  private appendHistoryPage(recordHistory: RecordHistory): void {
    const entries = recordHistory.filter((item) => item.changes.length);
    this.history = this.history.concat(entries);
    this.hasMoreHistory = recordHistory.length === HISTORY_PAGE_SIZE;
    this.applyFilters();
  }

  /**
   * Loads the next page of history entries, if any, and appends them.
   */
  loadMoreHistory(): void {
    if (this.loadingMore || !this.hasMoreHistory) {
      return;
    }
    this.loadingMore = true;
    this.page$.next('next');
  }

  /**
   * Recomputes filterHistory / historyForTable from the currently loaded
   * history and the active date / field filters.
   */
  private applyFilters(): void {
    const { fromDate, toDate } = this.getDateRange();
    this.filterHistory = this.history.filter((item) => {
      const createdAt = new Date(item.createdAt);
      // Each bound applies independently, matching the API & export filtering
      return (
        (!fromDate || createdAt >= fromDate) && (!toDate || createdAt <= toDate)
      );
    });

    const fields: any = this.filters.get('fields')?.value;
    if (fields?.length > 0) {
      this.filterHistory = this.filterHistory
        .filter(
          (item) =>
            !!item.changes.find((change) => fields.includes(change.field))
        )
        .map((item) => {
          const newItem = Object.assign({}, item);
          newItem.changes = item.changes.filter((change) =>
            fields.includes(change.field)
          );
          return newItem;
        });
    }
  }

  /**
   * On resize action
   *
   * @param event resize event
   */
  onResizing(event: ResizeEvent): void {
    this.style = {
      width: `${event.rectangle.width}px`,
      // height: `${event.rectangle.height}px`,
    };
  }

  /**
   * Check if resize event is valid
   *
   * @param event resize event
   * @returns boolean
   */
  validate(event: ResizeEvent): boolean {
    const dashboardNavbars =
      this.document.getElementsByTagName('shared-navbar');
    let dashboardNavbarWidth = 0;
    if (dashboardNavbars[0]) {
      if (
        (dashboardNavbars[0] as any).offsetWidth <
        this.document.documentElement.clientWidth
      ) {
        // Only if the sidenav is not horizontal
        dashboardNavbarWidth = (dashboardNavbars[0] as any).offsetWidth;
      }
    }
    // set the min width as 30% of the screen size available
    const minWidth = Math.round(
      (this.document.documentElement.clientWidth - dashboardNavbarWidth) * 0.3
    );
    // set the max width as 95% of the screen size available
    const maxWidth = Math.round(
      (this.document.documentElement.clientWidth - dashboardNavbarWidth) * 0.95
    );
    if (
      event.rectangle.width &&
      (event.rectangle.width < minWidth || event.rectangle.width > maxWidth)
    ) {
      return false;
    }
    return true;
  }

  /**
   * Handles the cancelling of the edition of the history
   */
  onCancel(): void {
    this.cancel.emit(true);
  }

  /**
   * Display a modal to show previous version, and revert to it if user accepts.
   *
   * @param version The version to revert
   */
  async onRevert(version: any): Promise<void> {
    const { RecordModalComponent } = await import(
      '../record-modal/record-modal.component'
    );
    const dialogRef = this.dialog.open(RecordModalComponent, {
      data: {
        recordId: this.id,
        compareTo: this.history.find((item) => item.version?.id === version.id)
          ?.version,
        template: this.template,
      },
      autoFocus: false,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.revert(version);
      }
    });
  }

  /**
   * Handle the download event. Send a request to the server to get excel / csv file.
   *
   * @param type Type of document to download
   */
  onDownload(type: string): void {
    const path = `download/form/records/${this.id}/history`;
    const fields: any = this.filters.get('fields')?.value;
    const { fromDate, toDate } = this.getDateRange();
    const queryString = new URLSearchParams({
      type,
      lng: this.translate.currentLang,
      dateLocale: this.dateFormat.currentLang,
      // Only send the date range when set, so the API does not receive
      // 0 / NaN timestamps
      ...(fromDate && { from: `${fromDate.getTime()}` }),
      ...(toDate && { to: `${toDate.getTime()}` }),
      ...(fields && { fields: fields.join(',') }),
    }).toString();
    this.downloadService.getFile(
      `${path}?${queryString}`,
      `text/${type};charset=utf-8;`,
      `${this.fileName}.${type}`
    );
  }

  /**
   * Parses the structure of the record and sorts the fields
   * based on their names or lables, if available
   *
   * @param fields Array of fields
   * @returns sorted array of fields
   */
  sortFields(fields: any[]) {
    const unsortedFields = [...fields];
    return unsortedFields.sort((a, b) => {
      const compA: string = a.title || a.name;
      const compB: string = b.title || b.name;
      return compA.toLowerCase() > compB.toLowerCase() ? 1 : -1;
    });
  }

  /**
   * Get fields from the form
   *
   * @returns Returns an array with all the fields.
   */
  private getFields(): any[] {
    const fields: any[] = [];
    // No form, break the display
    if (this.record?.resource) {
      // Take the fields from the form
      this.record.resource.fields?.map((field: any) => {
        fields.push(Object.assign({}, field));
      });
      if (this.record.form && this.record.form.structure) {
        const structure = JSON.parse(this.record.form.structure);
        if (!structure.pages || !structure.pages.length) {
          return [];
        }
        for (const page of structure.pages) {
          this.extractFields(page, fields);
        }
      }
      for (const field of fields) {
        if (!field.title) {
          field.title = startCase(field.name);
        }
      }
    }
    return fields;
  }

  /**
   * Extract fields from form structure in order to get titles.
   *
   * @param object Structure to inspect, can be a page, a panel.
   * @param fields Array of fields.
   */
  private extractFields(object: any, fields: any[]): void {
    if (object.elements) {
      for (const element of object.elements) {
        if (element.type === 'panel') {
          this.extractFields(element, fields);
        } else {
          const field = fields.find((x) => x.name === element.name);
          if (field && element.title) {
            if (typeof element.title === 'string') {
              field.title = element.title;
            } else {
              field.title = element.title.default;
            }
          }
        }
      }
    }
  }

  /**
   * Clear date filter
   */
  public clearDateFilters() {
    this.filters.get('startDate')?.reset();
    this.filters.get('endDate')?.reset();
  }
}
