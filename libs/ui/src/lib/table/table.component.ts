import { Component, Input, OnDestroy } from '@angular/core';
import { PageChangeEvent } from '@progress/kendo-angular-pager';
import { BehaviorSubject, Subject, combineLatest, takeUntil } from 'rxjs';
import { TableSort } from './enums/table-sort-enum';

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
  @Input() trackByIdentifier: keyof T = 'id' as keyof T;
  /**
   * Update table data and table column keys
   */
  @Input() set data(tableData: T[]) {
    if (tableData) {
      this.initializeTable(tableData);
    }
  }
  // Table data display
  tableData: T[] = [];
  pagedTableData: T[] = [];
  tableKeys: string[] = [];

  // Paginator properties
  pageSize = 3;
  skip = 0;
  totalItems = 0;
  contentId = 'content-1';

  // Sort properties
  sortKey$ = new BehaviorSubject<keyof T>('id' as keyof T);
  sortDirection$ = new BehaviorSubject<TableSort>(TableSort.ASC);
  tableSort = TableSort;

  /**
   * Initialize all properties needed to render table
   *
   * @param tableData T
   */
  private initializeTable(tableData: T[]) {
    this.tableData = tableData;
    this.tableKeys = Object.keys(this.tableData[0]);
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
        next: ([tableKey, sortDirection]) => {
          // Default value is the paginated one
          let sortedItems = this.tableData.slice(
            this.skip,
            this.skip + this.pageSize
          );
          if (sortDirection !== TableSort.DEFAULT) {
            sortedItems = this.pagedTableData.sort((row1, row2) => {
              let compareValue = 0;
              if (typeof row1[tableKey] === 'string') {
                compareValue = (row1[tableKey] as string).localeCompare(
                  row2[tableKey] as string
                );
              } else {
                compareValue = Number(row1[tableKey] > row2[tableKey]);
              }
              if (sortDirection === TableSort.ASC) {
                return compareValue;
              } else if (sortDirection === TableSort.DESC) {
                return compareValue === 1 ? -1 : compareValue;
              }
              return compareValue;
            });
          }
          // Spread operator used to trigger table change detection and re render
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
   * @param key Column key from the table
   */
  sortTableByKey(key: keyof T): void {
    if (this.sortKey$.value === key) {
      if (this.sortDirection$.value === TableSort.ASC) {
        this.sortDirection$.next(TableSort.DESC);
      } else if (this.sortDirection$.value === TableSort.DESC) {
        this.sortDirection$.next(TableSort.DEFAULT);
      } else {
        this.sortDirection$.next(TableSort.ASC);
      }
    } else {
      this.sortKey$.next(key);
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
    if (this.sortKey$.value) {
      this.sortTableByKey(this.sortKey$.value);
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
