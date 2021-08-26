import { Apollo } from 'apollo-angular';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {
  GetFormByIdQueryResponse,
  GetRecordByIdQueryResponse,
  GET_RECORD_BY_ID,
  GET_FORM_STRUCTURE
} from '../../graphql/queries';
import { Form } from '../../models/form.model';
import * as Survey from 'survey-angular';
import { EditRecordMutationResponse, EDIT_RECORD, AddRecordMutationResponse, ADD_RECORD, UploadFileMutationResponse,
   UPLOAD_FILE, EDIT_RECORDS, EditRecordsMutationResponse } from '../../graphql/mutations';
import { v4 as uuidv4 } from 'uuid';
import { SafeConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import addCustomFunctions from '../../utils/custom-functions';
import { SafeSnackBarService } from '../../services/snackbar.service';
import { SafeDownloadService } from '../../services/download.service';
import { SafeAuthService } from '../../services/auth.service';

interface DialogData {
  template?: string;
  recordId?: string | [];
  locale?: string;
}

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

  private survey?: Survey.Model;
  private temporaryFilesStorage: any = {};

  // === SURVEY COLORS
  primaryColor = '#008DC9';

  constructor(
    public dialogRef: MatDialogRef<SafeFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apollo: Apollo,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private downloadService: SafeDownloadService,
    private authService: SafeAuthService
  ) {
    this.containerId = uuidv4();
  }

  ngOnInit(): void {
    console.log('init');
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
        addCustomFunctions(Survey, this.authService, record);
        this.survey = new Survey.Model(this.form?.structure);
        this.survey.onClearFiles.add((survey, options) => this.onClearFiles(survey, options));
        this.survey.onUploadFiles.add((survey, options) => this.onUploadFiles(survey, options));
        this.survey.onDownloadFile.add((survey, options) => this.onDownloadFile(survey, options));
        this.survey.data = this.isMultiEdition ? null : record.data;
        this.survey.locale = this.data.locale ? this.data.locale : 'en';
        this.survey.showCompletedPage = false;
        this.survey.render(this.containerId);
        this.survey.onComplete.add(this.completeMySurvey);
      });
    } else {
      this.apollo.watchQuery<GetFormByIdQueryResponse>({
        query: GET_FORM_STRUCTURE,
        variables: {
          id: this.data.template
        }
      }).valueChanges.subscribe(res => {
        this.loading = res.loading;
        this.form = res.data.form;
        this.survey = new Survey.Model(this.form.structure);
        this.survey.onClearFiles.add((survey, options) => this.onClearFiles(survey, options));
        this.survey.onUploadFiles.add((survey, options) => this.onUploadFiles(survey, options));
        this.survey.onDownloadFile.add((survey, options) => this.onDownloadFile(survey, options));
        this.survey.locale = this.data.locale ? this.data.locale : 'en';
        this.survey.render(this.containerId);
        this.survey.onComplete.add(this.completeMySurvey);
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
    dialogRef.afterClosed().subscribe(async value => {
      if (value) {
        if (this.data.recordId) {
          await this.uploadFiles(survey);
          if (this.isMultiEdition) {
            this.updateMultipleData(this.data.recordId, survey);
          } else {
            this.updateData(this.data.recordId, survey);
          }
        } else {
          await this.uploadFiles(survey);
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
              this.dialogRef.close({ template: this.data.template, data: res.data?.addRecord });
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
        this.dialogRef.close({ template: this.form?.id, data: res.data.editRecord });
      }
    });
  }

  public updateMultipleData(ids: any, survey: any): void {
    this.apollo.mutate<EditRecordsMutationResponse>({
      mutation: EDIT_RECORDS,
      variables: {
        ids,
        data: survey.data
      }
    }).subscribe(res => {
      if (res.data) {
        this.dialogRef.close({ template: this.form?.id, data: res.data.editRecords });
      }
    });
  }

  private async uploadFiles(survey: any): Promise<void> {
    const data = survey.data;
    const questionsToUpload = Object.keys(this.temporaryFilesStorage);
    for (const name of questionsToUpload) {
      const files = this.temporaryFilesStorage[name];
      for (const [index, file] of files.entries()) {
        const res = await this.apollo.mutate<UploadFileMutationResponse>({
          mutation: UPLOAD_FILE,
          variables: {
            file,
            form: this.form?.id
          },
          context: {
            useMultipart: true
          }
        }).toPromise();
        if (res.errors) {
          this.snackBar.openSnackBar(res.errors[0].message, { error: true });
          return;
        } else {
          data[name][index].content = res.data?.uploadFile;
        }
      }
    }
  }

  private onClearFiles(survey: Survey.SurveyModel, options: any): void {
    options.callback('success');
  }

  private onUploadFiles(survey: Survey.SurveyModel, options: any): void {
    if (this.temporaryFilesStorage[options.name] !== undefined) {
      this.temporaryFilesStorage[options.name].concat(options.files);
    } else {
      this.temporaryFilesStorage[options.name] = options.files;
    }
    let content: any[] = [];
    options
      .files
      .forEach((file: any) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          content = content.concat([
            {
              name: file.name,
              type: file.type,
              content: fileReader.result,
              file
            }
          ]);
          if (content.length === options.files.length) {
            options.callback('success', content.map((fileContent) => {
              return { file: fileContent.file, content: fileContent.content };
            }));
          }
        };
        fileReader.readAsDataURL(file);
      });
  }

  private onDownloadFile(survey: Survey.SurveyModel, options: any): void {
    if (options.content.indexOf('base64') !== -1 || options.content.indexOf('http') !== -1) {
      options.callback('success', options.content);
      return;
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `${this.downloadService.baseUrl}/download/file/${options.content}`);
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('msal.idtoken')}`);
      xhr.onloadstart = () => {
        xhr.responseType = 'blob';
      };
      xhr.onload = () => {
        const file = new File([xhr.response], options.fileValue.name, { type: options.fileValue.type });
        const reader = new FileReader();
        reader.onload = (e) => {
          options.callback('success', e.target?.result);
        };
        reader.readAsDataURL(file);
      };
      xhr.send();
    }
  }
}
