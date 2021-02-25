import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DeleteResourceMutationResponse, DELETE_RESOURCE } from '../../../graphql/mutations';
import { GetResourcesQueryResponse, GET_RESOURCES_EXTENDED } from '../../../graphql/queries';
import { Resource, WhoConfirmModalComponent } from '@who-ems/builder';
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
  @ViewChild(MatSort) sort: MatSort;

  // === FILTERS ===
  public filters = [{id: 'name', value: ''}, {id: 'createdAt', value: ''}, {id: 'recordsCount', value: ''}];
  public filtersDate = {startDate: '', endDate: ''};

  @ViewChild('startDate', { read: MatStartDate}) startDate: MatStartDate<string>;
  @ViewChild('endDate', { read: MatEndDate}) endDate: MatEndDate<string>;

  constructor(
    private dialog: MatDialog,
    private apollo: Apollo
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
    this.dataSource.filterPredicate = (data: any, filtersJson: string) => {
      const matchFilter = [];
      const filters = JSON.parse(filtersJson);

      filters.forEach(filter => {
        // check for null values
        const val = !!data[filter.id] ? data[filter.id] : filter.id === 'recordsCount' ? 0 : '';
        // necessary to handler dates
        if (filter.id === 'createdAt') {
          const startDate = new Date(this.filtersDate.startDate).getTime();
          const endDate = new Date(this.filtersDate.endDate).getTime();
          matchFilter.push(!startDate || !endDate || data[filter.id] >=  startDate && data[filter.id] <= endDate);
        } else {
          matchFilter.push(val.toString().toLowerCase().includes(filter.value.toLowerCase()));
        }
      });

      return matchFilter.every(Boolean); // AND condition
      // return matchFilter.some(Boolean); // OR condition
    };
  }


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onDelete(resource: Resource): void {
    const dialogRef = this.dialog.open(WhoConfirmModalComponent, {
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

  applyFilter(column: string, event: any): void {
    {
      if (column !== 'createdAt' ) {
        this.filters.map(f => {
          if (f.id === column) {
            f.value = event.target.value;
          }
        });
      }
      this.dataSource.filter = JSON.stringify(this.filters);
    }
  }

  clearDateFilter(): void {
    this.filtersDate.startDate = '';
    this.filtersDate.endDate = '';
    // ignore that error
    this.startDate.value = '';
    this.endDate.value = '';
    this.applyFilter('createdAt', '');
  }
}
