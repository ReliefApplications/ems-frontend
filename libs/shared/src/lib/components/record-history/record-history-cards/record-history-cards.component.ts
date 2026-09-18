import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule, ExpansionPanelModule } from '@oort-front/ui';
import { Version } from '../../../models/form.model';
import { Change, RecordHistory } from '../../../models/records-history.model';
import { DateModule } from '../../../pipes/date/date.module';
import { RecordHistoryValueService } from '../record-history-value.service';

/** History change as displayed, with its precomputed HTML content */
type DisplayChange = Change & { html?: string };

/** History entries as displayed, with precomputed HTML content for each change */
type DisplayHistory = (Omit<RecordHistory[number], 'changes'> & {
  changes: DisplayChange[];
})[];

/**
 * Displays record history entries as cards, one expansion panel per version.
 */
@Component({
  standalone: true,
  selector: 'shared-record-history-cards',
  templateUrl: './record-history-cards.component.html',
  styleUrls: [
    '../record-history-values.scss',
    '../record-history-panels.scss',
    './record-history-cards.component.scss',
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ExpansionPanelModule,
    ButtonModule,
    DateModule,
  ],
})
export class RecordHistoryCardsComponent implements OnChanges {
  /** History entries to display */
  @Input() history: RecordHistory = [];
  /** Emits the version to preview and revert to */
  @Output() revert = new EventEmitter<Version>();

  /** History entries with the precomputed HTML content of their changes */
  public items: DisplayHistory = [];
  /** Show more state */
  public showMore = false;

  /**
   * Displays record history entries as cards, one expansion panel per version.
   *
   * @param translate Angular translation service
   * @param historyValue Record history value rendering service
   */
  constructor(
    private translate: TranslateService,
    private historyValue: RecordHistoryValueService
  ) {}

  ngOnChanges(): void {
    // Precompute the HTML content of each change, so it is not rebuilt on
    // every change detection cycle
    this.items = (this.history ?? []).map((item) => ({
      ...item,
      changes: item.changes.map((change) => ({
        ...change,
        html: this.getHTMLFromChange(change),
      })),
    }));
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
   * Gets the HTML element from a change object
   *
   * @param change The field change object
   * @returns the innerHTML for the listing
   */
  getHTMLFromChange(change: Change) {
    try {
      const values = this.historyValue.getRenderedHistoryValues(change);
      const displayName = this.historyValue.escapeHtml(change.displayName);
      const chip = this.historyValue.getChipFromChange(change);
      const changedValue =
        change.type === 'add' ? values.newHtml : values.oldHtml;

      switch (change.type) {
        case 'remove':
        case 'add':
          return `
            <p class="history-change">
              ${chip}
              <b> ${displayName} </b>
              ${this.historyValue.escapeHtml(
                this.translate.instant('components.history.changes.withValue')
              )}
              <b class="history-value"> ${changedValue}</b>
            </p>
          `;
        case 'modify':
          return `
            <p class="history-change">
              ${chip}
              <b> ${displayName} </b>
              ${this.historyValue.escapeHtml(
                this.translate.instant('components.history.changes.from')
              )}
              <b class="history-value"> ${values.oldHtml}</b>
              ${this.historyValue.escapeHtml(
                this.translate.instant('components.history.changes.to')
              )}
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
}
