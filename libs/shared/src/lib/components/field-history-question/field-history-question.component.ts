import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule, SpinnerModule } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { of, Subject } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import {
  RecordHistory,
  RecordHistoryResponse,
} from '../../models/records-history.model';
import { GET_RECORD_HISTORY_BY_ID } from '../record-history/graphql/queries';
import { HISTORY_PAGE_SIZE } from '../record-history/record-history.component';
import { RecordHistoryTableComponent } from '../record-history/record-history-table/record-history-table.component';
import { EmptyModule } from '../ui/empty/empty.module';

/** History content rendered inside a collapsible SurveyJS Field history question. */
@Component({
  standalone: true,
  selector: 'shared-field-history-question',
  templateUrl: './field-history-question.component.html',
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    SpinnerModule,
    EmptyModule,
    RecordHistoryTableComponent,
  ],
})
export class FieldHistoryQuestionComponent implements OnInit, OnDestroy {
  /** Existing record identifier. */
  @Input() recordId?: string;
  /** Resource field whose history is displayed. */
  @Input() field?: string;
  /** Whether history is unavailable in the current survey mode. */
  @Input() neutral = false;
  /** Stream used to invalidate loaded history after a record save. */
  @Input() refresh$?: Subject<string | undefined>;

  /** Table columns, the variable is always the selected field */
  public readonly displayedColumns = [
    'date',
    'time',
    'person',
    'action',
    'originalValue',
    'modifiedValue',
  ];
  /** Whether the panel is currently expanded. */
  public expanded = false;
  /** Whether history has been requested during the current cache cycle. */
  public historyLoaded = false;
  /** History of the selected field */
  public history: RecordHistory = [];
  /** Loading state */
  public loading = false;
  /** Loading state for the "load more" pagination action */
  public loadingMore = false;
  /** Whether the latest history request failed. */
  public loadError = false;
  /** Whether more history entries can be loaded */
  public hasMoreHistory = false;
  /** Last history page loaded successfully. */
  private currentPage = 0;
  /** Emits history page load requests; 'reload' restarts from the first page */
  private page$ = new Subject<'reload' | 'next'>();
  /** Emits when the component is destroyed */
  private destroy$ = new Subject<void>();

  /**
   * History content rendered inside a collapsible SurveyJS Field history question.
   *
   * @param apollo Apollo client
   * @param translate Angular translation service
   */
  constructor(private apollo: Apollo, private translate: TranslateService) {}

  ngOnInit(): void {
    // Load history pages through a single stream: switchMap cancels any
    // in-flight request whenever a new page load is triggered
    this.page$
      .pipe(
        switchMap((action) => {
          const page = action === 'reload' ? 1 : this.currentPage + 1;
          return this.queryHistoryPage(page).pipe(
            map(({ errors, data }) => ({
              page,
              recordHistory: errors ? undefined : data.recordHistory,
            })),
            // A failed request must not break the surrounding form
            catchError(() => of({ page, recordHistory: undefined }))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(({ page, recordHistory }) => {
        this.loading = false;
        this.loadingMore = false;
        if (!recordHistory) {
          // Keep already loaded entries when only the next page failed
          this.loadError = page === 1;
          return;
        }
        this.currentPage = page;
        this.appendHistoryPage(recordHistory);
      });

    this.refresh$?.pipe(takeUntil(this.destroy$)).subscribe((recordId) => {
      this.recordId = recordId || this.recordId;
      this.neutral = !this.recordId;
      this.historyLoaded = false;
      this.loadHistoryIfNeeded();
    });
  }

  /**
   * Updates the selected field and clears history loaded for the prior field.
   *
   * @param field Selected field, or undefined when it no longer exists
   */
  setField(field: string | undefined): void {
    this.field = field;
    this.historyLoaded = false;
    this.loadHistoryIfNeeded();
  }

  /** Starts the first eligible history request when the panel opens. */
  onExpanded(): void {
    this.expanded = true;
    this.loadHistoryIfNeeded();
  }

  /** Tracks when the panel is collapsed. */
  onCollapsed(): void {
    this.expanded = false;
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
   * Loads the history from the first page, only once per cache cycle and only
   * while the panel is visible, so collapsed questions do not query the API.
   */
  private loadHistoryIfNeeded(): void {
    if (
      this.historyLoaded ||
      !this.expanded ||
      this.neutral ||
      !this.recordId ||
      !this.field
    ) {
      return;
    }
    this.historyLoaded = true;
    this.loading = true;
    this.loadError = false;
    // A reload cancels any in-flight "load more" request
    this.loadingMore = false;
    this.history = [];
    this.hasMoreHistory = false;
    this.currentPage = 0;
    this.page$.next('reload');
  }

  /**
   * Queries a single page of the field's history.
   *
   * @param page Page to fetch, 1-indexed
   * @returns Observable of the GraphQL response for that page
   */
  private queryHistoryPage(page: number) {
    return this.apollo.query<RecordHistoryResponse>({
      query: GET_RECORD_HISTORY_BY_ID,
      variables: {
        id: this.recordId,
        lang: this.translate.currentLang,
        first: HISTORY_PAGE_SIZE,
        skip: (page - 1) * HISTORY_PAGE_SIZE,
        fields: [this.field],
      },
      // The history changes each time the form is saved
      fetchPolicy: 'no-cache',
    });
  }

  /**
   * Appends a freshly fetched page of history entries to the current history,
   * keeping only the changes of the selected field.
   *
   * @param recordHistory Page of history entries returned by the API
   */
  private appendHistoryPage(recordHistory: RecordHistory): void {
    const entries = recordHistory
      .map((item) => ({
        ...item,
        changes: item.changes.filter((change) => change.field === this.field),
      }))
      .filter((item) => item.changes.length);
    this.history = this.history.concat(entries);
    this.hasMoreHistory = recordHistory.length === HISTORY_PAGE_SIZE;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
