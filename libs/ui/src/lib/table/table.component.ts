import { Component, Input, OnDestroy } from '@angular/core';
import { PageChangeEvent } from '@progress/kendo-angular-pager';
import { BehaviorSubject, Subject, combineLatest, takeUntil } from 'rxjs';
import { TableSort } from './enums/table-sort-enum';
import { TableColumnDefinition } from './interfaces/table-column.interface';
import { get } from 'lodash';

/**
 * UI Table component
 */
@Component({
  selector: 'ui-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T extends object> implements OnDestroy {
  destroy$ = new Subject<void>();
  get = get;
  @Input() displayAsCard = false;
  @Input() trackByIdentifier: keyof T = 'id' as keyof T;
  /**
   * Set and update table data and column definition data
   */
  @Input() set tableDefinition(data: {
    tableData: T[];
    columnDefinitionData: TableColumnDefinition[];
  }) {
    if (data.columnDefinitionData) {
      this.columnDefinitionData = data.columnDefinitionData;
      this.columnDefinitionArray = this.columnDefinitionData.map(
        (colDef) => colDef.title
      );
    }
    if (data.tableData) {
      this.tableData = data.tableData;
      this.initializeTable();
    }
  }

  // Table data display
  tableData: T[] = [];
  pagedTableData: T[] = [];
  columnDefinitionData: TableColumnDefinition[] = [];
  columnDefinitionArray: string[] = [];

  // Paginator properties
  pageSize = 5;
  skip = 0;
  totalItems = 0;
  contentId = 'content-1';
  pageSizeValues = [5, 10, 15] as const;

  // Sort properties
  sortKey$ = new BehaviorSubject<{ title: string; dataAccessor: string }>({
    title: '',
    dataAccessor: '',
  });
  sortDirection$ = new BehaviorSubject<TableSort>(TableSort.DEFAULT);
  tableSort = TableSort;

  /**
   * Initialize all properties needed to render table
   */
  private initializeTable() {
    this.totalItems = this.tableData.length;
    this.setPageData();
    this.setSortListeners();
  }

  /**
   * Set table sort event listener
   */
  private setSortListeners() {
    combineLatest([
      this.sortKey$.asObservable(),
      this.sortDirection$.asObservable(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([column, sortDirection]) => {
          // Default value is the paginated one
          let sortedItems = this.tableData.slice(
            this.skip,
            this.skip + this.pageSize
          );
          if (sortDirection !== TableSort.DEFAULT) {
            sortedItems = this.pagedTableData.sort((row1, row2) => {
              let compareValue = 0;
              const row1Value = get(row1, column.dataAccessor);
              const row2Value = get(row2, column.dataAccessor);

              if (typeof row1Value === 'string') {
                compareValue = (row1Value as string).localeCompare(
                  row2Value as string
                );
              } else {
                compareValue = Number(row1Value > row2Value);
              }
              if (sortDirection === TableSort.ASC) {
                return compareValue;
              } else if (sortDirection === TableSort.DESC) {
                return compareValue === 1 ? -1 : 1;
              }
              return compareValue;
            });
          }
          // Spread operator used to trigger table change detection and re-render
          this.pagedTableData = [...sortedItems];
        },
      });
  }

  /**
   * Set table data content per page
   */
  private setPageData(): void {
    this.pagedTableData = this.tableData.slice(
      this.skip,
      this.skip + this.pageSize
    );
  }

  /**
   * Sort table row by given key, the sort order is
   * 1. ASC
   * 2. DESC
   * 3. DEFAULT
   *
   * @param column Column key from the table
   * @param sortOnPageChange sortOnPageChange event trigger
   */
  sortTableByKey(
    column: TableColumnDefinition,
    sortOnPageChange: boolean = false
  ): void {
    if (!column.sortable) {
      return;
    }
    // If a page change is done, we sort the new list with the current sorting value
    if (sortOnPageChange) {
      this.sortDirection$.next(this.sortDirection$.value);
      return;
    }
    if (this.sortKey$.value.title === column.title) {
      if (this.sortDirection$.value === TableSort.ASC) {
        this.sortDirection$.next(TableSort.DESC);
      } else if (this.sortDirection$.value === TableSort.DESC) {
        this.sortDirection$.next(TableSort.DEFAULT);
      } else {
        this.sortDirection$.next(TableSort.ASC);
      }
    } else {
      this.sortKey$.next({
        title: column.title,
        dataAccessor: column.dataAccessor,
      });
      this.sortDirection$.next(TableSort.ASC);
    }
  }

  /**
   * Update page data on page change
   *
   * @param event Page change event
   */
  onPageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageSize = event.take;
    this.setPageData();
    if (this.sortKey$.value.title) {
      this.sortTableByKey(
        { title: this.sortKey$.value.title } as TableColumnDefinition,
        true
      );
    }
  }

  /**
   * Function to re render only the rows of the table that have changed
   *
   * @param rowData Data from each of the table rows that would return an exclusive identifier
   * @returns Unique identifier
   */
  trackByName(rowData: T): any {
    return rowData[this.trackByIdentifier];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
