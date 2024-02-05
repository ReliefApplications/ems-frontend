import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { PageChangeEvent } from '@progress/kendo-angular-pager';
import { v4 as uuidv4 } from 'uuid';
import { UIPageChangeEvent } from './interfaces/paginator.interfaces';

/**
 * UI Paginator component
 * Paginator is a UI component that allows the user to navigate through pages of content.
 */
@Component({
  selector: 'ui-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnChanges {
  /** Disable pagination */
  @Input() disabled = false;
  /** Number of items */
  @Input() totalItems = 0;
  /** Show total items */
  @Input() showTotalItems = true;
  /** Current page size */
  @Input() pageSize = 10;
  /** Available page size */
  @Input() pageSizeOptions = [5, 10, 15];
  /** If should allow user to change page size */
  @Input() showPageSizes = true;
  /** Allow buttons to go to first & last pages */
  @Input() hideFirstLastButtons = true;
  /** Aria label */
  @Input() ariaLabel = '';
  /** Items to skip */
  @Input() skip = 0;
  /** Current page index */
  @Input() pageIndex = 0;
  /** Number of pages to show */
  @Input() displayedPageNumbers = 0;
  /** Page change event */
  @Output() pageChange: EventEmitter<UIPageChangeEvent> = new EventEmitter();
  /** Generate random unique identifier for each paginator component */
  public paginatorId = uuidv4();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageIndex']) {
      this.skip = changes['pageIndex'].currentValue * this.pageSize;
    }
  }

  /**
   * Update page data on page change
   *
   * @param event Page change event
   */
  onPageChange(event: PageChangeEvent): void {
    // Current page has to be calculated, logic provided from their forums: https://www.telerik.com/forums/get-current-page
    const currentPage = (event.skip + event.take) / event.take - 1;
    this.pageSize = event.take;
    this.skip = event.skip;
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
