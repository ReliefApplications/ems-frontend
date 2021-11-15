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
  public filter: any;

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
    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES_EXTENDED,
      variables: {
        first: ITEMS_PER_PAGE
      }
    });

    console.log('launch : 0');
    this.resourcesQuery.valueChanges.subscribe(res => {
      this.cachedResources = res.data.resources.edges.map(x => x.node);
      this.dataSource.data = this.cachedResources.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
      this.pageInfo.length = res.data.resources.totalCount;
      this.pageInfo.endCursor = res.data.resources.pageInfo.endCursor;
      this.loading = res.loading;
    });
  }

  /**
   * Handles page event.
   * @param e page event.
   */
   onPage(e: any): void {
    this.pageInfo.pageIndex = e.pageIndex;
    if (e.pageIndex > e.previousPageIndex && e.length > this.cachedResources.length) {
      console.log('launch : 1');
      this.resourcesQuery.fetchMore({
        variables: {
          first: ITEMS_PER_PAGE,
          afterCursor: this.pageInfo.endCursor,
          filter: this.filter
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

  /**
   * Filters applications and updates table.
   * @param filter filter event.
   */
  onFilter(filter: any): void {
    console.log(filter);
    console.log('filter');
    this.filter = filter;
    this.cachedResources = [];
    this.pageInfo.pageIndex = 0;
    console.log('launch : 3');
    this.resourcesQuery.fetchMore({
      variables: {
        first: ITEMS_PER_PAGE,
        filter: this.filter
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) { return prev; }
        return Object.assign({}, prev, {
          applications: {
            edges: fetchMoreResult.resources.edges,
            pageInfo: fetchMoreResult.resources.pageInfo,
            totalCount: fetchMoreResult.resources.totalCount
          }
        });
      }
    });
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
}
