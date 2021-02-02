import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { GetFormByIdQueryResponse, GetRecordByIdQueryResponse, GET_FORM_BY_ID, GET_RECORD_BY_ID } from '../../graphql/queries';
import { Form } from '../../models/form.model';
import * as Survey from 'survey-angular';
import { EditRecordMutationResponse, EDIT_RECORD, AddRecordMutationResponse, ADD_RECORD } from '../../graphql/mutations';
import { v4 as uuidv4 } from 'uuid';
import { FormService } from '../../services/form.service';
import { WhoConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

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

  private isMultiEdition = false;

  constructor(
    public dialogRef: MatDialogRef<WhoFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      template?: string,
      recordId?: string | [],
      locale?: string
    },
    private apollo: Apollo,
    public dialog: MatDialog
  ) {
    this.containerId = uuidv4();
  }

  ngOnInit(): void {
    this.isMultiEdition = Array.isArray(this.data.recordId);
    if (this.data.recordId) {
      const id = this.isMultiEdition ? this.data.recordId[0] : this.data.recordId;
      this.apollo.watchQuery<GetRecordByIdQueryResponse>({
        query: GET_RECORD_BY_ID,
        variables: {
          id
        }
      }).valueChanges.subscribe(res => {
        const record = res.data.record;
        this.form = record.form;
        this.loading = res.loading;
        const survey = new Survey.Model(this.form.structure);
        survey.data = this.isMultiEdition ? null : record.data;
        survey.locale = this.data.locale ? this.data.locale : 'en';
        survey.showCompletedPage = false;
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

    const rowsSelected = Array.isArray(this.data.recordId) ? this.data.recordId.length : 1;

    const dialogRef = this.dialog.open(WhoConfirmModalComponent, {
      data: {
        title: `Update row${rowsSelected > 1 ? 's' : ''}`,
        content: `Do you confirm the update of ${rowsSelected} row${rowsSelected > 1 ? 's' : ''} ?`,
        confirmText: 'Confirm',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (this.data.recordId) {
          if (this.isMultiEdition) {
            for (const id of this.data.recordId) {
              this.updateData(id, survey);
            }
          } else {
            this.updateData(this.data.recordId, survey);
          }
        } else {
          this.apollo.mutate<AddRecordMutationResponse>({
            mutation: ADD_RECORD,
            variables: {
              form: this.data.template,
              data: survey.data,
              display: true
            }
          }).subscribe(res => {
            this.dialogRef.close({template: this.data.template, data: res.data.addRecord});
          });
        }
        survey.showCompletedPage = true;
      } else {
        this.dialogRef.close();
      }
    });
  }

  public updateData(id, survey: any): void {
    this.apollo.mutate<EditRecordMutationResponse>({
      mutation: EDIT_RECORD,
      variables: {
        id,
        data: survey.data
      }
    }).subscribe(res => {
      this.dialogRef.close({template: this.form.id, data: res.data.editRecord});
    });
  }

}
