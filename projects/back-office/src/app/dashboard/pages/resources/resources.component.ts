import {Apollo} from 'apollo-angular';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import { DeleteResourceMutationResponse, DELETE_RESOURCE } from '../../../graphql/mutations';
import { GetResourcesQueryResponse, GET_RESOURCES_EXTENDED } from '../../../graphql/queries';
import { Resource, SafeConfirmModalComponent, SafeSnackBarService, NOTIFICATIONS } from '@safe/builder';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatEndDate, MatStartDate } from '@angular/material/datepicker';


@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit, AfterViewInit {

  // === DATA ===
  public loading = true;
  public resources: any;
  displayedColumns: string[] = ['name', 'createdAt', 'recordsCount', 'actions'];
  dataSource =  new MatTableDataSource<Resource>([]);

  // === SORTING ===
  @ViewChild(MatSort) sort?: MatSort;

  // === FILTERS ===
  public showFilters = false;
  public filtersDate = {startDate: '', endDate: ''};
  public searchText = '';
  public recordsFilter = '';


  @ViewChild('startDate', { read: MatStartDate}) startDate!: MatStartDate<string>;
  @ViewChild('endDate', { read: MatEndDate}) endDate!: MatEndDate<string>;

  constructor(
    private dialog: MatDialog,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
  ) { }

  /*  Load the resources.
  */
  ngOnInit(): void {
    this.filterPredicate();

    this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES_EXTENDED
    }).valueChanges.subscribe(res => {
      this.dataSource.data = res.data.resources;
      this.loading = res.loading;
    });
  }

  private filterPredicate(): void {
    this.dataSource.filterPredicate = (data: any) => {
      const endDate = new Date(this.filtersDate.endDate).getTime();
      const startDate = new Date(this.filtersDate.startDate).getTime();
      return (((this.searchText.trim().length === 0 ||
        (this.searchText.trim().length > 0 && data.name.toLowerCase().includes(this.searchText.trim()))) &&
        (this.recordsFilter.trim().length === 0 ||
          this.recordsFilter.trim().length > 0 && data.recordsCount.toString().includes(this.recordsFilter.trim()))) &&
        (!startDate || !endDate || data.createdAt >= startDate && data.createdAt <= endDate));
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort || null;
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
          if (!res.errors) {
            this.dataSource.data = this.dataSource.data.filter(x => x.id !== resource.id);
            this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('ressource'), { duration: 1000 });
          } else {
            this.snackBar.openSnackBar(NOTIFICATIONS.objectNotDeleted('ressource', res.errors[0].message), { error: true });
          }
        });
      }
    });
  }

  applyFilter(column: string, event: any): void {
    if (column === 'recordsCount') {
      this.recordsFilter = !!event.target ? event.target.value.trim().toLowerCase() : '';
    } else {
      this.searchText = !!event ? event.target.value.trim().toLowerCase() : this.searchText;
    }
    this.dataSource.filter = '##';
  }

  clearDateFilter(): void {
    this.filtersDate.startDate = '';
    this.filtersDate.endDate = '';
    this.startDate.value = '';
    this.endDate.value = '';
    this.applyFilter('createdAt', '');
  }

  clearAllFilters(): void {
    this.searchText = '';
    this.recordsFilter = '';
    this.clearDateFilter();
  }
}
