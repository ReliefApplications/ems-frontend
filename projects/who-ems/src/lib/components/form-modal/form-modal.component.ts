import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { GetFormByIdQueryResponse, GetRecordByIdQueryResponse, GET_FORM_BY_ID, GET_RECORD_BY_ID } from '../../graphql/queries';
import { Form } from '../../models/form.model';
import * as Survey from 'survey-angular';
import { EditRecordMutationResponse, EDIT_RECORD, AddRecordMutationResponse, ADD_RECORD } from '../../graphql/mutations';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'who-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss']
})
export class WhoFormModalComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public form: Form;

  public containerId: string;

  constructor(
    public dialogRef: MatDialogRef<WhoFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      template: string,
      locale: string,
      recordId?: string
    },
    private apollo: Apollo
  ) {
    this.containerId = uuidv4();
  }

  ngOnInit(): void {
    if (this.data.recordId) {
      this.apollo.watchQuery<GetRecordByIdQueryResponse>({
        query: GET_RECORD_BY_ID,
        variables: {
          id: this.data.recordId
        }
      }).valueChanges.subscribe(res => {
        const record = res.data.record;
        this.form = record.form;
        this.loading = res.loading;
        const survey = new Survey.Model(this.form.structure);
        survey.data = record.data;
        survey.locale = this.data.locale ? this.data.locale : 'en';
        survey.render(this.containerId);
        survey.onComplete.add(this.completeMySurvey);
      });
    } else {
      this.apollo.watchQuery<GetFormByIdQueryResponse>({
        query: GET_FORM_BY_ID,
        variables: {
          id: this.data.template
        }
      }).valueChanges.subscribe(res => {
        this.loading = res.loading;
        this.form = res.data.form;
        const survey = new Survey.Model(this.form.structure);
        survey.locale = this.data.locale ? this.data.locale : 'en';
        survey.render(this.containerId);
        survey.onComplete.add(this.completeMySurvey);
      });
    }
  }

  /*  Create the record, or update it if provided.
  */
  public completeMySurvey = (survey: any) => {
    if (this.data.recordId) {
      this.apollo.mutate<EditRecordMutationResponse>({
        mutation: EDIT_RECORD,
        variables: {
          id: this.data.recordId,
          data: survey.data
        }
      }).subscribe(res => {
        this.dialogRef.close({ template: this.data.template, data: res.data.editRecord });
      });
    } else {
      this.apollo.mutate<AddRecordMutationResponse>({
        mutation: ADD_RECORD,
        variables: {
          form: this.data.template,
          data: survey.data,
          display: true
        }
      }).subscribe(res => {
        this.dialogRef.close({ template: this.data.template, data: res.data.addRecord });
      });
    }
  }

}
