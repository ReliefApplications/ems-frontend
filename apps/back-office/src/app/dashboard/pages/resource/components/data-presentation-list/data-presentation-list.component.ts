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
  @Input() addNewItemButtonMessage = '';
  @Input() emptyDataListMessage = '';
  @Input() loading = true;
  @Input() canUpdate = false;
  @Input() dataSource: Array<Aggregation | Layout> = [];
  @Input() displayedColumns: string[] = [];

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
