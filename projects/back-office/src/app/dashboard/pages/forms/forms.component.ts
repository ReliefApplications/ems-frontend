import {Apollo} from 'apollo-angular';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import {
  GET_APPLICATIONS,
  GET_SHORT_FORMS,
  GetApplicationsQueryResponse,
  GetFormsQueryResponse
} from '../../../graphql/queries';
import { Subscription } from 'rxjs';
import {
  SafeSnackBarService,
  SafeAuthService,
  PermissionsManagement,
  PermissionType,
  SafeConfirmModalComponent,
  NOTIFICATIONS,
  Form
} from '@safe/builder';
import { DeleteFormMutationResponse, DELETE_FORM, AddFormMutationResponse, ADD_FORM } from '../../../graphql/mutations';
import { AddFormComponent } from '../../../components/add-form/add-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { MatEndDate, MatStartDate } from '@angular/material/datepicker';
import { delay, take } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

const PER_PAGE = 20;

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy {

  // === DATA ===
  public loading = true;
  public loadMoreData = false;
  public noMoreData = false;
  public dataSource: MatTableDataSource<Form> = new MatTableDataSource<Form>([]);
  private page = 0;

  // === PERMISSIONS ===
  canAdd = false;
  private authSubscription?: Subscription;

  // === SORTING ===
  sortActive = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // === FILTERS ===
  public filtersDate = {startDate: '', endDate: ''};
  public showFilters = false;
  public name = new FormControl('');
  public statusFilter = new FormControl('');
  public coreFilter = new FormControl('');

  @ViewChild('startDate', { read: MatStartDate}) startDate!: MatStartDate<string>;
  @ViewChild('endDate', { read: MatEndDate}) endDate!: MatEndDate<string>;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService
  ) { }

  /*  Load the forms.
    Check user permission to add new forms.
  */
  ngOnInit(): void {
    this.name.valueChanges.pipe(delay(500)).subscribe(value => {
      if (this.name.value === value) {
        this.search();
      }
    });
    this.statusFilter.valueChanges.subscribe(value => {
      this.search();
    });
    this.coreFilter.valueChanges.subscribe(value => {
      this.search();
    });
    this.search();
    this.authSubscription = this.authService.user.subscribe(() => {
      this.canAdd = this.authService.userHasClaim(PermissionsManagement.getRightFromPath(this.router.url, PermissionType.create));
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  /*  Remove a form if authorized.
  */
  onDelete(element: any): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
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
          this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('Form'), { duration: 1000 });
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
            this.snackBar.openSnackBar(NOTIFICATIONS.objectNotCreated('form', res.errors[0].message), { error: true });
          } else {
            if (res.data) {
              const { id } = res.data.addForm;
              this.router.navigate(['/forms/builder', id]);
            }
          }
        }, (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        });
      }
    });
  }

  clearDateFilter(): void {
    this.filtersDate.startDate = '';
    this.filtersDate.endDate = '';
    // ignore that error
    this.startDate.value = '';
    this.endDate.value = '';
  }

  clearAllFilters(): void {
    this.name.setValue('', {emitEvent: false});
    this.statusFilter.setValue('', {emitEvent: false});
    this.coreFilter.setValue('', {emitEvent: false});
    this.clearDateFilter();
    this.search();
  }

  public onCheckScroll(): void {
    this.loadMoreData = true;
    this.getForms(this.page).subscribe((res: any) => {
      if (res.data.forms.length > 0) {
        this.dataSource.data = this.dataSource.data.concat(res.data.forms);
        this.loadMoreData = res.loading;
        this.setPaginationData(res.data.forms.length);
      } else {
        this.noMoreData = true;
        this.loadMoreData = false;
      }
    });
  }

  search(): void {
    this.loading = true;
    this.noMoreData = false;
    this.loadMoreData = false;
    this.page = 0;
    this.getForms().subscribe((res: any) => {
      this.dataSource.data = res.data.forms;
      this.loading = res.loading;
      this.setPaginationData(res.data.forms.length);
    });
  }

  private setPaginationData(applicationsLength: number): void {
    this.page++;
    if (applicationsLength !== PER_PAGE) {
      this.noMoreData = true;
    }
  }

  private getForms(page = 0): any {
    return this.apollo.watchQuery<GetApplicationsQueryResponse>({
      query: GET_SHORT_FORMS,
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
      },
      status: this.statusFilter.value,
      core: this.coreFilter.value
    };
  }

  sortData(event: Sort): void {
    this.sortDirection = event.direction === 'asc' && event.direction !== this.sortDirection ? 'asc' : 'desc';
    this.sortActive = event.active;
    this.search();
  }

  buildSort(): object {
    const field = this.sortActive;
    const direction = this.sortDirection === 'desc' ? -1 : 1;
    if (field.trim().length === 0) {
      return {createdAt: 1};
    }
    return JSON.parse(`{"${field}": "${direction}"}`);
  }
}
