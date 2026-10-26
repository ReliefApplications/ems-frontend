import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, TableModule, TooltipModule } from '@oort-front/ui';
import { Change, RecordHistory } from '../../../models/records-history.model';
import { DateModule } from '../../../pipes/date/date.module';
import { RecordHistoryValueService } from '../record-history-value.service';

/** Record history table row with pre-rendered safe HTML values */
export interface HistoryTableRow {
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

/** All columns available in the record history table, in display order */
export const RECORD_HISTORY_TABLE_COLUMNS = [
  'variable',
  'date',
  'time',
  'person',
  'action',
  'originalValue',
  'modifiedValue',
];

/**
 * Displays record history entries as a table, one row per change.
 */
@Component({
  standalone: true,
  selector: 'shared-record-history-table',
  templateUrl: './record-history-table.component.html',
  styleUrls: [
    '../record-history-values.scss',
    './record-history-table.component.scss',
  ],
  imports: [
    CommonModule,
    TranslateModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    DateModule,
  ],
})
export class RecordHistoryTableComponent implements OnChanges {
  /** History entries to display */
  @Input() history: RecordHistory = [];
  /** Displayed columns */
  @Input() displayedColumns: string[] = RECORD_HISTORY_TABLE_COLUMNS;

  /** Data source of the table */
  public rows: HistoryTableRow[] = [];

  /**
   * Displays record history entries as a table, one row per change.
   *
   * @param historyValue Record history value rendering service
   */
  constructor(private historyValue: RecordHistoryValueService) {}

  ngOnChanges(): void {
    // Precompute the rows, so they are not rebuilt on every change detection
    // cycle
    this.rows = [];
    for (const item of this.history ?? []) {
      for (const change of item.changes) {
        this.setHistoryForTableFromChange(change, item);
      }
    }
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
   * Push correct values to the table rows
   *
   * @param change Change to push
   * @param historyElement History element (used for createdAt and createdBy)
   */
  setHistoryForTableFromChange(
    change: Change,
    historyElement: HistoryTableContext
  ) {
    try {
      const values = this.historyValue.getRenderedHistoryValues(change);
      this.rows.push({
        displayName: change.displayName,
        newHtml: values.newHtml,
        oldHtml: values.oldHtml,
        expandable: values.expandable,
        type: change.type,
        chip: this.historyValue.getChipFromChange(change),
        createdAt: historyElement.createdAt,
        createdBy: historyElement.createdBy,
      });
    } catch {
      this.rows.push({
        displayName: change.displayName,
        renderError: true,
        type: change.type,
        chip: this.historyValue.getChipFromChange(change),
        createdAt: historyElement.createdAt,
        createdBy: historyElement.createdBy,
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
}
