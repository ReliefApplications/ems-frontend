import { Apollo } from 'apollo-angular';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import {
  GetFormByIdQueryResponse,
  GetRecordByIdQueryResponse,
  GET_RECORD_BY_ID,
  GET_FORM_BY_ID,
  GetRecordDetailsQueryResponse,
  GET_RECORD_DETAILS,
} from '../../graphql/queries';
import { Form } from '../../models/form.model';
import { Record } from '../../models/record.model';
import * as Survey from 'survey-angular';
import {
  EditRecordMutationResponse,
  EDIT_RECORD,
  AddRecordMutationResponse,
  ADD_RECORD,
  UploadFileMutationResponse,
  UPLOAD_FILE,
  EDIT_RECORDS,
  EditRecordsMutationResponse,
} from '../../graphql/mutations';
import { v4 as uuidv4 } from 'uuid';
import { SafeConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import addCustomFunctions from '../../utils/custom-functions';
import { SafeSnackBarService } from '../../services/snackbar.service';
import { SafeDownloadService } from '../../services/download.service';
import { SafeAuthService } from '../../services/auth.service';
import { SafeFormBuilderService } from '../../services/form-builder.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { NOTIFICATIONS } from '../../const/notifications';
import { RecordHistoryModalComponent } from '../record-history-modal/record-history-modal.component';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import { TranslateService } from '@ngx-translate/core';

/**
 * Interface of Dialog data.
 */
interface DialogData {
  template?: string;
  recordId?: string | [];
  locale?: string;
  prefillRecords?: Record[];
  prefillData?: any;
  askForConfirm?: boolean;
}
/**
 * Defines the default Dialog data
 */
const DEFAULT_DIALOG_DATA = { askForConfirm: true };

/**
 * Component that displays a form in a modal
 */
@Component({
  selector: 'safe-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss'],
})
export class SafeFormModalComponent implements OnInit {
  // === DATA ===
  public loading = true;
  public form?: Form;
  public record?: Record;

  public containerId: string;
  public modifiedAt: Date | null = null;

  private isMultiEdition = false;
  private storedMergedData: any;

  public survey?: Survey.Model;
  public selectedTabIndex = 0;
  private pages = new BehaviorSubject<any[]>([]);
  private temporaryFilesStorage: any = {};

  environment: any;

  /**
   * Getter for the pages property
   *
   * @returns pages as an Observable
   */
  public get pages$(): Observable<any[]> {
    return this.pages.asObservable();
  }

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param data This is the data that is passed to the modal when it is opened.
   * @param environment This is the environment in which we run the application
   * @param dialog This is the Angular Material Dialog service.
   * @param dialogRef This is the reference to the dialog.
   * @param apollo This is the Apollo client that we'll use to make GraphQL requests.
   * @param snackBar This is the service that allows you to display a snackbar.
   * @param downloadService This is the service that is used to download files.
   * @param authService This is the service that handles authentication.
   * @param formBuilderService This is the service that will be used to build forms.
   * @param translate This is the service that allows us to translate the text in our application.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    @Inject('environment') environment: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SafeFormModalComponent>,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private downloadService: SafeDownloadService,
    private authService: SafeAuthService,
    private formBuilderService: SafeFormBuilderService,
    private translate: TranslateService
  ) {
    this.containerId = uuidv4();
    this.environment = environment;
  }

  async ngOnInit(): Promise<void> {
    this.data = { ...DEFAULT_DIALOG_DATA, ...this.data };
    const defaultThemeColorsSurvey = Survey.StylesManager.ThemeColors.default;
    defaultThemeColorsSurvey['$main-color'] = this.environment.theme.primary;
    defaultThemeColorsSurvey['$main-hover-color'] =
      this.environment.theme.primary;

    Survey.StylesManager.applyTheme();

    this.isMultiEdition = Array.isArray(this.data.recordId);
    const promises: Promise<
      GetFormByIdQueryResponse | GetRecordByIdQueryResponse | void
    >[] = [];
    if (this.data.recordId) {
      const id = this.isMultiEdition
        ? this.data.recordId[0]
        : this.data.recordId;
      promises.push(
        this.apollo
          .query<GetRecordByIdQueryResponse>({
            query: GET_RECORD_BY_ID,
            variables: {
              id,
            },
          })
          .toPromise()
          .then((res) => {
            this.record = res.data.record;
            this.modifiedAt = this.isMultiEdition
              ? null
              : this.record.modifiedAt || null;
            if (!this.data.template) {
              this.form = this.record.form;
            }
          })
      );
    }

    if (!this.data.recordId || this.data.template) {
      promises.push(
        this.apollo
          .query<GetFormByIdQueryResponse>({
            query: GET_FORM_BY_ID,
            variables: {
              id: this.data.template,
            },
          })
          .toPromise()
          .then((res) => {
            this.form = res.data.form;
            if (this.data.prefillData) {
              this.storedMergedData = this.data.prefillData;
            }
            if (
              this.data.prefillRecords &&
              this.data.prefillRecords.length > 0
            ) {
              this.storedMergedData = this.mergedData(this.data.prefillRecords);
              const resId = this.data.prefillRecords[0].form?.resource?.id;
              const resourcesField = this.form.fields?.find(
                (x) => x.type === 'resources' && x.resource === resId
              );
              if (resourcesField) {
                this.storedMergedData[resourcesField.name] =
                  this.data.prefillRecords.map((x) => x.id);
              } else {
                this.snackBar.openSnackBar(NOTIFICATIONS.recordDoesNotMatch, {
                  error: true,
                });
              }
            }
          })
      );
    }
    await Promise.all(promises);
    this.initSurvey();
    this.loading = false;
  }

  /**
   * Initializes the form
   */
  private initSurvey(): void {
    this.survey = this.formBuilderService.createSurvey(
      this.form?.structure || ''
    );
    this.survey.onClearFiles.add((survey: Survey.SurveyModel, options: any) =>
      this.onClearFiles(survey, options)
    );
    this.survey.onUploadFiles.add((survey: Survey.SurveyModel, options: any) =>
      this.onUploadFiles(survey, options)
    );
    this.survey.onDownloadFile.add((survey: Survey.SurveyModel, options: any) =>
      this.onDownloadFile(survey, options)
    );
    this.survey.onUpdateQuestionCssClasses.add(
      (survey: Survey.SurveyModel, options: any) => this.onSetCustomCss(options)
    );
    this.survey.onCurrentPageChanged.add(
      (survey: Survey.SurveyModel, options: any) => {
        survey.checkErrorsMode = survey.isLastPage
          ? 'onComplete'
          : 'onNextPage';
        this.selectedTabIndex = survey.currentPageNo;
      }
    );
    this.survey.onPageVisibleChanged.add(() => {
      this.setPages();
    });
    this.survey.onSettingQuestionErrors.add(
      (survey: Survey.SurveyModel, options: any) => {
        this.setPages();
      }
    );
    this.survey.locale = this.data.locale ? this.data.locale : 'en';
    if (this.data.recordId && this.record) {
      addCustomFunctions(Survey, this.authService, this.apollo, this.record);
      this.survey.data = this.isMultiEdition ? null : this.record.data;
      this.survey.showCompletedPage = false;
    }
    if (this.storedMergedData) {
      this.survey.data = {
        ...this.survey.data,
        ...omitBy(this.storedMergedData, isNil),
      };
    }
    this.survey.showNavigationButtons = false;
    this.survey.render(this.containerId);
    this.setPages();
    this.survey.onComplete.add(this.onComplete);
    setTimeout(() => {}, 100);
  }

  /**
   * Calls the complete method of the survey if no error.
   */
  public submit(): void {
    if (!this.survey?.hasErrors()) {
      this.survey?.completeLastPage();
    } else {
      this.snackBar.openSnackBar(
        'Saving failed, some fields require your attention.',
        { error: true }
      );
    }
  }

  /**
   * Creates the record, or update it if provided.
   *
   * @param survey Survey instance.
   */
  public onComplete = (survey: any) => {
    this.survey?.clear(false);
    const rowsSelected = Array.isArray(this.data.recordId)
      ? this.data.recordId.length
      : 1;

    /** we can send to backend empty data if they are not required */
    const questions = survey.getAllQuestions();
    const data = survey.data;
    for (const field in questions) {
      if (questions[field]) {
        const key = questions[field].getValueName();
        if (!data[key]) {
          if (questions[field].getType() !== 'boolean') {
            data[key] = null;
          }
          if (questions[field].readOnly || !questions[field].visible) {
            delete data[key];
          }
        }
      }
    }
    survey.data = data;
    // Displays confirmation modal.
    if (this.data.askForConfirm) {
      const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
        data: {
          title: this.translate.instant('common.updateObject', {
            name:
              rowsSelected > 1
                ? this.translate.instant('common.row.few')
                : this.translate.instant('common.row.one'),
          }),
          content: this.translate.instant(
            'components.form.updateRow.confirmationMessage',
            {
              quantity: rowsSelected,
              rowText:
                rowsSelected > 1
                  ? this.translate.instant('common.row.few')
                  : this.translate.instant('common.row.one'),
            }
          ),
          confirmText: this.translate.instant(
            'components.confirmModal.confirm'
          ),
          confirmColor: 'primary',
        },
      });
      dialogRef.afterClosed().subscribe(async (value) => {
        if (value) {
          await this.onUpdate(survey);
        }
      });
      // Updates the data directly.
    } else {
      this.onUpdate(survey);
    }
  };

  /**
   * Handles update data event.
   *
   * @param survey current survey
   */
  public async onUpdate(survey: any): Promise<void> {
    if (this.data.recordId) {
      await this.uploadFiles(survey);
      if (this.isMultiEdition) {
        this.updateMultipleData(this.data.recordId, survey);
      } else {
        this.updateData(this.data.recordId, survey);
      }
    } else {
      await this.uploadFiles(survey);
      this.apollo
        .mutate<AddRecordMutationResponse>({
          mutation: ADD_RECORD,
          variables: {
            form: this.data.template,
            data: survey.data,
          },
        })
        .subscribe((res) => {
          if (res.errors) {
            this.snackBar.openSnackBar(`Error. ${res.errors[0].message}`, {
              error: true,
            });
            this.dialogRef.close();
          } else {
            this.dialogRef.close({
              template: this.data.template,
              data: res.data?.addRecord,
            });
          }
        });
    }
    survey.showCompletedPage = true;
  }

  /**
   * Updates a specific record.
   *
   * @param id record id.
   * @param survey current survey.
   */
  public updateData(id: any, survey: any): void {
    this.apollo
      .mutate<EditRecordMutationResponse>({
        mutation: EDIT_RECORD,
        variables: {
          id,
          data: survey.data,
          template: this.data.template,
        },
      })
      .subscribe((res) => {
        if (res.data) {
          this.dialogRef.close({
            template: this.form?.id,
            data: res.data.editRecord,
          });
        }
      });
  }

  /**
   * Updates multiple records.
   *
   * @param ids list of record ids.
   * @param survey current survey.
   */
  public updateMultipleData(ids: any, survey: any): void {
    this.apollo
      .mutate<EditRecordsMutationResponse>({
        mutation: EDIT_RECORDS,
        variables: {
          ids,
          data: survey.data,
          template: this.data.template,
        },
      })
      .subscribe((res) => {
        if (res.data) {
          this.dialogRef.close({
            template: this.form?.id,
            data: res.data.editRecords,
          });
        }
      });
  }

  /**
   * Upload asynchronously files to create questions in the form
   *
   * @param survey The form in which the files will be updated
   */
  private async uploadFiles(survey: any): Promise<void> {
    const data = survey.data;
    const questionsToUpload = Object.keys(this.temporaryFilesStorage);
    for (const name of questionsToUpload) {
      const files = this.temporaryFilesStorage[name];
      for (const [index, file] of files.entries()) {
        const res = await this.apollo
          .mutate<UploadFileMutationResponse>({
            mutation: UPLOAD_FILE,
            variables: {
              file,
              form: this.form?.id,
            },
            context: {
              useMultipart: true,
            },
          })
          .toPromise();
        if (res.errors) {
          this.snackBar.openSnackBar(res.errors[0].message, { error: true });
          return;
        } else {
          data[name][index].content = res.data?.uploadFile;
        }
      }
    }
  }

  /**
   * Handles the clearing of files
   *
   * @param survey The form in which there used to be files
   * @param options Options regarding the files
   */
  private onClearFiles(survey: Survey.SurveyModel, options: any): void {
    options.callback('success');
  }

  /**
   * Handles the uploading of files event
   *
   * @param survey The survey to which the files were uploaded
   * @param options Options regarding the upload
   */
  private onUploadFiles(survey: Survey.SurveyModel, options: any): void {
    if (this.temporaryFilesStorage[options.name] !== undefined) {
      this.temporaryFilesStorage[options.name].concat(options.files);
    } else {
      this.temporaryFilesStorage[options.name] = options.files;
    }
    let content: any[] = [];
    options.files.forEach((file: any) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        content = content.concat([
          {
            name: file.name,
            type: file.type,
            content: fileReader.result,
            file,
          },
        ]);
        if (content.length === options.files.length) {
          options.callback(
            'success',
            content.map((fileContent) => ({
              file: fileContent.file,
              content: fileContent.content,
            }))
          );
        }
      };
      fileReader.readAsDataURL(file);
    });
  }

  /**
   * Set the pages of the form
   */
  private setPages(): void {
    const pages = [];
    if (this.survey) {
      for (const page of this.survey.pages) {
        if (page.isVisible) {
          pages.push(page);
        }
      }
    }
    this.pages.next(pages);
  }

  /**
   * Handles the show page event
   *
   * @param i The index of the page
   */
  public onShowPage(i: number): void {
    if (this.survey) {
      this.survey.currentPageNo = i;
    }
    this.selectedTabIndex = i;
  }

  /**
   * Handles the downloading of a file event
   *
   * @param survey The survey from which the files were downloaded
   * @param options Options regarding the download
   */
  private onDownloadFile(survey: Survey.SurveyModel, options: any): void {
    if (
      options.content.indexOf('base64') !== -1 ||
      options.content.indexOf('http') !== -1
    ) {
      options.callback('success', options.content);
      return;
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open(
        'GET',
        `${this.downloadService.baseUrl}/download/file/${options.content}`
      );
      xhr.setRequestHeader(
        'Authorization',
        `Bearer ${localStorage.getItem('idtoken')}`
      );
      xhr.onloadstart = () => {
        xhr.responseType = 'blob';
      };
      xhr.onload = () => {
        const file = new File([xhr.response], options.fileValue.name, {
          type: options.fileValue.type,
        });
        const reader = new FileReader();
        reader.onload = (e) => {
          options.callback('success', e.target?.result);
        };
        reader.readAsDataURL(file);
      };
      xhr.send();
    }
  }

  /**
   * Merge records
   *
   * @param records Records to merge
   * @returns The merged records
   */
  private mergedData(records: Record[]): any {
    const data: any = {};
    // Loop on source fields
    for (const inputField of records[0].form?.fields || []) {
      // If source field match with target field
      if (this.form?.fields?.some((x) => x.name === inputField.name)) {
        const targetField = this.form?.fields?.find(
          (x) => x.name === inputField.name
        );
        // If source field got choices
        if (inputField.choices || inputField.choicesByUrl) {
          // If the target has multiple choices we concatenate all the source values
          if (
            targetField.type === 'tagbox' ||
            targetField.type === 'checkbox'
          ) {
            if (
              inputField.type === 'tagbox' ||
              targetField.type === 'checkbox'
            ) {
              data[inputField.name] = records.reduce(
                (o: string[], record: Record) => {
                  o = o.concat(record.data[inputField.name]);
                  return o;
                },
                []
              );
            } else {
              data[inputField.name] = records.map(
                (x) => x.data[inputField.name]
              );
            }
          }
          // If the target has single choice we we put the common choice if any or leave it empty
          else {
            if (
              !records.some(
                (x) =>
                  x.data[inputField.name] !== records[0].data[inputField.name]
              )
            ) {
              data[inputField.name] = records[0].data[inputField.name];
            }
          }
        }
        // If source field is a free input and types are matching between source and target field
        else if (inputField.type === targetField.type) {
          // If type is text just put the text of the first record
          if (inputField.type === 'text') {
            data[inputField.name] = records[0].data[inputField.name];
          }
          // If type is different from text and there is a common value, put it. Otherwise leave empty
          else {
            if (
              !records.some(
                (x) =>
                  x.data[inputField.name] !== records[0].data[inputField.name]
              )
            ) {
              data[inputField.name] = records[0].data[inputField.name];
            }
          }
        }
      }
    }
    return data;
  }

  /**
   * Add custom CSS classes to the survey elements.
   *
   * @param options survey options.
   */
  private onSetCustomCss(options: any): void {
    const classes = options.cssClasses;
    classes.content += 'safe-qst-content';
  }

  /**
   * Closes the modal without sending any data.
   */
  onClose(): void {
    // TODO: we should compare the data with init data to display a confirm modal
    // if (!isEqual(this.survey?.data, this.initData)) {
    //   const closeDialogRef = this.dialog.open(SafeConfirmModalComponent, {
    //     data: {
    //       title: 'Confirm',
    //       content: 'Record has been modified. You can cancel to continue editing, or discard you changes.',
    //       confirmText: 'Discard changes',
    //       confirmColor: 'primary'
    //     }
    //   });
    //   closeDialogRef.afterClosed().subscribe((value) => {
    //     if(value){
    //       this.dialogRef.close();
    //     }
    //   });
    // } else {
    //   this.dialogRef.close();
    // }
    this.dialogRef.close();
  }

  /**
   * Opens the history of the record in a modal.
   */
  public onShowHistory(): void {
    this.apollo
      .query<GetRecordDetailsQueryResponse>({
        query: GET_RECORD_DETAILS,
        variables: {
          id: this.record?.id,
        },
      })
      .subscribe((res) => {
        this.dialog.open(RecordHistoryModalComponent, {
          data: {
            record: res.data.record,
            revert: (item: any, dialog: any) => {
              this.confirmRevertDialog(res.data.record, item);
            },
          },
          panelClass: 'no-padding-dialog',
          autoFocus: false,
        });
      });
  }

  /**
   * Open a dialog modal to confirm the recovery of data
   *
   * @param record The record whose data we need to recover
   * @param version The version to recover
   */
  private confirmRevertDialog(record: any, version: any): void {
    // eslint-disable-next-line radix
    const date = new Date(parseInt(version.created, 0));
    const formatDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: this.translate.instant(
          'components.record.recovery.titleMessage'
        ),
        content: this.translate.instant(
          'components.record.recovery.confirmationMessage',
          { date: formatDate }
        ),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmColor: 'primary',
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.apollo
          .mutate<EditRecordMutationResponse>({
            mutation: EDIT_RECORD,
            variables: {
              id: record.id,
              version: version.id,
            },
          })
          .subscribe((res) => {
            this.snackBar.openSnackBar(NOTIFICATIONS.dataRecovered);
            this.dialog.closeAll();
          });
      }
    });
  }
}
