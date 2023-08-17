import { Component, Input, OnInit } from '@angular/core';

/**
 * Mocked Interface
 */
export interface ArchivePage {
  id: string;
  name: string;
  deleteDate: Date;
}

/**
 *
 */
@Component({
  selector: 'safe-applications-archive',
  templateUrl: './applications-archive.component.html',
  styleUrls: ['./applications-archive.component.scss'],
})
export class ApplicationsArchiveComponent implements OnInit {
  loading = false;
  @Input() itemList: ArchivePage[] = [];
  public filteredArchiveList: Array<ArchivePage> = new Array<ArchivePage>();
  public displayedColumns = ['name', 'deleteDate', 'actions'];

  // === FILTERS ===
  public filters = [
    { id: 'name', value: '' },
    { id: 'deleteDate', value: '' },
  ];
  public searchText = '';
  public dateFilter = '';

  ngOnInit(): void {
    this.filterPredicate();
  }

  /**
   * Filter roles and users.
   */
  private filterPredicate(): void {
    this.filteredArchiveList = this.itemList.filter(
      (data: ArchivePage) =>
        (this.searchText.trim().length === 0 ||
          (this.searchText.trim().length > 0 &&
            data.name.toLowerCase().includes(this.searchText.trim()))) &&
        (this.dateFilter.trim().length === 0 ||
          (this.dateFilter.trim().length > 0 &&
            data.deleteDate.toString().includes(this.dateFilter.trim())))
    );
  }

  /**
   * Applies filters to the list of roles on event
   *
   * @param column Name of the column where the filtering happens
   * @param event The event
   */
  applyFilter(column: string, event: any): void {
    if (column === 'deleteDate') {
      this.dateFilter = event.target
        ? event.target.value.trim().toLowerCase()
        : '';
    } else {
      this.searchText = event
        ? event.target.value.trim().toLowerCase()
        : this.searchText;
    }
    this.filterPredicate();
  }

  /**
   * Clear all the filters
   */
  clearAllFilters(): void {
    this.searchText = '';
    this.dateFilter = '';
    this.applyFilter('', null);
  }

  /**
   * Perform an action on selected archive applications table row
   *
   * @param archiveApp ArchiveApp
   */
  onSelectArchive(archiveApp: ArchivePage) {
    console.log(archiveApp);
  }
}
