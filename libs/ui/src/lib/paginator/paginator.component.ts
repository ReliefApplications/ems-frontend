import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageChangeEvent } from '@progress/kendo-angular-pager';
import { v4 as uuidv4 } from 'uuid';
import { UIPageChangeEvent } from './interfaces/paginator.interfaces';
/**
 * UI Paginator component
 */
@Component({
  selector: 'ui-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent {
  @Input() disabled = false;
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 15];
  @Input() hideFirstLastButtons = true;
  @Input() ariaLabel = '';
  @Input() pageIndex = 0;
  @Input() displayedPageNumbers = 0;
  @Output() pageChange: EventEmitter<UIPageChangeEvent> = new EventEmitter();

  // Generate random unique identifier for each paginator component
  paginatorId = uuidv4();

  /**
   * Update page data on page change
   *
   * @param event Page change event
   */
  onPageChange(event: PageChangeEvent): void {
    // Current page has to be calculated, logic provided from their forums: https://www.telerik.com/forums/get-current-page
    const currentPage = (event.skip + event.take) / event.take - 1;
    this.pageSize = event.take;
    this.pageChange.emit({
      pageSize: this.pageSize,
      skip: event.skip,
      totalItems: this.totalItems,
      pageIndex: currentPage,
      previousPageIndex: this.pageIndex,
    });
    this.pageIndex = currentPage;
  }
}
