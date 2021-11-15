import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeDownloadService, SafeSnackBarService, NOTIFICATIONS, SafeConfirmModalComponent, Record, Form } from '@safe/builder';
import { DeleteFormMutationResponse, DeleteRecordMutationResponse, DELETE_FORM,
  DELETE_RECORD, EditResourceMutationResponse, EDIT_RESOURCE, RestoreRecordMutationResponse, RESTORE_RECORD } from '../../../graphql/mutations';
import { GetResourceByIdQueryResponse, GetResourceRecordsQueryResponse, GET_RESOURCE_BY_ID, GET_RESOURCE_RECORDS } from '../../../graphql/queries';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

const ITEMS_PER_PAGE = 10;

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit, OnDestroy {

  // === DATA ===
  private resourceSubscription?: Subscription;
  private recordsQuery!: QueryRef<GetResourceRecordsQueryResponse>;
  public loading = true;
  public id = '';
  public resource: any;
  public cachedRecords: Record[] = [];

  // === RECORDS ASSOCIATED ===
  displayedColumnsRecords: string[] = [];
  dataSourceRecords: any[] = [];

  // === FORMS ASSOCIATED ===
  displayedColumnsForms: string[] = ['name', 'createdAt', 'status', 'recordsCount', 'core', '_actions'];
  dataSourceForms: any[] = [];

  // === SHOW DELETED RECORDS ===
  showDeletedRecords = false;

  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: ''
  };

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SafeSnackBarService,
    private downloadService: SafeDownloadService,
    private dialog: MatDialog
  ) { }

  /*  Load data from the id of the resource passed as a parameter.
  */
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id !== null) {
      this.getResourceData();
    } else {
      this.router.navigate(['/resources']);
    }
  }

  /**
   * Loads resource data.
   */
  private getResourceData(): void {
    this.loading = true;
    if (this.resourceSubscription) {
      this.resourceSubscription.unsubscribe();
    }

    // get the records according to the open resource
    this.recordsQuery = this.apollo.watchQuery<GetResourceRecordsQueryResponse>({
      query: GET_RESOURCE_RECORDS,
      variables: {
        first: ITEMS_PER_PAGE,
        id: this.id,
        display: false,
        isForm: false,
      }
    });
    this.recordsQuery.valueChanges.subscribe(res => {
      this.cachedRecords = res.data.resource.records.edges.map(x => x.node);
      this.dataSourceRecords = this.cachedRecords.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
      this.pageInfo.length = res.data.resource.records.totalCount;
      this.pageInfo.endCursor = res.data.resource.records.pageInfo.endCursor;
      this.loading = res.loading;
    });

    // get the resource and the form linked
    this.resourceSubscription = this.apollo.watchQuery<GetResourceByIdQueryResponse>({
      query: GET_RESOURCE_BY_ID,
      variables: {
        id: this.id
      }
    }).valueChanges.subscribe((res) => {
      if (res.data.resource) {
        this.resource = res.data.resource;
        this.dataSourceForms = this.resource.forms;
        this.setDisplayedColumns(false);
        this.loading = res.loading;
      } else {
        this.snackBar.openSnackBar(NOTIFICATIONS.accessNotProvided('resource'), { error: true });
        this.router.navigate(['/resources']);
      }
    }, (err) => {
      this.snackBar.openSnackBar(err.message, { error: true });
      this.router.navigate(['/resources']);
    });
  }

  /**
   * Handles page event.
   * @param e page event.
   */
   onPage(e: any): void {
    this.pageInfo.pageIndex = e.pageIndex;
    if (e.pageIndex > e.previousPageIndex && e.length > this.cachedRecords.length) {
      this.recordsQuery.fetchMore({
        variables: {
          id: this.id,
          first: ITEMS_PER_PAGE,
          afterCursor: this.pageInfo.endCursor
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) { return prev; }
          return Object.assign({}, prev, {
            records: {
              edges: [...prev.resource.records.edges, ...fetchMoreResult.resource.records.edges],
              pageInfo: fetchMoreResult.resource.records.pageInfo,
              totalCount: fetchMoreResult.resource.records.totalCount
            }
          });
        }
      });
    } else {
      this.dataSourceRecords = this.cachedRecords.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
    }
  }

  /**
   * Changes the list of displayed columns.
   * @param core Is the form core.
   */
  private setDisplayedColumns(core: boolean): void {
    const columns = [];
    if (core) {
      for (const field of this.resource.fields.filter((x: any) => x.isRequired === true)) {
        columns.push(field.name);
      }
    } else {
      for (const field of this.resource.fields) {
        columns.push(field.name);
      }
    }
    columns.push('_actions');
    this.displayedColumnsRecords = columns;
  }

  public filterCore(event: any): void {
    this.setDisplayedColumns(event.value);
  }

  /**
   * Deletes a record if authorized, open a confirmation modal if it's a hard delete.
   * @param id Id of record to delete.
   * @param e click event.
   */
  public onDeleteRecord(id: string, e: any): void {
    e.stopPropagation();
    if (this.showDeletedRecords) {
      const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
        data: {
          title: 'Delete record permanently',
          content: `Do you confirm the hard deletion of this record ?`,
          confirmText: 'Delete',
          confirmColor: 'warn'
        }
      });
      dialogRef.afterClosed().subscribe(value => {
        if (value) {
          this.deleteRecord(id);
        }
      });
    } else {
      this.deleteRecord(id);
    }
  }

  /**
   * Sends mutation to delete record.
   * @param id Id of record to delete.
   */
  private deleteRecord(id: string): void {
    this.apollo.mutate<DeleteRecordMutationResponse>({
      mutation: DELETE_RECORD,
      variables: {
        id,
        hardDelete: this.showDeletedRecords
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('Record'));
      this.dataSourceRecords = this.dataSourceRecords.filter(x => {
        return x.id !== id;
      });
    });
  }

  /*  Delete a form if authorized.
  */
  deleteForm(id: any, e: any): void {
    e.stopPropagation();
    this.apollo.mutate<DeleteFormMutationResponse>({
      mutation: DELETE_FORM,
      variables: {
        id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('Form'));
      this.dataSourceForms = this.dataSourceForms.filter(x => {
        return x.id !== id;
      });
    });
  }

  /*  Edit the permissions layer.
  */
  saveAccess(e: any): void {
    this.apollo.mutate<EditResourceMutationResponse>({
      mutation: EDIT_RESOURCE,
      variables: {
        id: this.id,
        permissions: e
      }
    }).subscribe(res => {
      if (res.data) {
        this.resource = res.data.editResource;
      }
    });
  }

  onDownload(type: string): void {
    const path = `download/resource/records/${this.id}`;
    const fileName = `${this.resource.name}.${type}`;
    const queryString = new URLSearchParams({ type }).toString();
    this.downloadService.getFile(`${path}?${queryString}`, `text/${type};charset=utf-8;`, fileName);
  }

  /**
   * Toggle archive / active view.
   * @param e click event.
   */
  onSwitchView(e: any): void {
    e.stopPropagation();
    this.showDeletedRecords = !this.showDeletedRecords;
    this.getResourceData();
  }

  /**
   * Restores an archived record.
   * @param id Id of record to restore.
   * @param e click event.
   */
  public onRestoreRecord(id: string, e: any): void {
    e.stopPropagation();
    this.apollo.mutate<RestoreRecordMutationResponse>({
      mutation: RESTORE_RECORD,
      variables: {
        id,
      }
    }).subscribe(res => {
      this.dataSourceRecords = this.dataSourceRecords.filter(x => {
        return x.id !== id;
      });
    });
  }

  /**
   * Get list of forms filtering by record form.
   * @param record Record to filter templates with.
   * @returns list of different forms than the one used to create the record.
   */
  public filterTemplates(record: Record): Form[] {
    return this.resource.forms.filter((x: Form) => x.id !== record.form?.id);

  }

  /**
   * Unsubscribe to subscriptions before destroying component.
   */
  ngOnDestroy(): void {
    if (this.resourceSubscription) {
      this.resourceSubscription.unsubscribe();
    }
  }
}
