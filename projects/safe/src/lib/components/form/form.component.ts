import { Apollo } from 'apollo-angular';
import {
  AfterViewInit,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as Survey from 'survey-angular';
import { v4 as uuidv4 } from 'uuid';
import {
  AddRecordMutationResponse,
  ADD_RECORD,
  EditRecordMutationResponse,
  EDIT_RECORD,
  UploadFileMutationResponse,
  UPLOAD_FILE,
} from '../../graphql/mutations';
import { Form } from '../../models/form.model';
import { Record } from '../../models/record.model';
import { SafeSnackBarService } from '../../services/snackbar.service';
import { LANGUAGES } from '../../utils/languages';
import { BehaviorSubject, Observable } from 'rxjs';
import { SafeDownloadService } from '../../services/download.service';
import addCustomFunctions from '../../utils/custom-functions';
import { SafeAuthService } from '../../services/auth.service';
import {
  GET_RECORD_DETAILS,
  GetRecordDetailsQueryResponse,
} from '../../graphql/queries';
import { SafeLayoutService } from '../../services/layout.service';
import { SafeFormBuilderService } from '../../services/form-builder.service';
import { SafeConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { SafeRecordHistoryComponent } from '../record-history/record-history.component';
import { TranslateService } from '@ngx-translate/core';

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
  public survey!: Survey.Model;
  public surveyLanguage: { name: string; nativeName: string } = {
    name: 'English',
    nativeName: 'English',
  };
  public usedLocales: Array<{ text: string; value: string }> = [];
  public dropdownLocales: any[] = [];
  public surveyActive = true;
  public selectedTabIndex = 0;
  private pages = new BehaviorSubject<any[]>([]);
  private temporaryFilesStorage: any = {};
  public containerId: string;

  environment: any;

  // === MODIFIED AT ===
  public modifiedAt: Date | null = null;

  // === LOCALE STORAGE ===
  private storageId = '';
  public storageDate?: Date;
  public isFromCacheData = false;

  // === HISTORY COMPONENT TO BE INJECTED IN LAYOUT SERVICE ===
  public factory?: ComponentFactory<any>;

  public get pages$(): Observable<any[]> {
    return this.pages.asObservable();
  }

  constructor(
    @Inject('environment') environment: any,
    public dialog: MatDialog,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private downloadService: SafeDownloadService,
    private authService: SafeAuthService,
    private layoutService: SafeLayoutService,
    private resolver: ComponentFactoryResolver,
    private formBuilderService: SafeFormBuilderService,
    private translate: TranslateService
  ) {
    this.containerId = uuidv4();
    this.environment = environment;
  }

  ngOnInit(): void {
    this.factory = this.resolver.resolveComponentFactory(
      SafeRecordHistoryComponent
    );
    const defaultThemeColorsSurvey = Survey.StylesManager.ThemeColors.default;
    defaultThemeColorsSurvey['$main-color'] = this.environment.theme.primary;
    defaultThemeColorsSurvey['$main-hover-color'] =
      this.environment.theme.primary;

    Survey.StylesManager.applyTheme();

    Survey.StylesManager.findSheet('default');

    addCustomFunctions(Survey, this.authService, this.apollo, this.record);

    const structure = JSON.parse(this.form.structure || '');
    this.survey = this.formBuilderService.createSurvey(
      JSON.stringify(structure)
    );
    this.survey.onClearFiles.add((survey, options) =>
      this.onClearFiles(survey, options)
    );
    this.survey.onUploadFiles.add((survey, options) =>
      this.onUploadFiles(survey, options)
    );
    this.survey.onDownloadFile.add((survey, options) =>
      this.onDownloadFile(survey, options)
    );
    this.survey.onUpdateQuestionCssClasses.add((_, options) =>
      this.onSetCustomCss(options)
    );
    // Unset readOnly fields if it's the record creation
    if (!this.record) {
      this.form.fields?.forEach((field) => {
        if (field.readOnly) {
          this.survey.getQuestionByName(field.name).readOnly = false;
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
        this.translate.instant('notification.objectLoadedFromCache', {
          type: this.translate.instant('notification.term.record'),
        })
      );
    }

    if (this.form.uniqueRecord && this.form.uniqueRecord.data) {
      this.survey.data = this.form.uniqueRecord.data;
      this.modifiedAt = this.form.uniqueRecord.modifiedAt || null;
    } else {
      if (cachedData) {
        this.survey.data = cachedData;
      } else {
        if (this.record && this.record.data) {
          this.survey.data = this.record.data;
          this.modifiedAt = this.record.modifiedAt || null;
        }
      }
    }

    if (this.survey.getUsedLocales().length > 1) {
      this.survey.getUsedLocales().forEach((lang) => {
        const nativeName = (LANGUAGES as any)[lang].nativeName.split(',')[0];
        this.usedLocales.push({ value: lang, text: nativeName });
        this.dropdownLocales.push(nativeName);
      });
    }

    if (navigator.language) {
      const clientLanguage = navigator.language.substring(0, 2);
      const code = this.survey.getUsedLocales().includes(clientLanguage)
        ? clientLanguage
        : 'en';
      this.surveyLanguage = (LANGUAGES as any)[code];
      this.survey.locale = code;
    } else {
      // TODO: check
      this.survey.locale = 'en';
    }

    this.survey.showNavigationButtons = false;
    this.setPages();
    this.survey.onComplete.add(this.onComplete);
    this.survey.showCompletedPage = false;
    if (!this.record && !this.form.canCreateRecords) {
      this.survey.mode = 'display';
    }
    this.survey.onCurrentPageChanged.add((survey, options) => {
      survey.checkErrorsMode = survey.isLastPage ? 'onComplete' : 'onNextPage';
      this.selectedTabIndex = survey.currentPageNo;
    });
    this.survey.onPageVisibleChanged.add(() => {
      this.setPages();
    });
    this.survey.onSettingQuestionErrors.add((survey, options) => {
      this.setPages();
    });
    this.survey.onValueChanged.add(this.valueChange.bind(this));
  }

  ngAfterViewInit(): void {
    this.survey.render(this.containerId);
  }

  public reset(): void {
    this.survey.clear();
    this.temporaryFilesStorage = {};
    this.survey.showCompletedPage = false;
    this.save.emit({ completed: false });
    this.survey.render();
    this.surveyActive = true;
  }

  public valueChange(): void {
    localStorage.setItem(
      this.storageId,
      JSON.stringify({ data: this.survey.data, date: new Date() })
    );
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
  public onComplete = async () => {
    let mutation: any;
    this.surveyActive = false;
    const data = this.survey.data;
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
    const questions = this.survey.getAllQuestions();
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
    this.survey.data = data;
    if (this.record || this.form.uniqueRecord) {
      const recordId = this.record
        ? this.record.id
        : this.form.uniqueRecord?.id;
      mutation = this.apollo.mutate<EditRecordMutationResponse>({
        mutation: EDIT_RECORD,
        variables: {
          id: recordId,
          data: this.survey.data,
          template:
            this.form.id !== this.record?.form?.id ? this.form.id : null,
        },
      });
    } else {
      mutation = this.apollo.mutate<AddRecordMutationResponse>({
        mutation: ADD_RECORD,
        variables: {
          form: this.form.id,
          data: this.survey.data,
        },
      });
    }
    mutation.subscribe((res: any) => {
      if (res.errors) {
        this.save.emit({ completed: false });
        this.survey.clear(false, true);
        this.surveyActive = true;
        this.snackBar.openSnackBar(res.errors[0].message, { error: true });
      } else {
        localStorage.removeItem(this.storageId);
        if (res.data.editRecord || res.data.addRecord.form.uniqueRecord) {
          this.survey.clear(false, true);
          if (res.data.addRecord) {
            this.record = res.data.addRecord;
            this.modifiedAt = this.record?.modifiedAt || null;
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
        this.save.emit({
          completed: true,
          hideNewRecord:
            res.data.addRecord && res.data.addRecord.form.uniqueRecord,
        });
      }
    });
  };

  /* Change language of the form.
   */
  setLanguage(ev: string): void {
    this.survey.locale = this.usedLocales.filter(
      (locale) => locale.text === ev
    )[0].value;
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
   * Add custom CSS classes to the survey elements.
   *
   * @param survey current survey.
   * @param options survey options.
   */
  private onSetCustomCss(options: any): void {
    const classes = options.cssClasses;
    classes.content += 'safe-qst-content';
  }

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

  public onShowPage(i: number): void {
    if (this.survey) {
      this.survey.currentPageNo = i;
    }
    if (this.survey.compareTo) {
      this.survey.currentPageNo = i;
    }
    this.selectedTabIndex = i;
  }

  public onClear(): void {
    this.survey.clear();
    this.temporaryFilesStorage = {};
    localStorage.removeItem(this.storageId);
    this.isFromCacheData = false;
    this.storageDate = undefined;
    this.survey.render();
  }

  ngOnDestroy(): void {
    localStorage.removeItem(this.storageId);
  }

  private confirmRevertDialog(record: any, version: any): void {
    // eslint-disable-next-line radix
    const date = new Date(parseInt(version.created, 0));
    const formatDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: `Recovery data`,
        content: `Do you confirm recovery the data from ${formatDate} to the current register?`,
        confirmText: 'Confirm',
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
            this.layoutService.setRightSidenav(null);
            this.snackBar.openSnackBar(
              this.translate.instant('notification.dataRecovered')
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
      this.apollo
        .query<GetRecordDetailsQueryResponse>({
          query: GET_RECORD_DETAILS,
          variables: {
            id: this.record.id,
          },
        })
        .subscribe((res) => {
          this.layoutService.setRightSidenav({
            factory: this.factory,
            inputs: {
              record: res.data.record,
              revert: (item: any, dialog: any) => {
                this.confirmRevertDialog(res.data.record, item);
              },
            },
          });
        });
    }
  }
}
