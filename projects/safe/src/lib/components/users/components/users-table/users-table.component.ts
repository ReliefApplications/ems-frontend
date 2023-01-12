import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../models/user.model';

/** Default number of item per page in the users table */
const DEFAULT_FIRST = 10;

/** Component that displays table of users from a application */
@Component({
  selector: 'safe-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent implements OnChanges {
  // User data
  @Input('users') cachedUsers: User[] = [];
  public users = new MatTableDataSource<User>([]);

  private neverFetched = true;

  // Pagination
  @Input() pageInfo = {
    hasNextPage: true,
    endCursor: '',
    totalCount: 0,
  };

  public pageSize = DEFAULT_FIRST;
  public pageIndex = 0;
  public previousPageIndex: number | undefined = undefined;

  @Input() displayedColumns: string[] = [];
  @Input() loading = true;

  // Selection of users
  public selected = new SelectionModel<User>(true, []);
  @Output() selection = new EventEmitter<typeof this.selected>();

  // Page event
  @Output() more = new EventEmitter<number>();

  // Delete element
  @Output() delete = new EventEmitter<User>();

  /**
   * Component that displays table of users from a application
   *
   * @param router router to navigate to user page
   * @param activatedRoute current activated route
   */
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnChanges(): void {
    if (this.pageInfo.endCursor !== '') this.neverFetched = false;
    if (this.neverFetched) {
      this.onPage({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        length: this.pageInfo.totalCount,
        previousPageIndex: this.previousPageIndex,
      });
    } else {
      this.loading = false;
      this.users.data = this.cachedUsers.slice(
        this.pageSize * this.pageIndex,
        this.pageSize * (this.pageIndex + 1)
      );
    }
  }

  /**
   * Handle click on user row.
   * Redirect to user page
   *
   * @param user user to see details of
   */
  public onClick(user: User): void {
    this.router.navigate([user.id], { relativeTo: this.activatedRoute });
  }

  /**
   * Whether the number of selected elements matches the total number of rows.
   *
   * @returns True if it matches, else False
   */
  public isAllSelected(): boolean {
    const numSelected = this.selected.selected.length;
    const numRows = this.users.data.length;
    return numSelected === numRows;
  }

  /**
   * Get the label for the checkbox on the passed row
   *
   * @param row The current row
   * @returns The label for the checkbox
   */
  public checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selected.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  public masterToggle(): void {
    if (this.isAllSelected()) {
      this.selected.clear();
    } else {
      this.users.data.forEach((row) => this.selected.select(row));
    }
    this.selection.emit(this.selected);
  }

  /**
   * Toggles selection for a row
   *
   * @param row to toggle selection for
   */
  public onToggle(row: any): void {
    this.selected.toggle(row);
    this.selection.emit(this.selected);
  }

  /**
   * Delete selected user
   *
   * @param user user to delete
   */
  onDelete(user: User): void {
    this.delete.emit(user);
  }

  /**
   * Handles page event.
   *
   * @param e page event.
   */
  onPage(e: PageEvent): void {
    if (this.loading) return;
    this.pageIndex = e.pageIndex;
    this.previousPageIndex = e.previousPageIndex;
    // Checks if with new page/size more data needs to be fetched

    const gettingNextPage =
      !e.previousPageIndex || e.pageIndex > e.previousPageIndex;

    if (
      ((gettingNextPage || e.pageSize > this.pageSize) &&
        e.length > this.cachedUsers.length) ||
      this.neverFetched
    ) {
      this.neverFetched = false;
      // Sets the new fetch quantity of data needed as the page size
      // If the fetch is for a new page the page size is used
      let neededSize = e.pageSize;
      // If the fetch is for a new page size, the old page size is subtracted from the new one
      if (e.pageSize > this.pageSize) {
        neededSize -= this.pageSize;
      }
      this.loading = true;
      this.more.emit(neededSize);
    } else {
      this.loading = false;
      this.users.data = this.cachedUsers.slice(
        e.pageSize * this.pageIndex,
        e.pageSize * (this.pageIndex + 1)
      );
    }
    this.pageSize = e.pageSize;
  }
}
