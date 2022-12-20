import { Apollo } from 'apollo-angular';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as Survey from 'survey-core';
import {
  AddRecordMutationResponse,
  ADD_RECORD,
  EditRecordMutationResponse,
  EDIT_RECORD,
  UploadFileMutationResponse,
  UPLOAD_FILE,
} from './graphql/mutations';
import { Form } from '../../models/form.model';
import { Record } from '../../models/record.model';
import { SafeSnackBarService } from '../../services/snackbar/snackbar.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { SafeRestService } from '../../services/rest/rest.service';
import addCustomFunctions from '../../utils/custom-functions';
import { SafeAuthService } from '../../services/auth/auth.service';
import { SafeLayoutService } from '../../services/layout/layout.service';
import { SafeFormBuilderService } from '../../services/form-builder/form-builder.service';
import { SafeConfirmService } from '../../services/confirm/confirm.service';
import { SafeRecordHistoryComponent } from '../record-history/record-history.component';
import { TranslateService } from '@ngx-translate/core';

/**
 * This component is used to display forms
 */
@Component({
  selector: 'safe-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class SafeFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() form!: Form;
  @Input() record?: Record;
  @Output() save: EventEmitter<{
    completed: boolean;
    hideNewRecord?: boolean;
  }> = new EventEmitter();

  // === SURVEYJS ===
  public surveyModel!: Survey.Model;
  public surveyActive = true;
  public selectedTabIndex = 0;
  private pages = new BehaviorSubject<any[]>([]);
  private temporaryFilesStorage: any = {};

  environment: any;

  // === MODIFIED AT ===
  public modifiedAt: Date | null = null;

  // === LOCALE STORAGE ===
  private storageId = '';
  public storageDate?: Date;
  public isFromCacheData = false;

  /**
   * Getter for the pages of the form
   *
   * @returns the pages as an Observable
   */
  public get pages$(): Observable<any[]> {
    return this.pages.asObservable();
  }

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param environment This is the environment in which we run the application
   * @param dialog This is the Angular Material Dialog service.
   * @param apollo This is the Apollo client that is used to make GraphQL requests.
   * @param snackBar This is the service that allows you to show a snackbar message to the user.
   * @param restService This is a service that allows you to make http requests.
   * @param authService This is the service that handles authentication.
   * @param layoutService This is the service that will be used to create the layout of the form.
   * @param formBuilderService This is the service that will be used to build forms.
   * @param confirmService This is the service that will be used to display confirm window.
   * @param translate This is the service used to translate text
   */
  constructor(
    @Inject('environment') environment: any,
    public dialog: MatDialog,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private restService: SafeRestService,
    private authService: SafeAuthService,
    private layoutService: SafeLayoutService,
    private formBuilderService: SafeFormBuilderService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService
  ) {
    this.environment = environment;
  }

  ngOnInit(): void {
    const defaultThemeColorsSurvey = Survey.StylesManager.ThemeColors.default;
    defaultThemeColorsSurvey['$main-color'] = this.environment.theme.primary;
    defaultThemeColorsSurvey['$main-hover-color'] =
      this.environment.theme.primary;

    Survey.StylesManager.applyTheme();

    addCustomFunctions(Survey, this.authService, this.apollo, this.record);

    const structure = JSON.parse(this.form.structure || '');

    if (structure && !structure.completedHtml)
      structure.completedHtml = `<h3>${this.translate.instant(
        'components.form.display.submissionMessage'
      )}</h3>`;

    this.surveyModel = this.formBuilderService.createSurvey(
      JSON.stringify(structure),
      this.form.metadata,
      this.record
    );
    this.surveyModel.onClearFiles.add(
      (survey: Survey.SurveyModel, options: any) =>
        this.onClearFiles(survey, options)
    );
    this.surveyModel.onUploadFiles.add(
      (survey: Survey.SurveyModel, options: any) =>
        this.onUploadFiles(survey, options)
    );
    this.surveyModel.onDownloadFile.add(
      (survey: Survey.SurveyModel, options: any) =>
        this.onDownloadFile(survey, options)
    );
    this.surveyModel.onUpdateQuestionCssClasses.add(
      (survey: Survey.SurveyModel, options: any) => this.onSetCustomCss(options)
    );
    // Unset readOnly fields if it's the record creation
    if (!this.record) {
      this.form.fields?.forEach((field) => {
        if (field.readOnly) {
          this.surveyModel.getQuestionByName(field.name).readOnly = false;
        }
      });
    }

    // Fetch cached data from local storage
    this.storageId = `record:${this.record ? 'update' : ''}:${this.form.id}`;
    const storedData = localStorage.getItem(this.storageId);
    const cachedData = storedData ? JSON.parse(storedData).data : null;
    this.storageDate = storedData
      ? new Date(JSON.parse(storedData).date)
      : undefined;
    this.isFromCacheData = !!cachedData;
    if (this.isFromCacheData) {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.loadedFromCache', {
          type: this.translate.instant('common.record.one'),
        })
      );
    }

    if (cachedData) {
      this.surveyModel.data = cachedData;
    } else if (this.form.uniqueRecord && this.form.uniqueRecord.data) {
      this.surveyModel.data = this.form.uniqueRecord.data;
      this.modifiedAt = this.form.uniqueRecord.modifiedAt || null;
    } else if (this.record && this.record.data) {
      this.surveyModel.data = this.record.data;
      this.modifiedAt = this.record.modifiedAt || null;
    }

    // if (this.survey.getUsedLocales().length > 1) {
    //   this.survey.getUsedLocales().forEach((lang) => {
    //     const nativeName = (LANGUAGES as any)[lang].nativeName.split(',')[0];
    //     this.usedLocales.push({ value: lang, text: nativeName });
    //     this.dropdownLocales.push(nativeName);
    //   });
    // }

    this.surveyModel.focusFirstQuestionAutomatic = false;
    this.surveyModel.showNavigationButtons = false;
    this.setPages();
    this.surveyModel.onComplete.add(this.onComplete);
    this.surveyModel.showCompletedPage = false;
    if (!this.record && !this.form.canCreateRecords) {
      this.surveyModel.mode = 'display';
    }
    this.surveyModel.onCurrentPageChanged.add((survey: Survey.SurveyModel) => {
      survey.checkErrorsMode = survey.isLastPage ? 'onComplete' : 'onNextPage';
      this.selectedTabIndex = survey.currentPageNo;
    });
    this.surveyModel.onPageVisibleChanged.add(() => {
      this.setPages();
    });
    this.surveyModel.onSettingQuestionErrors.add(() => {
      this.setPages();
    });
    this.surveyModel.onValueChanged.add(this.valueChange.bind(this));

    // Sets default language as form language if it is in survey locales
    // const currentLang = this.usedLocales.find(
    //   (lang) => lang.value === this.translate.currentLang
    // );
    // if (currentLang) {
    //   this.setLanguage(currentLang.text);
    //   this.surveyLanguage = (LANGUAGES as any)[currentLang.value];
    // } else {
    //   this.survey.locale = this.translate.currentLang;
    // }
  }

  ngAfterViewInit(): void {
    // this.translate.onLangChange.subscribe(() => {
    //   const currentLang = this.usedLocales.find(
    //     (lang) => lang.value === this.translate.currentLang
    //   );
    //   if (currentLang && currentLang.text !== this.survey.locale) {
    //     this.setLanguage(currentLang.text);
    //     this.surveyLanguage = (LANGUAGES as any)[currentLang.value];
    //   } else if (
    //     !currentLang &&
    //     this.survey.locale !== this.translate.currentLang
    //   ) {
    //     this.survey.locale = this.translate.currentLang;
    //     this.surveyLanguage = (LANGUAGES as any).en;
    //     this.survey.render();
    //   }
    // });
    // setTimeout(() => {}, 100);
  }

  /**
   * Reset the survey to empty
   */
  public reset(): void {
    this.surveyModel.clear();
    this.temporaryFilesStorage = {};
    this.surveyModel.showCompletedPage = false;
    this.save.emit({ completed: false });
    this.surveyModel.render();
    setTimeout(() => {}, 100);
    this.surveyActive = true;
  }

  /**
   * Handles the value change event when the user completes the survey
   */
  public valueChange(): void {
    localStorage.setItem(
      this.storageId,
      JSON.stringify({ data: this.surveyModel.data, date: new Date() })
    );
  }

  /**
   * Calls the complete method of the survey if no error.
   */
  public submit(): void {
    if (!this.surveyModel?.hasErrors()) {
      this.surveyModel?.completeLastPage();
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant('models.form.notifications.savingFailed'),
        { error: true }
      );
    }
  }

  /**
   * Creates the record when it is complete, or update it if provided.
   */
  public onComplete = async () => {
    let mutation: any;
    this.surveyActive = false;
    const data = this.surveyModel.data;
    const questionsToUpload = Object.keys(this.temporaryFilesStorage);
    for (const name of questionsToUpload) {
      const files = this.temporaryFilesStorage[name];
      for (const [index, file] of files.entries()) {
        const res = await this.apollo
          .mutate<UploadFileMutationResponse>({
            mutation: UPLOAD_FILE,
            variables: {
              file,
              form: this.form.id,
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
    const questions = this.surveyModel.getAllQuestions();
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
    this.surveyModel.data = data;
    if (this.record || this.form.uniqueRecord) {
      const recordId = this.record
        ? this.record.id
        : this.form.uniqueRecord?.id;
      mutation = this.apollo.mutate<EditRecordMutationResponse>({
        mutation: EDIT_RECORD,
        variables: {
          id: recordId,
          data: this.surveyModel.data,
          template:
            this.form.id !== this.record?.form?.id ? this.form.id : null,
        },
      });
    } else {
      mutation = this.apollo.mutate<AddRecordMutationResponse>({
        mutation: ADD_RECORD,
        variables: {
          form: this.form.id,
          data: this.surveyModel.data,
        },
      });
    }
    mutation.subscribe((res: any) => {
      if (res.errors) {
        this.save.emit({ completed: false });
        this.surveyModel.clear(false, true);
        this.surveyActive = true;
        this.snackBar.openSnackBar(res.errors[0].message, { error: true });
      } else {
        localStorage.removeItem(this.storageId);
        if (res.data.editRecord || res.data.addRecord.form.uniqueRecord) {
          this.surveyModel.clear(false, false);
          if (res.data.addRecord) {
            this.record = res.data.addRecord;
            this.modifiedAt = this.record?.modifiedAt || null;
          } else {
            this.modifiedAt = res.data.editRecord.modifiedAt;
          }
          this.surveyActive = true;
        } else {
          this.surveyModel.showCompletedPage = true;
        }
        this.save.emit({
          completed: true,
          hideNewRecord:
            res.data.addRecord && res.data.addRecord.form.uniqueRecord,
        });
      }
    });
  };

  /**
   * Handles the clear files event
   *
   * @param survey The survey in which the files were cleared
   * @param options Options regarding the clearing of the files
   */
  private onClearFiles(survey: Survey.SurveyModel, options: any): void {
    options.callback('success');
  }

  /**
   * Handles the upload of files event
   *
   * @param survey The survey to which the files were added
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
      fileReader.onload = () => {
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
   * Handles the dowload of files event
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
        `${this.restService.apiUrl}/download/file/${options.content}`
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
   * Add custom CSS classes to the survey elements.
   *
   * @param options survey options.
   */
  private onSetCustomCss(options: any): void {
    const classes = options.cssClasses;
    classes.content += 'safe-qst-content';
  }

  /**
   * Set the pages for the survey
   */
  private setPages(): void {
    const pages = [];
    if (this.surveyModel) {
      for (const page of this.surveyModel.pages) {
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
   * @param i Index of the page
   */
  public onShowPage(i: number): void {
    if (this.surveyModel) {
      this.surveyModel.currentPageNo = i;
    }
    // if (this.survey.compareTo) {
    //   this.survey.currentPageNo = i;
    // }
    this.selectedTabIndex = i;
  }

  /**
   * Closes the survey and empties the temporary and local storage
   */
  public onClear(): void {
    // If unicity of records is set up, do not clear but go back to latest saved version
    if (this.form.uniqueRecord && this.form.uniqueRecord.data) {
      this.surveyModel.data = this.form.uniqueRecord.data;
      this.modifiedAt = this.form.uniqueRecord.modifiedAt || null;
    } else {
      this.surveyModel.clear();
    }
    this.temporaryFilesStorage = {};
    localStorage.removeItem(this.storageId);
    this.isFromCacheData = false;
    this.storageDate = undefined;
    this.surveyModel.render();
    setTimeout(() => {}, 100);
  }

  ngOnDestroy(): void {
    localStorage.removeItem(this.storageId);
  }

  /**
   * Open a dialog modal to confirm the recovery of data
   *
   * @param record The record whose data we need to recover
   * @param version The version to recover
   */
  private confirmRevertDialog(record: any, version: any): void {
    // eslint-disable-next-line radix
    const date = new Date(parseInt(version.createdAt, 0));
    const formatDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('components.record.recovery.title'),
      content: this.translate.instant(
        'components.record.recovery.confirmationMessage',
        { date: formatDate }
      ),
      confirmText: this.translate.instant('components.confirmModal.confirm'),
      confirmColor: 'primary',
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
          .subscribe(() => {
            this.layoutService.setRightSidenav(null);
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.dataRecovered')
            );
          });
      }
    });
  }

  /**
   * Opens the history of the record on the right side of the screen.
   */
  public onShowHistory(): void {
    if (this.record) {
      this.layoutService.setRightSidenav({
        component: SafeRecordHistoryComponent,
        inputs: {
          id: this.record.id,
          revert: (version: any) =>
            this.confirmRevertDialog(this.record, version),
        },
      });
    }
  }
}
