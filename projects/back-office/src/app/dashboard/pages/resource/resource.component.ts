import {Apollo} from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { WhoDownloadService, WhoSnackBarService } from '@who-ems/builder';
import { DeleteFormMutationResponse, DeleteRecordMutationResponse, DELETE_FORM,
  DELETE_RECORD, EditResourceMutationResponse, EDIT_RESOURCE } from '../../../graphql/mutations';
import { GetResourceByIdQueryResponse, GET_RESOURCE_BY_ID } from '../../../graphql/queries';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public id: string;
  public resource: any;

  // === RECORDS ASSOCIATED ===
  displayedColumnsRecords: string[] = [];
  dataSourceRecords = [];

  // === FORMS ASSOCIATED ===
  displayedColumnsForms: string[] = ['name', 'createdAt', 'status', 'recordsCount', 'core', '_actions'];
  dataSourceForms = [];

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: WhoSnackBarService,
    private downloadService: WhoDownloadService
  ) { }

  /*  Load data from the id of the resource passed as a parameter.
  */
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id !== null) {
      this.apollo.watchQuery<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE_BY_ID,
        variables: {
          id: this.id,
          display: true
        }
      }).valueChanges.subscribe((res) => {
        if (res.data.resource) {
          this.resource = res.data.resource;
          this.dataSourceRecords = this.resource.records;
          this.dataSourceForms = this.resource.forms;
          this.setDisplayedColumns(false);
          this.loading = res.loading;
        } else {
          this.snackBar.openSnackBar('No access provided to this resource.', { error: true });
          this.router.navigate(['/resources']);
        }
      }, (err) => {
        this.snackBar.openSnackBar(err.message, { error: true });
        this.router.navigate(['/resources']);
      });
    } else {
      this.router.navigate(['/resources']);
    }
  }

  /*  Change the list of displayed columns.
  */
  private setDisplayedColumns(core: boolean): void {
    const columns = [];
    if (core) {
      for (const field of this.resource.fields.filter(x => x.isRequired === true)) {
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

  /*  Delete a record if authorized.
  */
  deleteRecord(id: any, e: any): void {
    e.stopPropagation();
    this.apollo.mutate<DeleteRecordMutationResponse>({
      mutation: DELETE_RECORD,
      variables: {
        id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar('Record deleted', { duration: 1000 });
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
      this.snackBar.openSnackBar('Form deleted', { duration: 1000 });
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
      this.resource = res.data.editResource;
    });
  }

  onDownload(): void {
    const path = `download/resource/records/${this.id}`;
    const fileName = `${this.resource.name}.csv`;
    this.downloadService.getFile(path, 'text/csv;charset=utf-8;', fileName);
  }
}
