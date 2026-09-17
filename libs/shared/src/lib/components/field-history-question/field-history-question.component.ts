import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

/** History content rendered inside a collapsible SurveyJS Field history question. */
@Component({
  selector: 'shared-field-history-question',
  templateUrl: './field-history-question.component.html',
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

  /** Whether the panel is currently expanded. */
  public expanded = false;
  /** Whether history has been requested during the current cache cycle. */
  public historyLoaded = false;
  /** Triggers a fresh request in an already-rendered history component. */
  public readonly historyRefresh$ = new Subject<boolean>();
  /** Refresh subscription. */
  private refreshSubscription?: Subscription;

  ngOnInit(): void {
    this.refreshSubscription = this.refresh$?.subscribe((recordId) => {
      this.recordId = recordId || this.recordId;
      this.neutral = !this.recordId;
      if (this.expanded && !this.neutral && this.field) {
        if (this.historyLoaded) {
          this.historyRefresh$.next(true);
        } else {
          this.historyLoaded = true;
        }
      } else {
        this.historyLoaded = false;
      }
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
    if (this.expanded && !this.neutral && this.recordId && this.field) {
      this.historyLoaded = true;
    }
  }

  /** Starts the first eligible history request when the panel opens. */
  onExpanded(): void {
    this.expanded = true;
    if (!this.historyLoaded && !this.neutral && this.recordId && this.field) {
      this.historyLoaded = true;
    }
  }

  /** Tracks when the panel is collapsed. */
  onCollapsed(): void {
    this.expanded = false;
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
    this.historyRefresh$.complete();
  }
}
