import { Apollo } from 'apollo-angular';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { SurveyModel } from 'survey-core';
import { ADD_RECORD, EDIT_RECORD } from './graphql/mutations';
import { Form } from '../../models/form.model';
import {
  AddRecordMutationResponse,
  EditRecordMutationResponse,
  Record as RecordModel,
} from '../../models/record.model';
import { BehaviorSubject, takeUntil } from 'rxjs';
import addCustomFunctions from '../../survey/custom-functions';
import { AuthService } from '../../services/auth/auth.service';
import {
  FormBuilderService,
  TemporaryFilesStorage,
} from '../../services/form-builder/form-builder.service';
import { RecordHistoryComponent } from '../record-history/record-history.component';
import { TranslateService } from '@ngx-translate/core';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import {
  CheckUniqueProprietyReturnT,
  FormHelpersService,
} from '../../services/form-helper/form-helper.service';
import { SnackbarService, UILayoutService } from '@oort-front/ui';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { DashboardState } from '../../models/dashboard.model';

/** Interface of the type of the mapping question o state rules */
interface MapQuestionToState {
  question: string;
  state: string;
  direction: 'questionToState' | 'stateToQuestion' | 'both';
}

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
  implements OnInit, OnDestroy, OnChanges
{
  /** Form input */
  @Input() form!: Form;
  /** Record input, optional */
  @Input() record?: RecordModel;
  /** Display actions buttons on floating div, optional */
  @Input() floatingActions = true;
  /** Array of mapping questions to states rules, if form widget on dashboard uses it */
  @Input() mapQuestionState?: MapQuestionToState[];
  /** Output event when saving the form */
  @Output() save: EventEmitter<{
    completed: boolean;
    hideNewRecord?: boolean;
  }> = new EventEmitter();
  /** Survey model */
  public survey!: SurveyModel;
  /** Indicates whether the search is active */
  public surveyActive = true;
  /** Temporary storage for files */
  public temporaryFilesStorage: TemporaryFilesStorage = new Map();
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
  /** saving operations */
  public saving = false;
  /** autosaving operations */
  public autosaving = false;
  /** last date saved */
  public latestSaveDate: Date | null = null;
  /** Timeout for reset survey */
  private resetTimeoutListener!: NodeJS.Timeout;
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
   * @param dashboardService Shared dashboard service
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
    private dashboardService: DashboardService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.record &&
      changes.record.currentValue?.id !== changes.record.previousValue?.id
    ) {
      this.initSurvey();
    }
  }

  ngOnInit(): void {
    this.initSurvey();
  }

  /** Sets up listeners to keep mapped fields updated */
  private setupStateMappingListeners(): void {
    this.mapQuestionState?.forEach((rule: MapQuestionToState) => {
      const question = this.survey.getQuestionByName(rule.question);
      if (!question) {
        return;
      }

      if (rule.direction === 'questionToState' || rule.direction === 'both') {
        const updateState = () => {
          const state = this.dashboardService.states
            .getValue()
            .find((s: DashboardState) => s.name === rule.state);
          if (state) {
            this.dashboardService.setDashboardState(question.value, state.id);
          }
        };
        question.registerFunctionOnPropertyValueChanged('value', updateState);
        updateState();
      }

      if (rule.direction === 'stateToQuestion' || rule.direction === 'both') {
        this.dashboardService.states$.subscribe(() => {
          const states = this.dashboardService.states.getValue();
          const state = states.find(
            (s: DashboardState) => s.name === rule.state
          );
          if (state) {
            if (question.isValueArray && Array.isArray(state.value)) {
              question.value = state.value;
            } else if (!question.isValueArray && !Array.isArray(state.value)) {
              question.value = state.value;
            } else if (question.isValueArray && !Array.isArray(state.value)) {
              question.value = [state.value];
            } else {
              question.value = state.value[0];
            }
          }
        });
      }
    });
  }

  /**
   * Reset the survey to empty
   */
  public reset(): void {
    this.survey.clear();
    /** Clear temporary files */
    this.temporaryFilesStorage.clear();
    /** Force reload of the survey so default value are being applied */
    this.survey.fromJSON(this.survey.toJSON());
    /** Adding variables */
    this.formHelpersService.addUserVariables(this.survey);
    this.formHelpersService.addApplicationVariables(this.survey);
    this.formHelpersService.setWorkflowContextVariable(this.survey);
    /** Reset custom variables */
    this.survey.showCompletedPage = false;
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
   * Saves the current data as a draft record
   */
  public saveAsDraft(): void {
    const callback = (details: {
      id: string;
      save: {
        completed: boolean;
        hideNewRecord: boolean;
      };
    }) => {
      this.surveyActive = true;
      this.lastDraftRecord = details.id;
      // Updates parent component
      this.save.emit(details.save);
    };
    this.formHelpersService.saveAsDraft(
      this.survey,
      this.form.id as string,
      this.temporaryFilesStorage,
      this.lastDraftRecord,
      callback
    );
  }

  /**
   * Creates the record when it is complete, or update it if provided.
   *
   * @param autoSave whether the save is automatic or manual
   */
  private async onComplete(autoSave = false) {
    this.formHelpersService
      .checkUniquePropriety(this.survey)
      .then(async (response: CheckUniqueProprietyReturnT) => {
        if (response.verified) {
          let mutation: any;
          this.surveyActive = autoSave;
          this.autosaving = autoSave;
          this.saving = !autoSave;
          // const promises: Promise<any>[] =
          //   this.formHelpersService.uploadTemporaryRecords(this.survey);

          await this.formHelpersService.uploadFiles(
            this.temporaryFilesStorage,
            this.form?.id
          );
          this.temporaryFilesStorage.clear();
          if (!autoSave) {
            this.formHelpersService.setEmptyQuestions(this.survey);
          }
          // We wait for the resources questions to update their ids
          await this.formHelpersService.createTemporaryRecords(this.survey);
          const editRecord = autoSave
            ? this.record
            : response.overwriteRecord ??
              (this.record || this.form.uniqueRecord);
          // If is an already saved record, edit it
          if (editRecord) {
            // If update or creation of record is overwriting another record because unique field values
            const recordId = response.overwriteRecord
              ? response.overwriteRecord.id
              : this.record
              ? this.record.id
              : this.form.uniqueRecord?.id;
            mutation = this.apollo.mutate<EditRecordMutationResponse>({
              mutation: EDIT_RECORD,
              variables: {
                id: recordId,
                data: this.survey.getParsedData?.() ?? this.survey.data,
                ...(!response.overwriteRecord && {
                  template:
                    this.form.id !== this.record?.form?.id
                      ? this.form.id
                      : null,
                }),
              },
            });
            // Else create a new one
          } else {
            mutation = this.apollo.mutate<AddRecordMutationResponse>({
              mutation: ADD_RECORD,
              variables: {
                id: this.survey.getVariable('record.id'),
                form: this.form.id,
                data: this.survey.getParsedData?.() ?? this.survey.data,
              },
            });
          }
          mutation
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ errors, data }: any) => {
              if (errors) {
                this.save.emit({ completed: false });
                this.survey.clear(false, true);
                this.surveyActive = true;
                this.snackBar.openSnackBar(errors[0].message, {
                  error: true,
                });
              } else {
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
                if (
                  data.editRecord ||
                  data.addRecord.form.uniqueRecord ||
                  autoSave
                ) {
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
                  hideNewRecord: autoSave
                    ? true
                    : data.addRecord && data.addRecord.form.uniqueRecord,
                });
              }
              this.saving = false;
              this.autosaving = false;
              this.latestSaveDate = new Date();
            });
        } else {
          this.snackBar.openSnackBar(
            this.translate.instant('components.form.display.cancelMessage')
          );
          this.survey.clear(false);
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
      setTimeout(() => {
        this.survey.currentPageNo = i;
      }, 50);
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
    this.temporaryFilesStorage.clear();
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
    this.survey?.dispose();
  }

  /**
   * It adds custom functions, creates the lookup, adds callbacks to the lookup events,
   * fetches cached data from local storage, and sets the lookup data.
   */
  private initSurvey(): void {
    addCustomFunctions({
      record: this.record,
      authService: this.authService,
      apollo: this.apollo,
      form: this.form,
      translateService: this.translate,
    });

    const structure = JSON.parse(this.form.structure || '{}');
    if (structure && !structure.completedHtml) {
      structure.completedHtml = `<h3>${this.translate.instant(
        'components.form.display.submissionMessage'
      )}</h3>`;
    }

    this.survey = this.formBuilderService.createSurvey(
      JSON.stringify(structure),
      this.form.metadata,
      this.record,
      this.form
    );

    this.survey.onAfterRenderSurvey.add(() => {
      this.setupStateMappingListeners();
    });

    // After the survey is created we add common callback to survey events
    this.formBuilderService.addEventsCallBacksToSurvey(
      this.survey,
      this.selectedPageIndex,
      this.temporaryFilesStorage,
      this.destroy$
    );

    this.survey.showCompletedPage = false;
    if (!this.record && !this.form.canCreateRecords) {
      this.survey.mode = 'display';
    }
    if (this.survey.autoSave) {
      this.survey.onValueChanged.add(async (_, options) => {
        this.formHelpersService.autoSaveRecord(
          options,
          this.onComplete.bind(this, true),
          this.temporaryFilesStorage,
          this.form.id,
          this.survey
        );
      });
    }
    this.survey.onComplete.add(() => {
      this.onComplete();
      this.formHelpersService.saveDebounced.cancel();
    });

    // Set readOnly fields
    this.form.fields?.forEach((field) => {
      if (field.readOnly && this.survey.getQuestionByName(field.name))
        this.survey.getQuestionByName(field.name).readOnly = true;
    });
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
    if (this.form.uniqueRecord && this.form.uniqueRecord.data) {
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
}
