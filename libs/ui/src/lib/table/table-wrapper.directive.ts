import {
  AfterViewInit,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
} from '@angular/core';
import { TableSort } from './interfaces/table-column.interface';
import { TableHeaderSortDirective } from './table-header-sort.directive';
import { Observable, Subject, filter, merge, startWith, takeUntil } from 'rxjs';

/**
 * UI Table wrapper directive
 */
@Directive({
  selector: '[uiTableWrapper]',
})
export class TableWrapperDirective implements OnInit, AfterViewInit, OnDestroy {
  @Output() sortChange = new EventEmitter<TableSort>();

  @ContentChildren(TableHeaderSortDirective, { descendants: true })
  private sortableColumns!: QueryList<TableHeaderSortDirective>;

  private tableWrapperClasses = [
    'overflow-x-auto',
    'shadow',
    'border',
    'pt-2',
    'sm:rounded-lg',
    'bg-gray-100',
  ];
  private tableClasses = ['min-w-full', 'divide-y', 'divide-gray-300'];
  private tbodyClasses = [
    'divide-y',
    'divide-gray-200',
    'bg-white',
    'even:[&>tr]:bg-gray-50',
    'odd:[&>tr]:bg-white',
  ];

  private tableWrapperElement!: HTMLDivElement;
  private destroy$ = new Subject<void>();

  /**
   * UI Table wrapper directive constructor
   *
   * @param el Directive host element
   * @param renderer Renderer2
   */
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (!(this.el.nativeElement instanceof HTMLTableElement)) {
      throw new Error('Directive could only be applied to an HTMLTableElement');
    }
    for (const cl of this.tableClasses) {
      this.renderer.addClass(this.el.nativeElement, cl);
    }
    const body = this.el.nativeElement.querySelector('tbody');
    for (const cl of this.tbodyClasses) {
      this.renderer.addClass(body, cl);
    }
    // Render default classes for the host table parent
    this.tableWrapperElement = this.renderer.createElement('div');
    this.tableWrapperClasses.forEach((twClass) => {
      this.renderer.addClass(this.tableWrapperElement, twClass);
    });
    // Append new wrapped up table
    this.renderer.appendChild(
      this.el.nativeElement.parentElement,
      this.tableWrapperElement
    );
    this.renderer.appendChild(this.tableWrapperElement, this.el.nativeElement);
  }

  ngAfterViewInit(): void {
    // Initialize sortable column listeners
    this.sortableColumns.changes
      .pipe(startWith(this.sortableColumns), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.sortableColumns.length) {
            this.initializeSortListeners();
          }
        },
      });
  }

  /**
   * Initialize all the table sort header event listeners
   */
  private initializeSortListeners() {
    const sortListeners: Observable<any>[] = [];
    this.sortableColumns.forEach((sColumn) => {
      sortListeners.push(
        sColumn.activeSort.asObservable().pipe(filter((sortData) => !!sortData))
      );
    });
    merge(...sortListeners)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sortData: TableSort) => {
          // Reset all the other sortable properties
          this.sortableColumns.forEach((sColumn) => {
            if (sColumn.uiTableHeaderSort !== sortData.active) {
              sColumn.sortIndicatorElement.textContent = '';
            }
          });
          // Emit current sort data
          this.sortChange.emit(sortData);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.tableWrapperElement) {
      this.tableWrapperElement.remove();
    }
  }
}
