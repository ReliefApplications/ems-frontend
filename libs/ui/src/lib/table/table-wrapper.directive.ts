import {
  AfterContentInit,
  AfterViewInit,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
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
export class TableWrapperDirective
  implements AfterContentInit, AfterViewInit, OnDestroy
{
  @Output() sortChange = new EventEmitter<TableSort>();

  @ContentChildren(TableHeaderSortDirective, { descendants: true })
  private sortableColumns!: QueryList<TableHeaderSortDirective>;

  private tableWrapperClasses = [
    'overflow-hidden',
    'shadow',
    'border',
    'py-2',
    'sm:rounded-lg',
  ];
  private tableClasses = ['min-w-full', 'divide-y', 'divide-gray-300'] as const;
  private tableHeaderClasses = [
    'capitalize',
    'py-3.5',
    'pl-4',
    'pr-3',
    'text-left',
    'text-sm',
    'font-medium',
    'text-gray-900',
  ] as const;
  private tableBodyClasses = [
    'divide-y',
    'divide-gray-200',
    'bg-white',
  ] as const;
  private tableRowClasses = [
    'whitespace-nowrap',
    'py-4',
    'pl-4',
    'pr-3',
    'text-sm',
    'font-normal',
    'text-gray-900',
  ] as const;

  private destroy$ = new Subject<void>();
  /**
   * UI Table wrapper directive constructor
   *
   * @param el Directive host element
   * @param renderer Renderer2
   */
  constructor(private el: ElementRef, private renderer: Renderer2) {
    if (!(this.el.nativeElement instanceof HTMLTableElement)) {
      throw new Error('Directive could only be applied to an HTMLTableElement');
    }
    // Render default classes for the host table
    this.tableClasses.forEach((tClass) => {
      this.renderer.addClass(this.el.nativeElement, tClass);
    });
    // Wrap up the table to match tailwind styling
    const tableWrapperElement = this.renderer.createElement('div');
    this.tableWrapperClasses.forEach((twClass) => {
      this.renderer.addClass(tableWrapperElement, twClass);
    });
    // Append new wrapped up table
    this.renderer.appendChild(
      this.el.nativeElement.parentElement,
      tableWrapperElement
    );
    this.renderer.appendChild(tableWrapperElement, this.el.nativeElement);
  }

  ngAfterContentInit(): void {
    // Get table related elements
    const tableHeaders = this.el.nativeElement.querySelectorAll('th');
    const tableData = this.el.nativeElement.querySelectorAll('td');
    const tableBody = this.el.nativeElement.querySelector('tbody');

    // Apply default classes to the table related elements
    this.tableBodyClasses.forEach((tbClass) => {
      this.renderer.addClass(tableBody, tbClass);
    });
    tableHeaders.forEach((th: any) => {
      this.tableHeaderClasses.forEach((hClass) => {
        this.renderer.addClass(th, hClass);
      });
    });
    tableData.forEach((tr: any) => {
      this.tableRowClasses.forEach((rClass) => {
        this.renderer.addClass(tr, rClass);
      });
    });
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
  }
}
