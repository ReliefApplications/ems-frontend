import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AlertModule,
  ButtonModule,
  DialogModule,
  IconModule,
  SnackbarService,
  SpinnerModule,
  TabsModule,
} from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import {
  BehaviorSubject,
  debounceTime,
  firstValueFrom,
  Subject,
  takeUntil,
} from 'rxjs';
import { SurveyModule } from 'survey-angular-ui';
import { SurveyModel } from 'survey-core';
import { Form, FormQueryResponse } from '../../models/form.model';
import {
  AddRecordMutationResponse,
  EditRecordMutationResponse,
  EditRecordsMutationResponse,
  Record,
  RecordQueryResponse,
} from '../../models/record.model';
import { AuthService } from '../../services/auth/auth.service';
import {
  ConfirmDialogData,
  ConfirmService,
} from '../../services/confirm/confirm.service';
import { FormBuilderService } from '../../services/form-builder/form-builder.service';
import { FormHelpersService } from '../../services/form-helper/form-helper.service';
import { cleanRecord } from '../../utils/cleanRecord';
import addCustomFunctions from '../../utils/custom-functions';
import { fireOnRecordEditionTriggers } from '../../survey/triggers/on-record-edition.trigger';
import { RecordSummaryModule } from '../record-summary/record-summary.module';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { ADD_RECORD, EDIT_RECORD, EDIT_RECORDS } from './graphql/mutations';
import { GET_FORM_BY_ID, GET_RECORD_BY_ID } from './graphql/queries';
import { getSurveyFormActionButtonLabels } from '../../utils/survey-form-action-labels.util';
import { shouldConfirmRecordUpdate } from '../../utils/survey-confirm-record-update.util';
import { AutoTranslateService } from '../../services/auto-translate/auto-translate.service';
import { DraftRecordComponent } from '../draft-record/draft-record.component';

/**
 * Interface of Dialog data.
 */
interface DialogData {
  template?: string;
  recordId?: string | [];
  prefillRecords?: Record[];
  prefillData?: any;
  askForConfirm?: boolean;
  recordData?: any;
  actionButtonCtx?: boolean;
  draft?: boolean;
  allDrafts?: boolean;
  isDraftClone?: boolean;
}
/**
 * Defines the default Dialog data
 */
const DEFAULT_DIALOG_DATA = { askForConfirm: true };

/**
 * Display a form instance in a modal.
 */
@Component({
  standalone: true,
  selector: 'shared-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['../../style/survey.scss', './form-modal.component.scss'],
  imports: [
    CommonModule,
    AlertModule,
    IconModule,
    TabsModule,
    RecordSummaryModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    SpinnerModule,
    SurveyModule,
    DraftRecordComponent,
  ],
})
export class FormModalComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** Reference to form container */
  @ViewChild('formContainer') formContainer!: ElementRef;
  /** Current template */
  public survey!: SurveyModel;
  /** Loading indicator */
  public loading = true;
  /** Is form saving */
  public saving = false;
  /** Loaded form */
  public form?: Form;
  /** Loaded record (optional) */
  public record?: Record;
  /** Modification date */
  public modifiedAt: Date | null = null;
  /** Selected page index */
  public selectedPageIndex: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  /** Selected page index as observable */
  public selectedPageIndex$ = this.selectedPageIndex.asObservable();
  /** The id of the last draft record that was loaded */
  public lastDraftRecord?: string;
  /** Disables the save as draft button */
  public disableSaveAsDraft = false;
  /** Whether the current survey data changed since the last save/load. */
  private valueChanged = false;
  /** Available pages*/
  private pages = new BehaviorSubject<any[]>([]);
  /** Pages as observable */
  public pages$ = this.pages.asObservable();
  /** Is multi edition of records enabled ( for grid actions ) */
  protected isMultiEdition = false;
  /** Evaluated label for the modal save button */
  public saveButtonLabel = '';
  /** Temporary storage of files */
  protected temporaryFilesStorage: any = {};
  /** Stored cloned data */
  private prefillClonedData: any;
  /** Stored merged data */
  private prefillMergedData: any;
  /** Auto-save trigger stream. */
  private autoSaveSubject = new Subject<void>();
  /** Whether auto-save should save the form as a draft. */
  private autoSaveEnabled = false;
  /** Active auto-save operation, used to avoid duplicate draft creation. */
  private autoSavePromise: Promise<void> | null = null;
  /** Whether another auto-save was requested while one was running. */
  private autoSavePending = false;
  /** Incremented on every user edit to detect stale auto-save responses. */
  private autoSaveRevision = 0;

  /** @returns True when the Save as Draft button should be shown. */
  public get showSaveAsDraft(): boolean {
    return !this.data.recordId || !!this.lastDraftRecord;
  }

  /** @returns True when auto-save can write the current form as a draft. */
  private get canAutoSaveDraft(): boolean {
    return (
      !this.data.isDraftClone && (!this.data.recordId || !!this.lastDraftRecord)
    );
  }

  /**
   * Display a form instance in a modal.
   *
   * @param data This is the data that is passed to the modal when it is opened.
   * @param dialog This is the Angular Dialog service.
   * @param dialogRef This is the reference to the dialog.
   * @param apollo This is the Apollo client that we'll use to make GraphQL requests.
   * @param snackBar This is the service that allows you to display a snackbar.
   * @param authService This is the service that handles authentication.
   * @param formBuilderService This is the service that will be used to build forms.
   * @param formHelpersService This is the service that will handle forms.
   * @param confirmService This is the service that will be used to display confirm window.
   * @param translate This is the service that allows us to translate the text in our application.
   * @param ngZone Angular Service to execute code inside Angular environment
   * @param autoTranslateService Auto-translate text using Azure Translator
   */
  constructor(
    @Inject(DIALOG_DATA) public data: DialogData,
    public dialog: Dialog,
    public dialogRef: DialogRef<FormModalComponent>,
    private apollo: Apollo,
    protected snackBar: SnackbarService,
    private authService: AuthService,
    private formBuilderService: FormBuilderService,
    protected formHelpersService: FormHelpersService,
    protected confirmService: ConfirmService,
    protected translate: TranslateService,
    protected ngZone: NgZone,
    private autoTranslateService: AutoTranslateService
  ) {
    super();
    this.autoSaveSubject
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.autoSaveEnabled) {
          this.performAutoSave();
        }
      });
  }

  /**
   * Whether the modal edits an existing record (update) rather than creating one.
   *
   * @returns True when a record id was provided to the modal
   */
  private get isUpdate(): boolean {
    return !!this.data.recordId;
  }

  /**
   * Create confirmation message on save edition based on action button or default context
   *
   * @returns Confirmation message for form record edit for each context
   */
  private getConfirmMessageByContext(): ConfirmDialogData {
    const rowsSelected = Array.isArray(this.data.recordId)
      ? this.data.recordId.length
      : 1;
    let confirmMessage: ConfirmDialogData = {
      title: this.translate.instant(
        rowsSelected > 1
          ? 'components.form.update.confirmTitle.few'
          : 'components.form.update.confirmTitle.one'
      ),
      confirmText: this.translate.instant('components.confirmModal.confirm'),
      confirmVariant: 'primary',
    };
    if (this.data.actionButtonCtx) {
      confirmMessage = {
        title: this.translate.instant(
          this.isUpdate
            ? 'components.form.update.confirmActionTitle.update'
            : 'components.form.update.confirmActionTitle.create'
        ),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmVariant: 'primary',
      };
    }
    return confirmMessage;
  }

  async ngOnInit(): Promise<void> {
    this.data = { ...DEFAULT_DIALOG_DATA, ...this.data };

    this.isMultiEdition = Array.isArray(this.data.recordId);
    const promises: Promise<FormQueryResponse | RecordQueryResponse | void>[] =
      [];
    if (this.data.recordId) {
      const id = this.isMultiEdition
        ? this.data.recordId[0]
        : this.data.recordId;
      promises.push(
        firstValueFrom(
          this.apollo.query<RecordQueryResponse>({
            query: GET_RECORD_BY_ID,
            variables: {
              id,
              draft: this.data.draft,
              allDrafts: this.data.allDrafts,
            },
          })
        ).then(({ data }) => {
          this.record = data.record;
          if (this.record?.draft && this.record.id) {
            this.lastDraftRecord = this.record.id;
          }
          if (this.data.recordData) {
            this.record.data = { ...this.record.data, ...this.data.recordData };
          }
          this.modifiedAt = this.isMultiEdition
            ? null
            : this.record?.modifiedAt || null;
          if (!this.data.template) {
            this.form = this.record?.form;
          }
        })
      );
    }
    if (!this.isUpdate || this.data.template) {
      promises.push(
        firstValueFrom(
          this.apollo.query<FormQueryResponse>({
            query: GET_FORM_BY_ID,
            variables: {
              id: this.data.template,
            },
          })
        ).then(({ data }) => {
          this.form = data.form;
          if (this.data.prefillData) {
            // Prefill with cloned data
            this.prefillClonedData = this.data.prefillData;
          } else if (
            this.data.prefillRecords &&
            this.data.prefillRecords.length > 0
          ) {
            // Prefill with merged data from records
            this.prefillMergedData = this.mergedData(this.data.prefillRecords);
            const resId = this.data.prefillRecords[0].form?.resource?.id;
            const resourcesField = this.form.fields?.find(
              (x) => x.type === 'resources' && x.resource === resId
            );
            if (resourcesField) {
              this.prefillMergedData[resourcesField.name] =
                this.data.prefillRecords.map((x) => x.id);
            } else {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'models.record.notifications.conversionIncomplete'
                ),
                { error: true }
              );
            }
          }
        })
      );
    }
    await Promise.all(promises);

    this.initSurvey();
  }

  /**
   * Initializes the form
   */
  private initSurvey(): void {
    this.survey = this.formBuilderService.createSurvey(
      this.form?.structure || '',
      this.form?.metadata,
      this.record
    );

    this.valueChanged = false;
    // Programmatic prefill must not create a draft before the user edits.
    this.autoSaveEnabled = false;
    // Auto-translation is wired centrally in FormBuilderService.createSurvey;
    // here we only handle component-specific reactions to value changes.
    this.survey.onValueChanged.add(() => {
      // Allow user to save as draft
      this.disableSaveAsDraft = false;
      this.valueChanged = true;
      this.autoSaveRevision++;
      this.updateButtonLabels();
      if (this.autoSaveEnabled) {
        this.autoSaveSubject.next();
      }
    });
    this.survey.onComplete.add(this.onComplete);

    this.updateButtonLabels();

    // Populate the survey programmatically with translation suppressed so that
    // prefilling / loading an existing record does not trigger translations.
    this.autoTranslateService.suppressAutoTranslationWhile(this.survey, () => {
      if (this.prefillMergedData) {
        // Prefill with merged data from records
        const cleanedData = omitBy(this.prefillMergedData, isNil);
        Object.keys(cleanedData).forEach((question) => {
          this.survey.setValue(question, cleanedData[question]);
        });
      } else if (this.prefillClonedData) {
        // Prefill with cloned data
        const resourcesFields = this.survey
          .getAllQuestions()
          .filter((q) => q.getType() === 'resources');
        const resourceNames = new Set(resourcesFields.map((f) => f.name));
        // Omit nil values and resources questions from prefill data
        const cleanedData = omitBy(this.prefillClonedData, (value, key) => {
          return isNil(value) || resourceNames.has(key);
        });
        Object.keys(cleanedData).forEach((question) => {
          this.survey.setValue(question, cleanedData[question]);
        });
      }

      // After the survey is created, we add common callback to survey events
      this.formBuilderService.addEventsCallBacksToSurvey(
        this.survey,
        this.selectedPageIndex,
        this.temporaryFilesStorage
      );

      if (this.isUpdate && this.record) {
        if (this.isMultiEdition) {
          this.survey.data = null;
        } else {
          const cleanedData = omitBy(this.record.data, isNil);
          Object.keys(cleanedData).forEach((question) => {
            this.survey.setValue(question, cleanedData[question]);
          });
        }
        addCustomFunctions(this.authService);
        this.survey.showCompletedPage = false;
        this.form?.fields?.forEach((field) => {
          if (field.readOnly && this.survey.getQuestionByName(field.name))
            this.survey.getQuestionByName(field.name).readOnly = true;
        });

        // Fire once now that the existing record's data is in the survey
        fireOnRecordEditionTriggers(this.survey);
      }

      // Bulk survey.data changes (e.g. multi-edition) do not fire onValueChanged
      this.updateButtonLabels();
    });

    this.valueChanged = false;
    this.autoSaveEnabled = this.canAutoSaveDraft;
    this.loading = false;
  }

  /**
   * Evaluates all action button label expressions from the survey settings.
   * Falls back to an empty string (template will use the default translation key).
   */
  private updateButtonLabels(): void {
    const labels = getSurveyFormActionButtonLabels(this.survey);
    this.saveButtonLabel = labels.modalSaveButtonLabel;
  }

  /**
   * Calls the complete method of the survey if no error.
   */
  public async submit(): Promise<void> {
    this.saving = true;
    this.autoSaveEnabled = false;
    if (this.autoSavePromise) {
      await this.autoSavePromise;
    }
    let uploadErrors;
    /** If any file attached, first upload them before record creation */
    if (
      !isNil(this.temporaryFilesStorage) &&
      Object.keys(this.temporaryFilesStorage).length
    ) {
      try {
        await this.formHelpersService.uploadFiles(
          this.survey,
          this.temporaryFilesStorage,
          this.form?.id as string
        );
      } catch (errors) {
        /** If there is any upload errors, save them for display */
        uploadErrors = (errors as { question: string; file: File }[]).map(
          (error) => {
            return `${error.question}: ${error.file.name}`;
          }
        );
      }
    }
    if (!this.survey?.hasErrors() && isNil(uploadErrors)) {
      this.survey?.completeLastPage();
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant('models.form.notifications.savingFailed') +
          (!isNil(uploadErrors) ? '\n' + uploadErrors?.join('\n') : ''),
        { error: true }
      );
      this.saving = false;
      this.autoSaveEnabled = this.canAutoSaveDraft;
    }
  }

  /**
   * Show errors using ErrorsModalComponent
   *
   * @param errors list of validation errors
   * @param incrementalId record incremental id
   */
  private async showLocalErrors(
    errors: any[],
    incrementalId?: string
  ): Promise<void> {
    const { ErrorsModalComponent } = await import(
      '../ui/core-grid/errors-modal/errors-modal.component'
    );
    this.dialog.open(ErrorsModalComponent, {
      data: {
        incrementalId: incrementalId || this.record?.incrementalId || '',
        errors: errors,
      },
      autoFocus: false,
    });
  }

  /**
   * Creates the record, or update it if provided.
   *
   * @param survey Survey instance.
   */
  public onComplete = (survey: any) => {
    this.survey?.clear(false);

    // If survey has errors, cancel edition
    if (this.survey?.hasErrors()) {
      this.snackBar.openSnackBar(
        this.translate.instant('models.form.notifications.savingFailed'),
        { error: true }
      );
      this.saving = false;
      this.autoSaveEnabled = this.canAutoSaveDraft;
      return;
    }

    /** we can send to backend empty data if they are not required */
    this.formHelpersService.setEmptyQuestions(survey);
    // Creation only relies on the caller's askForConfirm flag, whereas an update
    // additionally requires the form-level "confirm before updating" setting.
    const askForConfirm = this.isUpdate
      ? this.data.askForConfirm && shouldConfirmRecordUpdate(this.survey)
      : this.data.askForConfirm;
    // Displays confirmation modal.
    if (askForConfirm) {
      const confirmMessage = this.getConfirmMessageByContext();
      const dialogRef = this.confirmService.openConfirmModal(confirmMessage);
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe(async (value: any) => {
          if (value) {
            await this.onUpdate(survey);
          } else {
            this.saving = false;
            this.autoSaveEnabled = this.canAutoSaveDraft;
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
    // Set values from expressions setValueOnComplete
    this.survey.getAllQuestions().forEach((question) => {
      const expression = question.getPropertyValue('setValueOnComplete');
      if (expression) {
        const result = this.survey.runExpression(expression);
        question.value = result;
      }
    });
    // await Promise.allSettled(promises);
    await this.formHelpersService.createTemporaryRecords(survey);

    if (this.data.recordId) {
      if (this.isMultiEdition) {
        this.updateMultipleData(this.data.recordId, survey);
      } else {
        this.updateData(this.data.recordId, survey);
      }
    } else if (this.lastDraftRecord) {
      this.apollo
        .mutate<EditRecordMutationResponse>({
          mutation: EDIT_RECORD,
          variables: {
            id: this.lastDraftRecord,
            data: survey.data,
            template: this.data.template,
            lang: this.translate.currentLang,
            updateDraftStatus: false,
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            if (errors) {
              this.snackBar.openSnackBar(`Error. ${errors[0].message}`, {
                error: true,
              });
              this.saving = false;
              this.autoSaveEnabled = this.canAutoSaveDraft;
            } else {
              this.lastDraftRecord = undefined;
              this.valueChanged = false;
              this.ngZone.run(() => {
                this.dialogRef.close({
                  template: this.data.template,
                  data: data?.editRecord,
                } as any);
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'components.form.display.submissionMessage'
                  )
                );
              });
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
            this.saving = false;
            this.autoSaveEnabled = this.canAutoSaveDraft;
          },
        });
    } else {
      this.apollo
        .mutate<AddRecordMutationResponse>({
          mutation: ADD_RECORD,
          variables: {
            form: this.data.template,
            data: survey.data,
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            if (errors) {
              this.snackBar.openSnackBar(`Error. ${errors[0].message}`, {
                error: true,
              });
              this.ngZone.run(() => {
                this.dialogRef.close();
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
              this.ngZone.run(() => {
                this.dialogRef.close({
                  template: this.data.template,
                  data: data?.addRecord,
                } as any);
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'components.form.display.submissionMessage'
                  )
                );
              });
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
            this.saving = false;
            this.autoSaveEnabled = this.canAutoSaveDraft;
          },
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
          lang: this.translate.currentLang,
          ...(this.record?.draft && { updateDraftStatus: false }),
        },
      })
      .subscribe({
        next: ({ errors, data }) => {
          this.handleRecordMutationResponse({ data, errors }, 'editRecord');
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.saving = false;
          this.autoSaveEnabled = this.canAutoSaveDraft;
        },
      });
  }

  /**
   * Updates multiple records.
   *
   * @param ids list of record ids.
   * @param survey current survey.
   */
  public updateMultipleData(ids: any, survey: any): void {
    const recordData = cleanRecord(survey.data);
    this.apollo
      .mutate<EditRecordsMutationResponse>({
        mutation: EDIT_RECORDS,
        variables: {
          ids,
          data: recordData,
          template: this.data.template,
        },
      })
      .subscribe({
        next: ({ errors, data }) => {
          if (this.lastDraftRecord) {
            const callback = () => {
              this.lastDraftRecord = undefined;
            };
            this.formHelpersService.deleteRecordDraft(
              this.lastDraftRecord,
              callback
            );
          }
          this.handleRecordMutationResponse({ data, errors }, 'editRecords');
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.saving = false;
          this.autoSaveEnabled = this.canAutoSaveDraft;
        },
      });
  }

  /**
   * Handle mutation type for the given response type, single or multiple records
   *
   * @param response Graphql mutation response
   * @param response.data response data
   * @param response.errors response errors
   * @param responseType response type
   */
  private handleRecordMutationResponse(
    response: { data: any; errors: any },
    responseType: 'editRecords' | 'editRecord'
  ) {
    const { data, errors } = response;
    const type =
      responseType === 'editRecords'
        ? this.translate.instant('common.record.few')
        : this.translate.instant('common.record.one');
    if (errors) {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectNotUpdated', {
          type,
          error: errors ? errors[0].message : '',
        }),
        { error: true }
      );
      this.saving = false;
      this.autoSaveEnabled = this.canAutoSaveDraft;
    } else {
      if (data) {
        if (
          responseType === 'editRecord' &&
          data.editRecord?.validationErrors?.length
        ) {
          this.showLocalErrors(
            data.editRecord.validationErrors,
            data.editRecord.incrementalId
          );
          this.saving = false;
          this.autoSaveEnabled = this.canAutoSaveDraft;
          return;
        }
        if (responseType === 'editRecords' && Array.isArray(data.editRecords)) {
          const recordWithErrors = data.editRecords.find(
            (r: any) => r.validationErrors?.length
          );
          if (recordWithErrors) {
            this.showLocalErrors(
              recordWithErrors.validationErrors,
              recordWithErrors.incrementalId
            );
            this.saving = false;
            this.autoSaveEnabled = this.canAutoSaveDraft;
            return;
          }
        }

        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.objectUpdated', {
            type,
            value: '',
          })
        );
        this.valueChanged = false;
        if (data[responseType]?.draft === false) {
          this.lastDraftRecord = undefined;
        }
        this.dialogRef.close({
          template: this.form?.id,
          data: data[responseType],
        } as any);
      }
    }
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
        if (
          inputField.choices ||
          inputField.choicesByUrl ||
          inputField.choicesByGraphQL
        ) {
          // If the target has multiple choices we concatenate all the source values
          if (
            targetField.type === 'tagbox' ||
            targetField.type === 'checkbox'
          ) {
            if (
              inputField.type === 'tagbox' ||
              targetField.type === 'checkbox'
            ) {
              data[inputField.name] = Array.from(
                new Set(
                  records.reduce((o: string[], record: Record) => {
                    o = o.concat(record.data[inputField.name]);
                    return o;
                  }, [])
                )
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
   * Opens the history of the record in a modal.
   */
  public async onShowHistory(): Promise<void> {
    if (this.record) {
      const { RecordHistoryModalComponent } = await import(
        '../record-history-modal/record-history-modal.component'
      );
      this.dialog.open(RecordHistoryModalComponent, {
        data: {
          id: this.record.id,
          revert: (version: any) =>
            this.confirmRevertDialog(this.record, version),
        },
        panelClass: ['lg:w-4/5', 'w-full'],
        autoFocus: false,
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
            next: (errors) => {
              if (errors) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'common.notifications.dataNotRecovered'
                  ),
                  { error: true }
                );
              } else {
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.dataRecovered')
                );
              }
              this.dialog.closeAll();
            },
            error: (err) => {
              this.snackBar.openSnackBar(err.message, { error: true });
            },
          });
      }
    });
  }

  /**
   * Saves changed modal data as a draft without showing success toasts.
   */
  private performAutoSave(): void {
    if (this.saving || !this.valueChanged || !this.form?.id) {
      return;
    }
    if (this.autoSavePromise) {
      this.autoSavePending = true;
      return;
    }

    const revision = this.autoSaveRevision;
    this.autoSavePromise = new Promise<void>((resolve) => {
      if (this.lastDraftRecord) {
        this.apollo
          .mutate<EditRecordMutationResponse>({
            mutation: EDIT_RECORD,
            variables: {
              id: this.lastDraftRecord,
              data: this.survey.data,
            },
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: ({ errors }) => {
              this.handleAutoSaveResponse(
                errors,
                this.lastDraftRecord,
                revision,
                resolve
              );
            },
            error: (err: unknown) => {
              this.handleAutoSaveError(err, resolve);
            },
          });
      } else {
        this.apollo
          .mutate<AddRecordMutationResponse>({
            mutation: ADD_RECORD,
            variables: {
              form: this.form?.id,
              data: this.survey.data,
              draft: true,
            },
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: ({ errors, data }) => {
              this.handleAutoSaveResponse(
                errors,
                data?.addRecord?.id,
                revision,
                resolve
              );
            },
            error: (err: unknown) => {
              this.handleAutoSaveError(err, resolve);
            },
          });
      }
    });
  }

  /**
   * Handles a draft auto-save mutation response.
   *
   * @param errors GraphQL errors, if any.
   * @param savedDraftId Saved draft id.
   * @param revision Change revision captured when the auto-save started.
   * @param resolve Resolves the current auto-save promise.
   */
  private handleAutoSaveResponse(
    errors: readonly { message: string }[] | undefined,
    savedDraftId: string | undefined,
    revision: number,
    resolve: () => void
  ): void {
    if (errors?.length || !savedDraftId) {
      const message =
        errors?.[0]?.message ||
        this.translate.instant('models.form.notifications.savingFailed');
      this.snackBar.openSnackBar(message, { error: true });
    } else {
      if (savedDraftId) {
        this.lastDraftRecord = savedDraftId;
        this.disableSaveAsDraft = true;
      }
      if (this.autoSaveRevision === revision) {
        this.valueChanged = false;
      }
    }
    this.finishAutoSave(resolve);
  }

  /**
   * Handles a draft auto-save transport error.
   *
   * @param err Transport error.
   * @param resolve Resolves the current auto-save promise.
   */
  private handleAutoSaveError(err: unknown, resolve: () => void): void {
    const message = err instanceof Error ? err.message : String(err);
    this.snackBar.openSnackBar(message, { error: true });
    this.finishAutoSave(resolve);
  }

  /**
   * Clears the current auto-save and replays a queued one if needed.
   *
   * @param resolve Resolves the current auto-save promise.
   */
  private finishAutoSave(resolve: () => void): void {
    const shouldReplay = this.autoSavePending;
    this.autoSavePending = false;
    this.autoSavePromise = null;
    resolve();
    if (shouldReplay && this.autoSaveEnabled) {
      this.performAutoSave();
    }
  }

  /**
   * Saves the current data as a draft record
   */
  public async saveAsDraft(): Promise<void> {
    this.saving = true;
    this.autoSaveEnabled = false;
    if (this.autoSavePromise) {
      await this.autoSavePromise;
    }
    const revision = this.autoSaveRevision;
    const callback = (details: { id?: string }) => {
      const hasNewChanges = this.autoSaveRevision !== revision;
      this.lastDraftRecord = details.id;
      this.disableSaveAsDraft = !hasNewChanges;
      this.valueChanged = hasNewChanges;
      this.saving = false;
      this.autoSaveEnabled = this.canAutoSaveDraft;
      if (hasNewChanges) {
        this.performAutoSave();
      }
    };
    const errorCallback = () => {
      this.saving = false;
      this.autoSaveEnabled = this.canAutoSaveDraft;
    };
    this.formHelpersService.saveAsDraft(
      this.survey,
      this.form?.id as string,
      this.lastDraftRecord,
      callback,
      errorCallback
    );
  }

  /**
   * Handle draft record load .
   *
   * @param id if of the draft record loaded
   */
  public onLoadDraftRecord(id: string): void {
    this.lastDraftRecord = id;
    this.disableSaveAsDraft = true;
    this.valueChanged = false;
    this.autoSaveEnabled = true;
  }

  /**
   * Asks for confirmation before replacing unsaved data with a draft.
   *
   * @returns True when the draft picker can open.
   */
  public beforeOpenDrafts = async (): Promise<boolean> => {
    if (!this.valueChanged) {
      return true;
    }

    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('components.form.update.exit'),
      content: this.translate.instant('components.form.update.exitMessage'),
      confirmText: this.translate.instant('components.confirmModal.confirm'),
      confirmVariant: 'primary',
    });
    const value = await firstValueFrom(dialogRef.closed);
    return !!value;
  };

  /**
   * Clears the cache for the records created by resource questions
   */
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    // Auto-translation timers are cleared by the dispose() patch installed in
    // registerAutoTranslation, so disposing the survey is enough.
    this.survey?.dispose();
  }
}
