import {Apollo, QueryRef} from 'apollo-angular';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import { DeleteResourceMutationResponse, DELETE_RESOURCE } from '../../../graphql/mutations';
import { GetResourcesQueryResponse, GET_RESOURCES_EXTENDED } from '../../../graphql/queries';
import { Resource, SafeConfirmModalComponent, SafeSnackBarService, NOTIFICATIONS } from '@safe/builder';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatEndDate, MatStartDate } from '@angular/material/datepicker';

const ITEMS_PER_PAGE = 10;

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit, AfterViewInit {

  // === DATA ===
  public loading = true;
  private resourcesQuery!: QueryRef<GetResourcesQueryResponse>;
  public resources: any;
  displayedColumns: string[] = ['name', 'createdAt', 'recordsCount', 'actions'];
  public cachedResources: Resource[] = [];
  dataSource =  new MatTableDataSource<Resource>([]);

  // === SORTING ===
  @ViewChild(MatSort) sort?: MatSort;

  // === FILTERS ===
  public showFilters = false;
  public filtersDate = {startDate: '', endDate: ''};
  public searchText = '';
  public recordsFilter = '';

  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: ''
  };

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

    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES_EXTENDED,
      variables: {
        first: ITEMS_PER_PAGE
      }
    });

    this.resourcesQuery.valueChanges.subscribe(res => {
      this.cachedResources = res.data.resources.edges.map(x => x.node);
      this.dataSource.data = this.cachedResources.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
      this.pageInfo.length = res.data.resources.totalCount;
      this.pageInfo.endCursor = res.data.resources.pageInfo.endCursor;
      this.loading = res.loading;
      this.filterPredicate();
    });
  }

  /**
   * Handles page event.
   * @param e page event.
   */
   onPage(e: any): void {
    this.pageInfo.pageIndex = e.pageIndex;
    if (e.pageIndex > e.previousPageIndex && e.length > this.cachedResources.length) {
      this.resourcesQuery.fetchMore({
        variables: {
          first: ITEMS_PER_PAGE,
          afterCursor: this.pageInfo.endCursor
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) { return prev; }
          return Object.assign({}, prev, {
            resources: {
              edges: [...prev.resources.edges, ...fetchMoreResult.resources.edges],
              pageInfo: fetchMoreResult.resources.pageInfo,
              totalCount: fetchMoreResult.resources.totalCount
            }
          });
        }
      });
    } else {
      this.dataSource.data = this.cachedResources.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
    }
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
            this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('ressource'));
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
    this.applyFilter('', null);
  }
}
