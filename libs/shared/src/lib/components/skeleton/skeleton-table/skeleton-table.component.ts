import { Component, Input, OnInit } from '@angular/core';

/**
 * Skeleton table component.
 */
@Component({
  selector: 'shared-skeleton-table',
  templateUrl: './skeleton-table.component.html',
  styleUrls: ['./skeleton-table.component.scss'],
})
export class SkeletonTableComponent implements OnInit {
  /** Array of string with the translation keys */
  @Input() columns: string[] = [];
  /** Numbers of rows for the table */
  @Input() rows = 10;
  /** Indicates if action buttons should be rendered */
  @Input() actions = false;
  /** Indicates if checkboxes should be rendered*/
  @Input() checkbox = false;

  /** Data source for the table */
  dataSource: any[] = [];

  ngOnInit(): void {
    this.columns = [...this.columns];
    // Adds a select column to be able to display checkboxes
    if (this.checkbox) {
      this.columns.unshift('select');
    }

    // Adds an action column to be able to display the action buttons
    if (this.actions) {
      this.columns.push('actions');
    }

    // Pushes empty data for the indicated number of rows
    for (let i = 0; i < this.rows; i++) {
      this.dataSource.push({});
    }
  }
}
