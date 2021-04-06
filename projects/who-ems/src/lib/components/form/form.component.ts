import { Apollo } from 'apollo-angular';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import * as Survey from 'survey-angular';
import { AddRecordMutationResponse, ADD_RECORD, EditRecordMutationResponse, EDIT_RECORD, UploadFileMutationResponse, UPLOAD_FILE } from '../../graphql/mutations';
import { Form } from '../../models/form.model';
import { Record } from '../../models/record.model';
import { FormService } from '../../services/form.service';
import { WhoFormModalComponent } from '../form-modal/form-modal.component';
import { WhoSnackBarService } from '../../services/snackbar.service';
import { LANGUAGES } from '../../utils/languages';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WhoWorkflowService } from '../../services/workflow.service';
import { WhoDownloadService } from '../../services/download.service';

@Component({
  selector: 'who-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class WhoFormComponent implements OnInit, OnDestroy {

  @Input() form: Form;
  @Input() record: Record;
  @Output() save: EventEmitter<boolean> = new EventEmitter();

  // === SURVEYJS ===
  public survey: Survey.Model;
  public surveyLanguage = 'en';
  public usedLocales: Array<{ text: string, value: string }> = [];
  public dropdownLocales = [];
  public surveyActive = true;
  public selectedTabIndex: number;
  private temporaryFilesStorage = {};

  // === SURVEY COLORS ===
  primaryColor = '#008DC9';

  // === MODIFIED AT ===
  public modifiedAt: Date;

  // === PASS RECORDS FROM WORKFLOW ===
  private isStep: boolean;
  private recordsSubscription: Subscription;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private formService: FormService,
    private snackBar: WhoSnackBarService,
    private router: Router,
    private workflowService: WhoWorkflowService,
    private downloadService: WhoDownloadService
  ) { }

  ngOnInit(): void {
    const defaultThemeColorsSurvey = Survey
      .StylesManager
      .ThemeColors.default;
    defaultThemeColorsSurvey['$main-color'] = this.primaryColor;
    defaultThemeColorsSurvey['$main-hover-color'] = this.primaryColor;

    Survey
      .StylesManager
      .applyTheme();

    const structure = JSON.parse(this.form.structure);
    this.survey = new Survey.Model(JSON.stringify(structure));
    this.survey.onClearFiles.add((survey, options) => {
      options.callback('success');
    });
    this.survey.onUploadFiles.add((survey, options) => {
      if (this.temporaryFilesStorage[options.name] !== undefined) {
        this.temporaryFilesStorage[options.name].concat(options.files);
      } else {
        this.temporaryFilesStorage[options.name] = options.files;
      }
      const question = survey.getQuestionByName(options.name);
      let content = [];
      options
        .files
        .forEach((file) => {
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
    });
    this.survey.onDownloadFile.add((survey, options) => {
      if (options.content.indexOf('base64') !== -1 || options.content.indexOf('http') !== -1) {
        options.callback('success', options.content);
        return;
      }
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `${this.downloadService.baseUrl}/download/file/${options.content}`);
      xhr.onloadstart = (ev) => {
        xhr.responseType = 'blob';
      };
      xhr.onload = () => {
        const file = new File([xhr.response], options.fileValue.name, { type: options.fileValue.type });
        const reader = new FileReader();
        reader.onload = (e) => {
          options.callback('success', e.target.result);
        };
        reader.readAsDataURL(file);
      };
    });

    // Unset readOnly fields if it's the record creation
    if (!this.record) {
      for (const field of this.form.fields) {
        if (field.readOnly) {
          this.survey.getQuestionByName(field.name).readOnly = false;
        }
      }
    }

    // Fetch cached data from local storage
    let cachedData = JSON.parse(localStorage.getItem(`record:${this.form.id}`));

    this.isStep = this.router.url.includes('/workflow/');
    if (this.isStep) {
      this.recordsSubscription = this.workflowService.records.subscribe(records => {
        if (records) {
          const mergedRecord = records[0];
          cachedData = mergedRecord.data;
          const resourcesField = this.form.fields.find(x => x.type === 'resources');
          if (resourcesField && resourcesField.resource === mergedRecord.form.resource.id) {
            cachedData[resourcesField.name] = records.map(x => x.id);
          } else {
            this.snackBar.openSnackBar('Selected records do not match with any fields from this form', { error: true });
          }
        }
      });
    }

    if (this.form.uniqueRecord && this.form.uniqueRecord.data) {
      this.survey.data = this.form.uniqueRecord.data;
      this.modifiedAt = this.form.uniqueRecord.modifiedAt;
    } else {
      if (cachedData) {
        this.survey.data = cachedData;
      } else {
        if (this.record && this.record.data) {
          this.survey.data = this.record.data;
          this.modifiedAt = this.record.modifiedAt;
        }
      }
    }

    if (this.survey.getUsedLocales().length > 1) {
      this.survey.getUsedLocales().forEach(lang => {
        const nativeName = LANGUAGES[lang].nativeName.split(',')[0];
        this.usedLocales.push({ value: lang, text: nativeName });
        this.dropdownLocales.push(nativeName);
      });
    }

    if (navigator.language) {
      const clientLanguage = navigator.language.substring(0, 2);
      const code = this.survey.getUsedLocales().includes(clientLanguage) ? clientLanguage : 'en';
      this.surveyLanguage = LANGUAGES[code];
      this.survey.locale = code;
    } else {
      this.survey.locale = this.surveyLanguage;
    }

    this.survey.render('surveyContainer');
    this.survey.onComplete.add(this.complete);
    this.survey.showCompletedPage = false;
    if (!this.record && !this.form.canCreateRecords) {
      this.survey.mode = 'display';
    }
    this.survey.onCurrentPageChanged.add((surveyModel, options) => {
      this.selectedTabIndex = surveyModel.currentPageNo;
    });
    this.survey.onValueChanged.add(this.valueChange.bind(this));
  }

  public reset(): void {
    this.survey.clear();
    this.temporaryFilesStorage = {};
    this.survey.showCompletedPage = false;
    this.save.emit(false);
    this.survey.render();
    this.surveyActive = true;
  }

  public valueChange(): void {
    localStorage.setItem(`record:${this.form.id}`, JSON.stringify(this.survey.data));
  }

  /*  Custom SurveyJS method, save a new record or edit existing one.
  */
  public complete = async () => {
    let mutation: any;
    this.surveyActive = false;
    const data = this.survey.data;
    const questionsToUpload = Object.keys(this.temporaryFilesStorage);
    for (const name of questionsToUpload) {
      const files = this.temporaryFilesStorage[name];
      for (const [index, file] of files.entries()) {
        const res = await this.apollo.mutate<UploadFileMutationResponse>({
          mutation: UPLOAD_FILE,
          variables: {
            file,
            form: this.form.id
          },
          context: {
            useMultipart: true
          }
        }).toPromise();
        if (res.errors) {
          this.snackBar.openSnackBar('Upload failed.', { error: true });
        } else {
          data[name][index].content = res.data.uploadFile;
        }
      }
    }
    const questions = this.survey.getAllQuestions();
    for (const field in questions) {
      if (questions[field]) {
        const key = questions[field].getValueName();
        if (!data[key] && questions[field].getType() !== 'boolean') { data[key] = null; }
      }
    }
    this.survey.data = data;
    if (this.record || this.form.uniqueRecord) {
      const recordId = this.record ? this.record.id : this.form.uniqueRecord.id;
      mutation = this.apollo.mutate<EditRecordMutationResponse>({
        mutation: EDIT_RECORD,
        variables: {
          id: recordId,
          data: this.survey.data
        }
      });
    } else {
      mutation = this.apollo.mutate<AddRecordMutationResponse>({
        mutation: ADD_RECORD,
        variables: {
          form: this.form.id,
          data: this.survey.data
        }
      });
    }
    mutation.subscribe((res) => {
      if (res.errors) {
        this.save.emit(false);
        this.survey.clear(false, true);
        this.surveyActive = true;
        this.snackBar.openSnackBar(res.errors[0].message, { error: true });
      } else {
        localStorage.removeItem(`record:${this.form.id}`);
        if (res.data.editRecord || res.data.addRecord.form.uniqueRecord) {
          this.survey.clear(false, true);
          if (res.data.addRecord) {
            this.record = res.data.addRecord;
            this.modifiedAt = this.record.modifiedAt;
          } else {
            this.modifiedAt = res.data.editRecord.modifiedAt;
          }
          this.surveyActive = true;
        } else {
          this.survey.showCompletedPage = true;
        }
        if (this.form.uniqueRecord) {
          this.selectedTabIndex = 0;
        }
        this.save.emit(true);
      }
    });
  }

  /*  Event listener to trigger embedded forms.
  */
  @HostListener('document:openForm', ['$event'])
  onOpenEmbeddedForm(event: any): void {
    const dialogRef = this.dialog.open(WhoFormModalComponent, {
      data: {
        template: event.detail.template,
        locale: event.locale
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const e = new CustomEvent('saveResourceFromEmbed', { detail: { resource: res.data, template: res.template } });
        document.dispatchEvent(e);
      }
    });
  }

  /* Change language of the form.
  */
  setLanguage(ev: string): void {
    this.survey.locale = this.usedLocales.filter(locale => locale.text === ev)[0].value;
  }

  public onShowPage(i: number): void {
    this.survey.currentPageNo = i;
    this.selectedTabIndex = i;
    if (this.survey.compareTo) {
      this.survey.currentPageNo = i;
    }
  }

  ngOnDestroy(): void {
    if (this.recordsSubscription) {
      this.recordsSubscription.unsubscribe();
      this.workflowService.storeRecords(null);
    }
  }
}
