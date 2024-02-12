import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { PageChangeEvent } from '@progress/kendo-angular-pager';
import { v4 as uuidv4 } from 'uuid';
import { UIPageChangeEvent } from './interfaces/paginator.interfaces';
import { min } from 'lodash';

/**
 * UI Paginator component
 * Paginator is a UI component that allows the user to navigate through pages of content.
 */
@Component({
  selector: 'ui-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnChanges, AfterViewInit, OnDestroy {
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
  /** Maximum number of pages to show */
  @Input() displayedPageNumbers = 0;
  /** Page change event */
  @Output() pageChange: EventEmitter<UIPageChangeEvent> = new EventEmitter();
  /** Generate random unique identifier for each paginator component */
  public paginatorId = uuidv4();
  /** Number of buttons to display */
  public buttonCount!: number;
  /** Observer resize changes */
  private resizeObserver!: ResizeObserver;

  /**
   * UI Paginator component
   * Paginator is a UI component that allows the user to navigate through pages of content.
   *
   * @param renderer Angular renderer
   * @param el Element reference
   */
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit() {
    this.updateDisplay();
    this.resizeObserver = new ResizeObserver(() => {
      this.updateDisplay();
    });
    this.resizeObserver.observe(this.el.nativeElement.parentElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageIndex']) {
      this.skip = changes['pageIndex'].currentValue * this.pageSize;
    }
    this.updateDisplay();
  }

  ngOnDestroy() {
    this.resizeObserver.disconnect();
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

  /**
   * Update display of the paginator, based on available width.
   */
  private updateDisplay() {
    const showNumbers = (show = true) => {
      const pagerNumericButtons = this.el.nativeElement.querySelector(
        'kendo-datapager-numeric-buttons'
      );
      if (pagerNumericButtons) {
        const numbers = pagerNumericButtons.querySelector('.k-pager-numbers');
        if (show) {
          this.renderer.addClass(numbers, '!flex');
          this.renderer.removeClass(numbers, '!hidden');
        } else {
          this.renderer.addClass(numbers, '!hidden');
          this.renderer.removeClass(numbers, '!flex');
        }
      }
    };
    const showSelect = (show = true) => {
      const pagerNumericButtons = this.el.nativeElement.querySelector(
        'kendo-datapager-numeric-buttons'
      );
      if (pagerNumericButtons) {
        const select = pagerNumericButtons.querySelector('select');
        if (show) {
          this.renderer.addClass(select, '!flex');
          this.renderer.removeClass(select, '!hidden');
        } else {
          this.renderer.addClass(select, '!hidden');
          this.renderer.removeClass(select, '!flex');
        }
      }
    };
    const showPageSizes = (show = true) => {
      const pageSizes = this.el.nativeElement.querySelector(
        'kendo-datapager-page-sizes'
      );
      if (pageSizes) {
        if (show) {
          this.renderer.addClass(pageSizes, '!flex');
          this.renderer.removeClass(pageSizes, '!hidden');
        } else {
          this.renderer.addClass(pageSizes, '!hidden');
          this.renderer.removeClass(pageSizes, '!flex');
        }
      }
    };
    const width = this.el.nativeElement.parentElement.clientWidth;
    if (width >= 600) {
      this.buttonCount = min([this.displayedPageNumbers, 5]) || 0;
      showNumbers();
      showPageSizes();
      showSelect(false);
    } else if (width >= 450) {
      this.buttonCount = min([this.displayedPageNumbers, 2]) || 0;
      showNumbers();
      showPageSizes();
      showSelect(false);
    } else if (width >= 300) {
      this.buttonCount = min([this.displayedPageNumbers, 3]) || 0;
      showNumbers();
      showPageSizes(false);
      showSelect(false);
    } else {
      this.buttonCount = this.displayedPageNumbers;
      showNumbers(false);
      showPageSizes(false);
      showSelect();
    }
  }
}
