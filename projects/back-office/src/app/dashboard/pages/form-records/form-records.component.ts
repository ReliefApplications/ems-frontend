import {Apollo} from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GetFormByIdQueryResponse, GET_FORM_BY_ID } from '../../../graphql/queries';
import { DeleteRecordMutationResponse, DELETE_RECORD } from '../../../graphql/mutations';
import { extractColumns } from '../../../utils/extractColumns';
import { SafeDownloadService } from '@safe/builder';

@Component({
  selector: 'app-form-records',
  templateUrl: './form-records.component.html',
  styleUrls: ['./form-records.component.scss']
})
export class FormRecordsComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public id = '';
  public form: any;
  displayedColumns: string[] = [];
  dataSource: any[] = [];

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private downloadService: SafeDownloadService
  ) { }

  /*  Load the records, using the form id passed as a parameter.
  */
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id !== null) {
      this.apollo.watchQuery<GetFormByIdQueryResponse>({
        query: GET_FORM_BY_ID,
        variables: {
          id: this.id,
          display: false
        }
      }).valueChanges.subscribe(res => {
        this.form = res.data.form;
        this.dataSource = this.form.records;
        this.setDisplayedColumns();
        this.loading = res.loading;
      });
    }
  }

  /*  Modify the list of columns.
  */
  private setDisplayedColumns(): void {
    const columns: any[] = [];
    const structure = JSON.parse(this.form.structure);
    if (structure && structure.pages) {
      for (const page of JSON.parse(this.form.structure).pages) {
        extractColumns(page, columns);
      }
    }
    columns.push('_actions');
    columns.push('_versions');
    this.displayedColumns = columns;
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
      this.dataSource = this.dataSource.filter( x => {
        return x.id !== id;
      });
    });
  }

  onDownload(): void {
    const path = `download/form/records/${this.id}`;
    const fileName = `${this.form.name}.csv`;
    this.downloadService.getFile(path, 'text/csv;charset=utf-8;', fileName);
  }
}
