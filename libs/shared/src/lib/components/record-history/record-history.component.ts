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
  Change,
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
import { ReadableHistoryValuePipe } from '../../pipes/readable-history-value/readable-history-value.pipe';

/** Number of history entries fetched per page */
const HISTORY_PAGE_SIZE = 20;

/** History change as displayed, with its precomputed HTML content */
type DisplayChange = Change & { html?: string };

/** History entries as displayed, with precomputed HTML content for each change */
type DisplayHistory = (Omit<RecordHistory[number], 'changes'> & {
  changes: DisplayChange[];
})[];

/** Record history table row with pre-rendered safe HTML values */
interface HistoryTableRow {
  displayName: string;
  oldHtml?: string;
  newHtml?: string;
  expandable?: boolean;
  expanded?: boolean;
  renderError?: boolean;
  type: Change['type'];
  chip?: string;
  createdAt: Date;
  createdBy: string;
}

/** Context needed when flattening a change into a table row */
interface HistoryTableContext {
  createdAt: Date;
  createdBy: string;
}

/** Rendered HTML versions of a change's values */
interface RenderedHistoryValues {
  oldHtml: string;
  newHtml: string;
  expandable: boolean;
}

/** Highlighted HTML versions of a change's values */
type HighlightedHistoryValues = Pick<
  RenderedHistoryValues,
  'oldHtml' | 'newHtml'
>;

/** CSS class used to highlight changed text segments */
const HISTORY_VALUE_HIGHLIGHT_CLASS = 'history-value-highlight';

/** CSS class used to highlight text removed from the old value */
const HISTORY_VALUE_REMOVED_CLASS = 'history-value-highlight-removed';

/** CSS class used to highlight text added to the new value */
const HISTORY_VALUE_ADDED_CLASS = 'history-value-highlight-added';

/** Minimum value length before changed segments are highlighted */
const HISTORY_VALUE_HIGHLIGHT_MIN_LENGTH = 30;

/** Minimum value length before table values are collapsed */
const HISTORY_VALUE_COLLAPSE_MIN_LENGTH = 240;

/** Minimum line count before table values are collapsed */
const HISTORY_VALUE_COLLAPSE_MIN_LINES = 4;

/**
 * Checks if a value is a non-null object.
 *
 * @param value Value to check
 * @returns True when the value is an object
 */
const isObjectValue = (value: unknown): value is object =>
  typeof value === 'object' && value !== null;

/**
 * This is a component to access the history of a record
 */
@Component({
  selector: 'shared-record-history',
  templateUrl: './record-history.component.html',
  styleUrls: ['./record-history.component.scss'],
  providers: [ReadableHistoryValuePipe],
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
  public filterHistory: DisplayHistory = [];
  /** Loading state */
  public loading = true;
  /** Loading state for the "load more" pagination action */
  public loadingMore = false;
  /** Emits history page load requests; 'reload' restarts from the first page */
  private page$ = new Subject<'reload' | 'next'>();
  /** Whether more history entries can be loaded */
  public hasMoreHistory = false;
  /** Show more state */
  public showMore = false;
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
  /** Table columns */
  public displayedColumnsHistory: string[] = [
    'variable',
    'date',
    'time',
    'person',
    'action',
    'originalValue',
    'modifiedValue',
  ];
  /** Translations for chips */
  translations = {
    withValue: this.translate.instant('components.history.changes.withValue'),
    from: this.translate.instant('components.history.changes.from'),
    to: this.translate.instant('components.history.changes.to'),
    add: this.translate.instant('components.history.changes.add'),
    remove: this.translate.instant('components.history.changes.remove'),
    modify: this.translate.instant('components.history.changes.modify'),
  };
  /** Data source for history as a table */
  historyForTable: HistoryTableRow[] = [];
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
   * @param readableHistoryValue Readable history value pipe
   * @param document Document
   */
  constructor(
    public dialog: Dialog,
    private downloadService: DownloadService,
    private translate: TranslateService,
    private dateFormat: DateTranslateService,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private readableHistoryValue: ReadableHistoryValuePipe,
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
   * TrackBy function keeping DOM elements stable when the history is rebuilt,
   * so loading more entries only appends new elements.
   *
   * @param index Index of the item
   * @returns The index, as identity
   */
  trackByIndex(index: number): number {
    return index;
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
    // Precompute the HTML content of each change, so it is not rebuilt on
    // every change detection cycle
    this.filterHistory = this.filterHistory.map((item) => ({
      ...item,
      changes: item.changes.map((change) => ({
        ...change,
        html: this.getHTMLFromChange(change),
      })),
    }));
    this.historyForTable = [];
    this.filterHistory.map((elt) => {
      elt.changes.map((change) => {
        this.setHistoryForTableFromChange(change, elt);
      });
    });
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
   * Push correct values to historyForTable list
   *
   * @param change Change to push
   * @param filterHistoryElement Filter history element (used for createdAt and createdBy)
   */
  setHistoryForTableFromChange(
    change: Change,
    filterHistoryElement: HistoryTableContext
  ) {
    try {
      const values = this.getRenderedHistoryValues(change);
      this.historyForTable.push({
        displayName: change.displayName,
        newHtml: values.newHtml,
        oldHtml: values.oldHtml,
        expandable: values.expandable,
        type: change.type,
        chip: this.getChipFromChange(change),
        createdAt: filterHistoryElement.createdAt,
        createdBy: filterHistoryElement.createdBy,
      });
    } catch {
      this.historyForTable.push({
        displayName: change.displayName,
        renderError: true,
        type: change.type,
        chip: this.getChipFromChange(change),
        createdAt: filterHistoryElement.createdAt,
        createdBy: filterHistoryElement.createdBy,
      });
    }
  }

  /**
   * Toggles a collapsed old/new table comparison.
   *
   * @param row History table row
   */
  toggleHistoryValue(row: HistoryTableRow): void {
    row.expanded = !row.expanded;
  }

  /**
   * Get HTML for type chip
   *
   * @param change The field change object
   * @returns the HTML for the chip
   */
  getChipFromChange(change: Change) {
    return `
      <span class="${change.type}-field">
        ${this.escapeHtml(this.translations[change.type])}
      </span>
    `;
  }

  /**
   * Gets the HTML element from a change object
   *
   * @param change The field change object
   * @returns the innerHTML for the listing
   */
  getHTMLFromChange(change: Change) {
    try {
      const values = this.getRenderedHistoryValues(change);
      const displayName = this.escapeHtml(change.displayName);
      const chip = this.getChipFromChange(change);
      const changedValue =
        change.type === 'add' ? values.newHtml : values.oldHtml;

      switch (change.type) {
        case 'remove':
        case 'add':
          return `
            <p class="history-change">
              ${chip}
              <b> ${displayName} </b>
              ${this.escapeHtml(this.translations.withValue)}
              <b class="history-value"> ${changedValue}</b>
            </p>
          `;
        case 'modify':
          return `
            <p class="history-change">
              ${chip}
              <b> ${displayName} </b>
              ${this.escapeHtml(this.translations.from)}
              <b class="history-value"> ${values.oldHtml}</b>
              ${this.escapeHtml(this.translations.to)}
              <b class="history-value"> ${values.newHtml}</b>
            </p>
          `;
      }
    } catch {
      return `<p class="italic text-gray-400">${this.translate.instant(
        'components.history.renderError'
      )}</p>`;
    }
  }

  /**
   * Parses, formats and highlights the old/new values of a history change.
   *
   * @param change The field change object
   * @returns Plain text and highlighted HTML versions of the values
   */
  private getRenderedHistoryValues(change: Change): RenderedHistoryValues {
    const oldText = this.parseHistoryValue(change.old);
    const newText = this.parseHistoryValue(change.new);
    const shouldHighlight =
      oldText.length >= HISTORY_VALUE_HIGHLIGHT_MIN_LENGTH ||
      newText.length >= HISTORY_VALUE_HIGHLIGHT_MIN_LENGTH;
    const expandable =
      this.isExpandableHistoryValue(oldText) ||
      this.isExpandableHistoryValue(newText);

    if (change.type !== 'modify' || !shouldHighlight) {
      return {
        oldHtml: this.escapeHtml(oldText),
        newHtml: this.escapeHtml(newText),
        expandable,
      };
    }

    return {
      ...this.highlightChangedValues(oldText, newText),
      expandable,
    };
  }

  /**
   * Checks whether a table value should be collapsed by default.
   *
   * @param value Plain text value
   * @returns True when the value is long enough to collapse
   */
  private isExpandableHistoryValue(value: string): boolean {
    return (
      value.length > HISTORY_VALUE_COLLAPSE_MIN_LENGTH ||
      value.split(/\r\n|\r|\n/).length > HISTORY_VALUE_COLLAPSE_MIN_LINES
    );
  }

  /**
   * Parses a JSON-encoded history value and converts it to readable plain text,
   * reusing the existing readable history pipe for object and object-array values.
   *
   * @param value JSON-encoded history value
   * @returns Readable plain text value
   */
  private parseHistoryValue(value?: string): string {
    if (!value) {
      return '';
    }

    const parsedValue = JSON.parse(value);

    if (Array.isArray(parsedValue)) {
      if (parsedValue.length > 0 && !isObjectValue(parsedValue[0])) {
        return this.stripHtml(parsedValue.join(', '));
      }
      return this.readableHistoryValueToText(
        this.readableHistoryValue.transform(parsedValue)
      );
    }

    if (isObjectValue(parsedValue)) {
      return this.readableHistoryValueToText(
        this.readableHistoryValue.transform(parsedValue)
      );
    }

    if (parsedValue === null) {
      return 'null';
    }

    return this.stripHtml(String(parsedValue));
  }

  /**
   * Converts the readable history pipe output into display text.
   *
   * @param value Readable history value pipe output
   * @returns Plain text value
   */
  private readableHistoryValueToText(value: unknown): string {
    if (Array.isArray(value)) {
      return value
        .map((item) => this.readableHistoryValueToText(item).trim())
        .filter(Boolean)
        .join('\n');
    }

    if (value === null || value === undefined) {
      return '';
    }

    return this.stripHtml(String(value));
  }

  /**
   * Removes HTML tags from a value while preserving readable line breaks.
   *
   * @param value Value that may contain HTML markup
   * @returns Plain text value
   */
  private stripHtml(value: string): string {
    let strippedValue = value;
    for (let i = 0; i < 3; i += 1) {
      const nextValue = this.stripHtmlTags(
        this.decodeHtmlEntities(strippedValue)
      );
      if (nextValue === strippedValue) {
        return nextValue;
      }
      strippedValue = nextValue;
    }
    return strippedValue;
  }

  /**
   * Decodes HTML entities so escaped tags like &lt;p&gt; can be stripped too.
   *
   * @param value Value that may contain HTML entities
   * @returns Decoded value
   */
  private decodeHtmlEntities(value: string): string {
    const textarea = this.document.createElement('textarea');
    textarea.innerHTML = value;
    return textarea.value;
  }

  /**
   * Removes actual HTML tags from a value while preserving readable line breaks.
   *
   * @param value Value that may contain actual HTML markup
   * @returns Plain text value
   */
  private stripHtmlTags(value: string): string {
    const valueWithBreaks = value
      .replace(/<br\s*\/?\s*>/gi, '\n')
      .replace(/<\/(div|p|li|tr|h[1-6])>/gi, '\n')
      .replace(/<\/(td|th)>/gi, ' ');
    const helperDiv = this.document.createElement('div');
    helperDiv.innerHTML = valueWithBreaks;
    helperDiv.querySelectorAll('script, style').forEach((element) => {
      element.remove();
    });
    return (helperDiv.textContent || '')
      .replace(/\u00a0/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n[ \t]+/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  /**
   * Escapes a value before it is inserted into component-generated HTML.
   *
   * @param value Plain text value
   * @returns HTML-escaped text
   */
  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Highlights the changed segment between two text values.
   *
   * @param oldText Previous value
   * @param newText New value
   * @returns Highlighted HTML for both values
   */
  private highlightChangedValues(
    oldText: string,
    newText: string
  ): HighlightedHistoryValues {
    if (oldText === newText) {
      return {
        oldHtml: this.escapeHtml(oldText),
        newHtml: this.escapeHtml(newText),
      };
    }

    const oldChars = Array.from(oldText);
    const newChars = Array.from(newText);
    let start = 0;
    while (
      start < oldChars.length &&
      start < newChars.length &&
      oldChars[start] === newChars[start]
    ) {
      start += 1;
    }

    let oldEnd = oldChars.length - 1;
    let newEnd = newChars.length - 1;
    while (
      oldEnd >= start &&
      newEnd >= start &&
      oldChars[oldEnd] === newChars[newEnd]
    ) {
      oldEnd -= 1;
      newEnd -= 1;
    }

    return {
      oldHtml: this.renderHighlightedValue(
        oldChars,
        start,
        oldEnd,
        HISTORY_VALUE_REMOVED_CLASS
      ),
      newHtml: this.renderHighlightedValue(
        newChars,
        start,
        newEnd,
        HISTORY_VALUE_ADDED_CLASS
      ),
    };
  }

  /**
   * Renders one value with the changed character range wrapped in a mark.
   *
   * @param chars Value split into characters
   * @param start First changed character index
   * @param end Last changed character index
   * @param changeClass Class indicating whether the segment was added or removed
   * @returns HTML string with highlighted changed text
   */
  private renderHighlightedValue(
    chars: string[],
    start: number,
    end: number,
    changeClass: string
  ): string {
    if (start > end) {
      return this.escapeHtml(chars.join(''));
    }

    const prefix = chars.slice(0, start).join('');
    const changed = chars.slice(start, end + 1).join('');
    const suffix = chars.slice(end + 1).join('');

    return `${this.escapeHtml(
      prefix
    )}<mark class="${HISTORY_VALUE_HIGHLIGHT_CLASS} ${changeClass}">${this.escapeHtml(
      changed
    )}</mark>${this.escapeHtml(suffix)}`;
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
