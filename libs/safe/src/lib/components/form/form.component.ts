import { Apollo } from 'apollo-angular';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import * as Survey from 'survey-angular';
import {
  AddRecordMutationResponse,
  ADD_RECORD,
  EditRecordMutationResponse,
  EDIT_RECORD,
} from './graphql/mutations';
import { Form } from '../../models/form.model';
import { Record as RecordModel } from '../../models/record.model';
import { BehaviorSubject, takeUntil } from 'rxjs';
import addCustomFunctions from '../../utils/custom-functions';
import { SafeAuthService } from '../../services/auth/auth.service';
import { SafeLayoutService } from '../../services/layout/layout.service';
import { SafeFormBuilderService } from '../../services/form-builder/form-builder.service';
import { SafeRecordHistoryComponent } from '../record-history/record-history.component';
import { TranslateService } from '@ngx-translate/core';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { SafeFormHelpersService } from '../../services/form-helper/form-helper.service';
import { SnackbarService } from '@oort-front/ui';
import { cloneDeep, isNil } from 'lodash';

/**
 * This component is used to display forms
 */
@Component({
  selector: 'safe-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class SafeFormComponent
  extends SafeUnsubscribeComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() form!: Form;
  @Input() record?: RecordModel;
  @Output() save: EventEmitter<{
    completed: boolean;
    hideNewRecord?: boolean;
  }> = new EventEmitter();

  // === SURVEYJS ===
  public survey!: Survey.SurveyModel;
  public surveyActive = true;
  public temporaryFilesStorage: Record<string, Array<File>> = {};

  @ViewChild('formContainer') formContainer!: ElementRef;

  // === MODIFIED AT ===
  public modifiedAt: Date | null = null;

  // === LOCALE STORAGE ===
  private storageId = '';
  public storageDate?: Date;
  public isFromCacheData = false;

  /** Selected page index */
  public selectedPageIndex: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  /** Selected page index as observable */
  public selectedPageIndex$ = this.selectedPageIndex.asObservable();
  /** Available pages*/
  private pages = new BehaviorSubject<any[]>([]);
  /** Pages as observable */
  public pages$ = this.pages.asObservable();

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param dialog This is the Angular Dialog service.
   * @param apollo This is the Apollo client that is used to make GraphQL requests.
   * @param snackBar This is the service that allows you to show a snackbar message to the user.
   * @param authService This is the service that handles authentication.
   * @param layoutService Shared layout service
   * @param formBuilderService This is the service that will be used to build forms.
   * @param formHelpersService This is the service that will handle forms.
   * @param translate This is the service used to translate text
   */
  constructor(
    public dialog: Dialog,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private authService: SafeAuthService,
    private layoutService: SafeLayoutService,
    private formBuilderService: SafeFormBuilderService,
    private formHelpersService: SafeFormHelpersService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    Survey.StylesManager.applyTheme();
    addCustomFunctions(Survey, this.authService, this.record);

    const structure = JSON.parse(this.form.structure || '{}');
    if (structure && !structure.completedHtml) {
      structure.completedHtml = `<h3>${this.translate.instant(
        'components.form.display.submissionMessage'
      )}</h3>`;
    }

    this.survey = this.formBuilderService.createSurvey(
      JSON.stringify(structure),
      this.form.metadata,
      this.record
    );
    // After the survey is created we add common callback to survey events
    this.formBuilderService.addEventsCallBacksToSurvey(
      this.survey,
      this.selectedPageIndex,
      this.temporaryFilesStorage
    );

    this.survey.showCompletedPage = false;
    if (!this.record && !this.form.canCreateRecords) {
      this.survey.mode = 'display';
    }
    this.survey.onValueChanged.add(this.valueChange.bind(this));
    this.survey.onComplete.add(this.onComplete);

    // Unset readOnly fields if it's the record creation
    // It's a requirement to let all fields been editable during addition of records
    if (!isNil(this.record)) {
      this.form.fields?.forEach((field) => {
        if (field.readOnly && this.survey.getQuestionByName(field.name))
          this.survey.getQuestionByName(field.name).readOnly = true;
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
      this.survey.data = cachedData;
    } else if (this.form.uniqueRecord && this.form.uniqueRecord.data) {
      this.survey.data = this.form.uniqueRecord.data;
      this.modifiedAt = this.form.uniqueRecord.modifiedAt || null;
    } else if (this.record && this.record.data) {
      this.survey.data = this.record.data;
      this.modifiedAt = this.record.modifiedAt || null;
    }

    // if (this.survey.getUsedLocales().length > 1) {
    //   this.survey.getUsedLocales().forEach((lang) => {
    //     const nativeName = (LANGUAGES as any)[lang].nativeName.split(',')[0];
    //     this.usedLocales.push({ value: lang, text: nativeName });
    //     this.dropdownLocales.push(nativeName);
    //   });
    // }

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
    this.survey?.render(this.formContainer.nativeElement);
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
  }

  /**
   * Reset the survey to empty
   */
  public reset(): void {
    this.survey.clear();
    this.formHelpersService.clearTemporaryFilesStorage(
      this.temporaryFilesStorage
    );
    this.survey.showCompletedPage = false;
    this.save.emit({ completed: false });
    this.survey.render();
    setTimeout(() => (this.surveyActive = true), 100);
  }

  /**
   * Handles the value change event when the user completes the survey
   */
  public valueChange(): void {
    // Cache the survey data, but remove the files from it
    // to avoid hitting the local storage limit
    const data = cloneDeep(this.survey.data);
    Object.keys(data).forEach((key) => {
      const question = this.survey.getQuestionByName(key);
      if (question && question.getType() === 'file') {
        delete data[key];
      }
    });

    localStorage.setItem(
      this.storageId,
      JSON.stringify({ data, date: new Date() })
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
    // const promises: Promise<any>[] =
    //   this.formHelpersService.uploadTemporaryRecords(this.survey);

    await this.formHelpersService.uploadFiles(
      this.survey,
      this.temporaryFilesStorage,
      this.form?.id
    );
    this.formHelpersService.setEmptyQuestions(this.survey);
    // We wait for the resources questions to update their ids
    // await Promise.allSettled(promises);
    await this.formHelpersService.createCachedRecords(this.survey);
    // this.survey.data = surveyData;
    // If is an already saved record, edit it
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
      // Else create a new one
    } else {
      mutation = this.apollo.mutate<AddRecordMutationResponse>({
        mutation: ADD_RECORD,
        variables: {
          form: this.form.id,
          data: this.survey.data,
        },
      });
    }
    mutation.subscribe(({ errors, data }: any) => {
      if (errors) {
        this.save.emit({ completed: false });
        this.survey.clear(false, true);
        this.surveyActive = true;
        this.snackBar.openSnackBar(errors[0].message, { error: true });
      } else {
        localStorage.removeItem(this.storageId);
        if (data.editRecord || data.addRecord.form.uniqueRecord) {
          this.survey.clear(false, false);
          if (data.addRecord) {
            this.record = data.addRecord;
            this.modifiedAt = this.record?.modifiedAt || null;
          } else {
            this.modifiedAt = data.editRecord.modifiedAt;
          }
          this.surveyActive = true;
        } else {
          this.survey.showCompletedPage = true;
        }
        this.save.emit({
          completed: true,
          hideNewRecord: data.addRecord && data.addRecord.form.uniqueRecord,
        });
      }
    });
  };

  /**
   * Handles the show page event
   *
   * @param i Index of the page
   */
  public onShowPage(i: number): void {
    if (this.survey) {
      this.survey.currentPageNo = i;
    }
  }

  /**
   * Closes the survey and empties the temporary and local storage
   */
  public onClear(): void {
    // If unicity of records is set up, do not clear but go back to latest saved version
    if (this.form.uniqueRecord && this.form.uniqueRecord.data) {
      this.survey.data = this.form.uniqueRecord.data;
      this.modifiedAt = this.form.uniqueRecord.modifiedAt || null;
    } else {
      this.survey.clear();
    }
    this.formHelpersService.clearTemporaryFilesStorage(
      this.temporaryFilesStorage
    );
    localStorage.removeItem(this.storageId);
    this.formHelpersService.cleanCachedRecords(this.survey);
    this.isFromCacheData = false;
    this.storageDate = undefined;
    this.survey.render();
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

  /**
   * Open a dialog modal to confirm the recovery of data
   *
   * @param record The record whose data we need to recover
   * @param version The version to recover
   */
  private confirmRevertDialog(record: any, version: any) {
    const dialogRef = this.formHelpersService.createRevertDialog(version);
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.apollo
          .mutate<EditRecordMutationResponse>({
            mutation: EDIT_RECORD,
            variables: {
              id: record.id,
              version: version.id,
            },
          })
          .subscribe({
            next: ({ errors }) => {
              if (errors) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'common.notifications.dataNotRecovered'
                  ),
                  { error: true }
                );
              } else {
                this.layoutService.setRightSidenav(null);
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.dataRecovered')
                );
              }
            },
            error: (err) => {
              this.snackBar.openSnackBar(err.message, { error: true });
            },
          });
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    localStorage.removeItem(this.storageId);
    this.formHelpersService.cleanCachedRecords(this.survey);
    this.survey?.dispose();
  }
}
