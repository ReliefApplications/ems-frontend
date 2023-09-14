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
  Input,
  OnChanges,
  SimpleChanges,
  ViewContainerRef,
  createComponent,
  EnvironmentInjector,
} from '@angular/core';
import { TableSort } from './interfaces/table-column.interface';
import { TableHeaderSortDirective } from './table-header-sort.directive';
import { Observable, Subject, filter, merge, startWith, takeUntil } from 'rxjs';
import { SkeletonTableComponent } from './skeleton-table/skeleton-table.component';

/**
 * UI Table wrapper directive
 */
@Directive({
  selector: '[uiTableWrapper]',
})
export class TableWrapperDirective
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @Output() sortChange = new EventEmitter<TableSort>();

  @Input() loading = false;
  /** Skeleton table */
  @Input() columns: string[] = []; // Array of string with the translation keys
  @Input() rows = 10; // Numbers of rows for the table
  @Input() actions = false; // Indicates if action buttons should be rendered
  @Input() checkbox = false; // Indicates if checkboxes should be rendered

  @ContentChildren(TableHeaderSortDirective, { descendants: true })
  private sortableColumns!: QueryList<TableHeaderSortDirective>;

  private tableWrapperClasses = [
    'overflow-x-auto',
    'shadow',
    'border',
    'pt-2',
    'sm:rounded-lg',
    'bg-gray-50',
  ];
  private tableClasses = ['min-w-full', 'divide-y', 'divide-gray-300'];
  private tbodyClasses = ['divide-y', 'divide-gray-200', 'bg-white'];

  private tableWrapperElement!: HTMLDivElement;
  private destroy$ = new Subject<void>();
  /**
   * UI Table wrapper directive constructor
   *
   * @param el Directive host element
   * @param renderer Renderer2
   * @param viewContainerRef ViewContainerRef
   * @param injector Environment Injector
   */
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private injector: EnvironmentInjector
  ) {}

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loading']) {
      //create skeleton component
      const skeleton = createComponent(SkeletonTableComponent, {
        environmentInjector: this.injector,
      });
      skeleton.instance.checkbox = this.checkbox;
      skeleton.instance.columns = this.columns;
      skeleton.instance.rows = this.rows;
      skeleton.instance.actions = this.actions;

      if (this.loading === true) {
        //remove table classes
        this.tableWrapperClasses.forEach((twClass) => {
          if (this.tableWrapperElement?.classList?.contains(twClass)) {
            this.renderer.removeClass(this.tableWrapperElement, twClass);
          }
        });
        //set table hidden
        this.renderer.addClass(this.el.nativeElement, 'hidden');
        //append skeleton component
        this.viewContainerRef.insert(skeleton.hostView);
      } else {
        //remove skeleton component
        this.viewContainerRef.clear();
        //remove hidden style from table
        this.renderer.removeClass(this.el.nativeElement, 'hidden');
        //add default table classes
        this.tableWrapperClasses.forEach((twClass) => {
          this.renderer.addClass(this.tableWrapperElement, twClass);
        });
      }
    }
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
