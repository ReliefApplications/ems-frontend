import { Apollo } from 'apollo-angular';
import {
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
import { SurveyModel } from 'survey-core';
import {
  ADD_RECORD,
  ADD_RECORD_PUBLIC,
  EDIT_RECORD,
} from './graphql/mutations';
import { Form } from '../../models/form.model';
import {
  AddRecordMutationResponse,
  EditRecordMutationResponse,
  Record as RecordModel,
} from '../../models/record.model';
import { BehaviorSubject, takeUntil } from 'rxjs';
import addCustomFunctions from '../../utils/custom-functions';
import { fireOnRecordEditionTriggers } from '../../survey/triggers/on-record-edition.trigger';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilderService } from '../../services/form-builder/form-builder.service';
import { RecordHistoryComponent } from '../record-history/record-history.component';
import { TranslateService } from '@ngx-translate/core';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { FormHelpersService } from '../../services/form-helper/form-helper.service';
import { SnackbarService, UILayoutService } from '@oort-front/ui';
import { isNil } from 'lodash';
import { getSurveyFormActionButtonLabels } from '../../utils/survey-form-action-labels.util';
import { AutoTranslateService } from '../../services/auto-translate/auto-translate.service';

/**
 * This component is used to display forms
 */
@Component({
  selector: 'shared-form',
  templateUrl: './form.component.html',
  styleUrls: ['../../style/survey.scss', './form.component.scss'],
})
export class FormComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** Form input */
  @Input() form!: Form;
  /** Record input, optional */
  @Input() record?: RecordModel;
  /**
   * When set, called before creating a record to get a captcha token, sent
   * with the record creation so unauthenticated users can add records to
   * public forms. The submission is cancelled if no token is returned.
   */
  @Input() requestCaptchaToken?: () => Promise<string | null>;
  /** Output event when saving the form */
  @Output() save: EventEmitter<{
    completed: boolean;
    hideNewRecord?: boolean;
    record?: RecordModel;
  }> = new EventEmitter();
  /** Survey model */
  public survey!: SurveyModel;
  /** Indicates whether the search is active */
  public surveyActive = true;
  /** Temporary storage for files */
  public temporaryFilesStorage: Record<string, Array<File>> = {};
  /** Reference to the form container element */
  @ViewChild('formContainer') formContainer!: ElementRef;
  /** Date when the form was last modified */
  public modifiedAt: Date | null = null;
  /** indicates whether the data is from the cache */
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
  /** The id of the last draft record that was loaded */
  public lastDraftRecord?: string;
  /** Disables the save as draft button */
  public disableSaveAsDraft = false;
  /** Evaluated label for the save button (from form expression or default translation) */
  public saveButtonLabel = '';
  /** Timeout for reset survey */
  private resetTimeoutListener!: NodeJS.Timeout;
  /** Captcha token obtained for the current submission, if any */
  private captchaToken: string | null = null;
  /** As we save the draft record in the db, the local storage is no longer used */
  /** ID for local storage */
  // private storageId = '';
  /** Date of local storage */
  // public storageDate?: Date;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param dialog This is the Angular Dialog service.
   * @param apollo This is the Apollo client that is used to make GraphQL requests.
   * @param snackBar This is the service that allows you to show a snackbar message to the user.
   * @param authService This is the service that handles authentication.
   * @param layoutService UI layout service
   * @param formBuilderService This is the service that will be used to build forms.
   * @param formHelpersService This is the service that will handle forms.
   * @param translate This is the service used to translate text
   * @param autoTranslateService Auto-translate text using Azure Translator
   */
  constructor(
    public dialog: Dialog,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private authService: AuthService,
    private layoutService: UILayoutService,
    private formBuilderService: FormBuilderService,
    public formHelpersService: FormHelpersService,
    private translate: TranslateService,
    private autoTranslateService: AutoTranslateService
  ) {
    super();
  }

  /** It adds custom functions, creates the lookup, adds callbacks to the lookup events, fetches cached data from local storage, and sets the lookup data. */
  ngOnInit(): void {
    addCustomFunctions(this.authService);

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

    this.survey.showCompletedPage = false;
    this.updateButtonLabels();
    if (!this.record && !this.form.canCreateRecords) {
      this.survey.mode = 'display';
    }
    // Auto-translation is wired centrally in FormBuilderService.createSurvey;
    // here we only handle component-specific reactions to value changes.
    this.survey.onValueChanged.add(() => {
      // Allow user to save as draft
      this.disableSaveAsDraft = false;
      this.updateButtonLabels();
    });
    this.survey.onComplete.add(() => {
      this.onComplete();
    });

    // Unset readOnly fields if it's the record creation
    // It's a requirement to let all fields been editable during addition of records
    if (!isNil(this.record)) {
      this.form.fields?.forEach((field) => {
        if (field.readOnly && this.survey.getQuestionByName(field.name))
          this.survey.getQuestionByName(field.name).readOnly = true;
      });
    }
    // Fetch cached data from local storage
    //this.storageId = `record:${this.record ? 'update' : ''}:${this.form.id}`;
    //const storedData = localStorage.getItem(this.storageId);
    //const cachedData = storedData ? JSON.parse(storedData).data : null;
    //this.storageDate = storedData
    //? new Date(JSON.parse(storedData).date)
    //: undefined;
    // this.isFromCacheData = !!cachedData;
    //if (this.isFromCacheData) {
    //this.snackBar.openSnackBar(
    //this.translate.instant('common.notifications.loadedFromCache', {
    //type: this.translate.instant('common.record.one'),
    //})
    //);
    //}

    //if (cachedData) {
    //this.survey.data = cachedData;
    // this.setUserVariables();
    //}

    // After the survey is created, we add common callback to survey events
    this.formBuilderService.addEventsCallBacksToSurvey(
      this.survey,
      this.selectedPageIndex,
      this.temporaryFilesStorage
    );

    // Load existing data with translation suppressed: only genuine user input
    // should trigger a translation.
    this.autoTranslateService.suppressAutoTranslationWhile(this.survey, () => {
      if (this.form.uniqueRecord && this.form.uniqueRecord.data) {
        this.survey.data = this.form.uniqueRecord.data;
        this.modifiedAt = this.form.uniqueRecord.modifiedAt || null;
        fireOnRecordEditionTriggers(this.survey);
      } else if (this.record && this.record.data) {
        this.survey.data = this.record.data;
        this.modifiedAt = this.record.modifiedAt || null;
        fireOnRecordEditionTriggers(this.survey);
      }
    });
    // survey.data does not fire onValueChanged; refresh expression-based button labels
    this.updateButtonLabels();

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

  /**
   * Evaluates all action button label expressions from the survey settings.
   * Falls back to an empty string (template will use the default translation key).
   */
  private updateButtonLabels(): void {
    const labels = getSurveyFormActionButtonLabels(this.survey);
    this.saveButtonLabel = labels.saveButtonLabel;
  }

  /**
   * Reset the survey to empty
   */
  public reset(): void {
    this.survey.clear();
    this.formHelpersService.clearTemporaryFilesStorage(
      this.temporaryFilesStorage
    );
    /** Reset custom variables */
    this.formHelpersService.addUserVariables(this.survey);
    /** Force reload of the survey so default value are being applied */
    this.survey.fromJSON(this.survey.toJSON());
    this.survey.showCompletedPage = false;
    this.updateButtonLabels();
    this.save.emit({ completed: false });
    if (this.resetTimeoutListener) {
      clearTimeout(this.resetTimeoutListener);
    }
    this.resetTimeoutListener = setTimeout(
      () => (this.surveyActive = true),
      100
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
   * Show errors using ErrorsModalComponent. Blocking errors have no way to
   * be bypassed; non-blocking warnings (e.g. a uniqueness rule with a
   * 'warning' severity) let the user save anyway, in which case onConfirm
   * is called to resubmit the record with validation skipped.
   *
   * @param errors list of validation errors
   * @param incrementalId record incremental id
   * @param onConfirm called if the user chooses to save despite the warnings
   */
  private async showLocalErrors(
    errors: any[],
    incrementalId?: string,
    onConfirm?: () => void
  ): Promise<void> {
    const { ErrorsModalComponent } = await import(
      '../ui/core-grid/errors-modal/errors-modal.component'
    );
    const dialogRef = this.dialog.open(ErrorsModalComponent, {
      data: {
        incrementalId: incrementalId || this.record?.incrementalId || '',
        errors: errors,
      },
      autoFocus: false,
    });
    if (onConfirm) {
      dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((res) => {
        if (res) {
          onConfirm();
        }
      });
    }
  }

  /**
   * Saves the current data as a draft record
   */
  public saveAsDraft(): void {
    const callback = (details: any) => {
      this.surveyActive = true;
      this.lastDraftRecord = details.id;
      // Updates parent component
      this.save.emit(details.save);
    };
    this.formHelpersService.saveAsDraft(
      this.survey,
      this.form.id as string,
      this.lastDraftRecord,
      callback
    );
  }

  /**
   * Creates the record when it is complete, or update it if provided.
   */
  public async onComplete() {
    // If survey has errors, cancel
    if (this.survey.hasErrors()) {
      this.snackBar.openSnackBar(
        this.translate.instant('models.form.notifications.savingFailed'),
        { error: true }
      );
      this.survey.clear(false, true);
      return;
    }

    // Set values from expressions setValueOnComplete
    this.survey.getAllQuestions().forEach((question) => {
      const expression = question.getPropertyValue('setValueOnComplete');
      if (expression) {
        const result = this.survey.runExpression(expression);
        question.value = result;
      }
    });
    this.surveyActive = false;

    // Ask for a captcha token before saving, when required ( e.g. public forms )
    this.captchaToken = null;
    if (!this.record && !this.form.uniqueRecord && this.requestCaptchaToken) {
      this.captchaToken = await this.requestCaptchaToken();
      if (!this.captchaToken) {
        // Submission cancelled: let the user submit again
        this.survey.clear(false, true);
        this.surveyActive = true;
        return;
      }
    }

    try {
      await this.formHelpersService.uploadFiles(
        this.survey,
        this.temporaryFilesStorage,
        this.form?.id
      );
    } catch (errors) {
      /** If there is any upload errors, save them for display */
      const uploadErrors = (errors as { question: string; file: File }[]).map(
        (error) => {
          return `${error.question}: ${error.file.name}`;
        }
      );
      this.snackBar.openSnackBar(
        this.translate.instant('models.form.notifications.savingFailed') +
          (!isNil(uploadErrors) ? '\n' + uploadErrors?.join('\n') : ''),
        { error: true }
      );
      this.survey.clear(false, true);
      this.surveyActive = true;
      return;
    }

    this.formHelpersService.setEmptyQuestions(this.survey);
    // We wait for the resources questions to update their ids
    await this.formHelpersService.createTemporaryRecords(this.survey);
    this.submitRecord(false);
  }

  /**
   * Sends the addRecord / editRecord mutation for the current survey data.
   *
   * @param skipValidation when true, save even if a non-blocking (warning)
   * uniqueness rule is violated - used to resubmit after the user confirms
   * the warning modal.
   */
  private submitRecord(skipValidation: boolean): void {
    let mutation: any;
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
          skipValidation,
        },
      });
      // Else create a new one
    } else {
      mutation = this.apollo.mutate<AddRecordMutationResponse>({
        // As unauthenticated users cannot read the other record fields, only
        // make sure the record has been created when submitting with a captcha
        mutation: this.captchaToken ? ADD_RECORD_PUBLIC : ADD_RECORD,
        variables: {
          form: this.form.id,
          data: this.survey.data,
          ...(this.captchaToken && { captchaToken: this.captchaToken }),
          skipValidation,
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
        const validationErrors =
          data.editRecord?.validationErrors || data.addRecord?.validationErrors;
        if (validationErrors?.length) {
          this.showLocalErrors(
            validationErrors,
            data.editRecord?.incrementalId || data.addRecord?.incrementalId,
            () => this.submitRecord(true)
          );
          this.save.emit({ completed: false });
          this.survey.clear(false, true);
          this.surveyActive = true;
          return;
        }
        if (this.lastDraftRecord) {
          const callback = () => {
            this.lastDraftRecord = undefined;
          };
          this.formHelpersService.deleteRecordDraft(
            this.lastDraftRecord,
            callback
          );
        }
        // localStorage.removeItem(this.storageId);
        if (data.editRecord || data.addRecord.form?.uniqueRecord) {
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
        this.snackBar.openSnackBar(
          this.translate.instant('components.form.display.submissionMessage')
        );
        this.save.emit({
          completed: true,
          hideNewRecord: data.addRecord && data.addRecord.form?.uniqueRecord,
          record: data.addRecord || data.editRecord,
        });
      }
    });
  }

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
      fireOnRecordEditionTriggers(this.survey);
    } else {
      this.survey.clear();
    }
    this.updateButtonLabels();
    this.formHelpersService.clearTemporaryFilesStorage(
      this.temporaryFilesStorage
    );
  }

  /**
   * Opens the history of the record on the right side of the screen.
   */
  public onShowHistory(): void {
    if (this.record) {
      this.layoutService.setRightSidenav({
        component: RecordHistoryComponent,
        inputs: {
          id: this.record.id,
          revert: (version: any) =>
            this.confirmRevertDialog(this.record, version),
          resizable: true,
        },
      });
    }
  }

  /**
   * Handle draft record load .
   *
   * @param id if of the draft record loaded
   */
  public onLoadDraftRecord(id: string): void {
    this.lastDraftRecord = id;
    this.disableSaveAsDraft = true;
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

  /** It removes the item from local storage, clears cached records, and discards the search. */
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.resetTimeoutListener) {
      clearTimeout(this.resetTimeoutListener);
    }
    // Auto-translation timers are cleared by the dispose() patch installed in
    // registerAutoTranslation, so disposing the survey is enough.
    this.survey?.dispose();
  }
}
