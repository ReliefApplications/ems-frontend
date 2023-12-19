import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  Aggregation,
  DateModule,
  EmptyModule,
  Layout,
  SkeletonTableModule,
} from '@oort-front/shared';
import {
  ButtonModule,
  DividerModule,
  IconModule,
  MenuModule,
  TableModule,
  TooltipModule,
} from '@oort-front/ui';

/**
 * Data presentation list component to display resource layout and aggregation tables
 */
@Component({
  selector: 'app-data-presentation-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    IconModule,
    DividerModule,
    TableModule,
    EmptyModule,
    MenuModule,
    SkeletonTableModule,
    TranslateModule,
    TooltipModule,
    DateModule,
  ],
  templateUrl: './data-presentation-list.component.html',
  styleUrls: ['./data-presentation-list.component.scss'],
})
export class DataPresentationListComponent {
  /**
   * Message for the add new item button
   */
  @Input() addNewItemButtonMessage = '';
  /**
   * Message for the empty data list
   */
  @Input() emptyDataListMessage = '';
  /**
   * Loading state
   */
  @Input() loading = true;
  /**
   * Can update state
   */
  @Input() canUpdate = false;
  /**
   * Aggregation or layout data source
   */
  @Input() dataSource: Array<Aggregation | Layout> = [];
  /**
   * Columns to display
   */
  @Input() displayedColumns: string[] = [];

  /**
   * Event emitter for the item action
   */
  @Output() itemAction: EventEmitter<{
    type: 'add' | 'edit' | 'delete';
    item: Aggregation | Layout | null | undefined;
  }> = new EventEmitter<{
    type: 'add' | 'edit' | 'delete';
    item: Aggregation | Layout | null | undefined;
  }>();

  /** @returns True if the dataSource tab is empty */
  get empty(): boolean {
    return !this.loading && this.dataSource.length === 0;
  }

  /**
   * Trigger action for the current items
   *
   * @param type type of action, add, edit, delete
   * @param item aggregation item for the given action type
   */
  triggerAction(
    type: 'add' | 'edit' | 'delete',
    item?: Aggregation | Layout | null | undefined
  ) {
    this.itemAction.emit({ type, item });
  }
}
