import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { GetFormsQueryResponse, GET_FORMS } from '../../../graphql/queries';
import { Subscription } from 'rxjs';
import {
  WhoSnackBarService,
  WhoAuthService,
  PermissionsManagement,
  PermissionType,
  WhoConfirmModalComponent,
  Application, Form
} from '@who-ems/builder';
import { DeleteFormMutationResponse, DELETE_FORM, AddFormMutationResponse, ADD_FORM } from '../../../graphql/mutations';
import { AddFormComponent } from '../../../components/add-form/add-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatEndDate, MatStartDate } from '@angular/material/datepicker';


@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy, AfterViewInit {

  // === DATA ===
  public loading = true;
  displayedColumns = ['name', 'createdAt', 'status', 'versions', 'recordsCount', 'core', 'actions'];
  dataSource = new MatTableDataSource<Form>([]);

  // === PERMISSIONS ===
  canAdd = false;
  private authSubscription: Subscription;

  // === SORTING ===
  @ViewChild(MatSort) sort: MatSort;

  // === FILTERS ===
  public filters = [{id: 'name', value: ''}, {id: 'createdAt', value: ''}, {id: 'status', value: ''}, {id: 'versions', value: ''}, {id: 'recordsCount', value: ''}, {id: 'core', value: ''}];
  public filtersDate = {startDate: '', endDate: ''};

  @ViewChild('startDate', { read: MatStartDate}) startDate: MatStartDate<string>;
  @ViewChild('endDate', { read: MatEndDate}) endDate: MatEndDate<string>;


  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: WhoSnackBarService,
    private authService: WhoAuthService
  ) { }

  /*  Load the forms.
    Check user permission to add new forms.
  */
  ngOnInit(): void {
    this.filterPredicate();

    this.apollo.watchQuery<GetFormsQueryResponse>({
      query: GET_FORMS
    }).valueChanges.subscribe(res => {
      this.dataSource.data = res.data.forms;
      this.loading = res.loading;
    });
    this.authSubscription = this.authService.user.subscribe(() => {
      this.canAdd = this.authService.userHasClaim(PermissionsManagement.getRightFromPath(this.router.url, PermissionType.create));
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
          if (filter.id === 'core') {
            matchFilter.push(!filter.value || !val && filter.value === 'false' || val === true && filter.value === 'true');
          }
          else if (filter.id === 'versions') {
            // necessary to handle version array length
            matchFilter.push(filter.value.trim().length === 0 || val.length.toString().includes(filter.value));
          } else {
            matchFilter.push(val.toString().toLowerCase().includes(filter.value.toLowerCase()));
          }
        }
      });

      return matchFilter.every(Boolean); // AND condition
      // return matchFilter.some(Boolean); // OR condition
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  /*  Remove a form if authorized.
  */
  onDelete(element: any, e: any): void {
    e.stopPropagation();
    const dialogRef = this.dialog.open(WhoConfirmModalComponent, {
      data: {
        title: 'Delete form',
        content: `Do you confirm the deletion of the form ${element.name} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        const id = element.id;
        this.apollo.mutate<DeleteFormMutationResponse>({
          mutation: DELETE_FORM,
          variables: {
            id
          }
        }).subscribe(res => {
          this.snackBar.openSnackBar('Form deleted', { duration: 1000 });
          this.dataSource.data = this.dataSource.data.filter(x => {
            return x.id !== element.id;
          });
        });
      }
    });
  }

  /*  Display the AddForm modal.
    Create a new form on closed if result.
  */
  onAdd(): void {
    const dialogRef = this.dialog.open(AddFormComponent, {
      panelClass: 'add-dialog'
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        const data = { name: value.name };
        Object.assign(data,
          value.binding === 'newResource' && { newResource: true },
          (value.binding === 'fromResource' && value.resource) && { resource: value.resource },
          (value.binding === 'fromResource' && value.template) && { template: value.template }
        );
        this.apollo.mutate<AddFormMutationResponse>({
          mutation: ADD_FORM,
          variables: data
        }).subscribe(res => {
          if (res.errors) {
            this.snackBar.openSnackBar('The Form was not created. ' + res.errors[0].message);
          } else {
            const { id } = res.data.addForm;
            this.router.navigate(['/forms/builder', id]);
          }
        }, (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
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
