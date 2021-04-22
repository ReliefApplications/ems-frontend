import {Apollo} from 'apollo-angular';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { GetFormByIdQueryResponse, GetRecordByIdQueryResponse, GET_FORM_BY_ID, GET_RECORD_BY_ID } from '../../graphql/queries';
import { Form } from '../../models/form.model';
import * as Survey from 'survey-angular';
import { EditRecordMutationResponse, EDIT_RECORD, AddRecordMutationResponse, ADD_RECORD } from '../../graphql/mutations';
import { v4 as uuidv4 } from 'uuid';
import { SafeConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import addCustomFunctions from '../../utils/custom-functions';
import { SafeSnackBarService } from '../../services/snackbar.service';

@Component({
  selector: 'safe-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss']
})
export class SafeFormModalComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public form?: Form;

  public containerId: string;
  public modifiedAt: Date | null = null;

  private isMultiEdition = false;

  private survey: Survey.Model;

  // === SURVEY COLORS
  primaryColor = '#008DC9';

  constructor(
    public dialogRef: MatDialogRef<SafeFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      template?: string,
      recordId?: string | [],
      locale?: string,
    },
    private apollo: Apollo,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
  ) {
    this.containerId = uuidv4();
  }

  ngOnInit(): void {
    const defaultThemeColorsSurvey = Survey
      .StylesManager
      .ThemeColors.default;
    defaultThemeColorsSurvey['$main-color'] = this.primaryColor;
    defaultThemeColorsSurvey['$main-hover-color'] = this.primaryColor;

    Survey
      .StylesManager
      .applyTheme();

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
          this.modifiedAt = this.isMultiEdition ? null : record.modifiedAt || null;
          this.loading = false;
<<<<<<< HEAD:projects/who-ems/src/lib/components/form-modal/form-modal.component.ts
          this.survey = new Survey.Model(this.form.structure);
          this.survey.data = this.isMultiEdition ? null : record.data;
          this.survey.locale = this.data.locale ? this.data.locale : 'en';
          this.survey.showCompletedPage = false;
          this.survey.render(this.containerId);
          this.survey.onComplete.add(this.completeMySurvey);
          this.survey.onUploadFiles.add((survey, options) => {
            console.log('files');
          });
          this.survey.onDownloadFile.add((survey, options) => {
            console.log('files');
          });
=======
          addCustomFunctions(Survey, record);
          const survey = new Survey.Model(this.form?.structure);
          survey.data = this.isMultiEdition ? null : record.data;
          survey.locale = this.data.locale ? this.data.locale : 'en';
          survey.showCompletedPage = false;
          survey.render(this.containerId);
          survey.onComplete.add(this.completeMySurvey);
>>>>>>> dev:projects/safe/src/lib/components/form-modal/form-modal.component.ts
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
<<<<<<< HEAD:projects/who-ems/src/lib/components/form-modal/form-modal.component.ts
          this.survey = new Survey.Model(this.form.structure);
          this.survey.locale = this.data.locale ? this.data.locale : 'en';
          this.survey.render(this.containerId);
          this.survey.onComplete.add(this.completeMySurvey);
=======

          const survey = new Survey.Model(this.form.structure);
          survey.locale = this.data.locale ? this.data.locale : 'en';
          survey.render(this.containerId);
          survey.onComplete.add(this.completeMySurvey);
>>>>>>> dev:projects/safe/src/lib/components/form-modal/form-modal.component.ts
        });
      }
  }

  /*  Create the record, or update it if provided.
  */
  public completeMySurvey = (survey: any) => {
    const rowsSelected = Array.isArray(this.data.recordId) ? this.data.recordId.length : 1;

    /* we can send to backend empty data if they are not required
    */
    const questions = survey.getAllQuestions();
    const data = survey.data;
    for (const field in questions) {
      if (questions[field]) {
        const key = questions[field].getValueName();
        if (!data[key] && questions[field].getType() !== 'boolean') { data[key] = null; }
      }
    }
    survey.data = data;
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: `Update row${rowsSelected > 1 ? 's' : ''}`,
        content: `Do you confirm the update of ${rowsSelected} row${rowsSelected > 1 ? 's' : ''} ?`,
        confirmText: 'Confirm',
        confirmColor: 'primary'
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
            if (res.errors) {
              this.snackBar.openSnackBar(`Error. ${res.errors[0].message}`, { error: true });
              this.dialogRef.close();
            } else {
              this.dialogRef.close({template: this.data.template, data: res.data?.addRecord});
            }
          });
        }
        survey.showCompletedPage = true;
      } else {
        this.dialogRef.close();
      }
    });
  }

  public updateData(id: any, survey: any): void {
    this.apollo.mutate<EditRecordMutationResponse>({
      mutation: EDIT_RECORD,
      variables: {
        id,
        data: survey.data
      }
    }).subscribe(res => {
      if (res.data) {
        this.dialogRef.close({template: this.form?.id, data: res.data.editRecord});
      }
    });
  }
}
