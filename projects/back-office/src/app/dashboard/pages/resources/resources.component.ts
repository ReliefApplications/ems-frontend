import {Apollo} from 'apollo-angular';
import {Component, OnInit, ViewChild} from '@angular/core';

import { DeleteResourceMutationResponse, DELETE_RESOURCE } from '../../../graphql/mutations';
import { GetResourcesQueryResponse, GET_RESOURCES_EXTENDED } from '../../../graphql/queries';
import { Resource, SafeConfirmModalComponent } from '@safe/builder';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { MatEndDate, MatStartDate } from '@angular/material/datepicker';
import { delay, take } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

const PER_PAGE = 20;

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public loadMoreData = false;
  public noMoreData = false;
  dataSource =  new MatTableDataSource<Resource>([]);
  private page = 0;

  // === SORTING ===
  sortActive = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // === FILTERS ===
  public name = new FormControl('');
  public showFilters = false;
  public filtersDate = {startDate: '', endDate: ''};


  @ViewChild('startDate', { read: MatStartDate}) startDate!: MatStartDate<string>;
  @ViewChild('endDate', { read: MatEndDate}) endDate!: MatEndDate<string>;

  constructor(
    private dialog: MatDialog,
    private apollo: Apollo
  ) { }

  /*  Load the resources.
  */
  ngOnInit(): void {
    this.name.valueChanges.pipe(delay(500)).subscribe(value => {
      if (this.name.value === value) {
        this.search();
      }
    });
    this.search();
  }

  search(): void {
    this.loading = true;
    this.noMoreData = false;
    this.loadMoreData = false;
    this.page = 0;
    this.getResources().subscribe((res: any) => {
      this.dataSource.data = res.data.resources;
      this.loading = res.loading;
      this.setPaginationData(res.data.resources.length);
    });
  }

  private getResources(page = 0): any {
    return this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES_EXTENDED,
      variables: {
        page,
        perPage: PER_PAGE,
        filters: this.buildFilters(),
        sort: this.buildSort()
      }
    }).valueChanges.pipe(take(1));
  }

  private buildFilters(): object {
    return {
      name: this.name.value,
      dateRange: {
        start: this.filtersDate.startDate,
        end: this.filtersDate.endDate
      }
    };
  }

  buildSort(): object {
    const field = this.sortActive;
    const direction = this.sortDirection === 'desc' ? -1 : 1;
    if (field.trim().length === 0) {
      return {createdAt: 1};
    }
    return JSON.parse(`{"${field}": "${direction}"}`);
  }

  sortData(event: Sort): void {
    this.sortDirection = event.direction === 'asc' && event.direction !== this.sortDirection ? 'asc' : 'desc';
    this.sortActive = event.active;
    this.search();
  }

  private setPaginationData(applicationsLength: number): void {
    this.page++;
    if (applicationsLength !== PER_PAGE) {
      this.noMoreData = true;
    }
  }

  onDelete(resource: Resource): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: 'Delete Resource',
        content: `Are you sure you want to delete this resource?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<DeleteResourceMutationResponse>({
          mutation: DELETE_RESOURCE,
          variables: {
            id: resource.id
          }
        }).subscribe(res => {
          this.dataSource.data = this.dataSource.data.filter(x => x.id !== resource.id);
        });
      }
    });
  }

  clearDateFilter(): void {
    this.filtersDate.startDate = '';
    this.filtersDate.endDate = '';
    this.startDate.value = '';
    this.endDate.value = '';
  }

  clearAllFilters(): void {
    this.name.setValue('', {emitEvent: false});
    this.clearDateFilter();
    this.search();
  }

  public onCheckScroll(): void {
    this.loadMoreData = true;
    this.getResources(this.page).subscribe((res: any) => {
      if (res.data.resources.length > 0) {
        this.dataSource.data = this.dataSource.data.concat(res.data.resources);
        this.loadMoreData = res.loading;
        this.setPaginationData(res.data.resources.length);
      } else {
        this.noMoreData = true;
        this.loadMoreData = false;
      }
    });
  }

}
