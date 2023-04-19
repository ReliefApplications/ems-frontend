import { Component, Input } from '@angular/core';
import { PageChangeEvent } from '@progress/kendo-angular-pager';

/**
 * UI Table component
 */
@Component({
  selector: 'ui-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T extends object> {
  @Input() trackByIdentifier: keyof T = 'id' as keyof T;
  /**
   * Update table data and table column keys
   */
  @Input() set data(tableData: T[]) {
    if (tableData) {
      this.tableData = tableData;
      this.tableKeys = Object.keys(this.tableData[0]);
      this.total = this.tableData.length;
      this.setPageData();
    }
  }
  tableData: T[] = [];
  pagedTableData: T[] = [];
  tableKeys: string[] = [];

  pageSize = 3;
  skip = 0;
  total = 0;
  contentId = 'content-1';

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
   * Update page data on page change
   *
   * @param event Page change event
   */
  onPageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageSize = event.take;
    this.setPageData();
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
}
