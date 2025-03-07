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
import { BehaviorSubject, firstValueFrom, takeUntil } from 'rxjs';
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
import { FormActionsModule } from '../form-actions/form-actions.module';
import { RecordSummaryModule } from '../record-summary/record-summary.module';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { ADD_RECORD, EDIT_RECORD, EDIT_RECORDS } from './graphql/mutations';
import { GET_FORM_BY_ID, GET_RECORD_BY_ID } from './graphql/queries';

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
    IconModule,
    TabsModule,
    RecordSummaryModule,
    FormActionsModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    SpinnerModule,
    SurveyModule,
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
  /** Available pages*/
  private pages = new BehaviorSubject<any[]>([]);
  /** Pages as observable */
  public pages$ = this.pages.asObservable();
  /** Is multi edition of records enabled ( for grid actions ) */
  protected isMultiEdition = false;
  /** Temporary storage of files */
  protected temporaryFilesStorage: any = {};
  /** Stored merged data */
  private storedMergedData: any;

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
    protected ngZone: NgZone
  ) {
    super();
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
      confirmText: this.translate.instant('components.confirmModal.confirm'),
      confirmVariant: 'primary',
    };
    if (this.data.actionButtonCtx) {
      confirmMessage = {
        title: this.translate.instant(
          this.data.recordId ? 'common.updateObject' : 'common.uploadObject',
          {
            name:
              this.translate.instant('common.record.one') +
              ' ' +
              this.form?.name,
          }
        ),
        content: this.translate.instant(
          'components.form.update.confirmMessage',
          {
            action: this.translate.instant(
              this.data.recordId ? 'common.update' : 'common.create'
            ),
          }
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
            },
          })
        ).then(({ data }) => {
          this.record = data.record;
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
    if (!this.data.recordId || this.data.template) {
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
            this.storedMergedData = this.data.prefillData;
          }
          if (this.data.prefillRecords && this.data.prefillRecords.length > 0) {
            this.storedMergedData = this.mergedData(this.data.prefillRecords);
            const resId = this.data.prefillRecords[0].form?.resource?.id;
            const resourcesField = this.form.fields?.find(
              (x) => x.type === 'resources' && x.resource === resId
            );
            if (resourcesField) {
              this.storedMergedData[resourcesField.name] =
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

    this.survey.onValueChanged.add(() => {
      // Allow user to save as draft
      this.disableSaveAsDraft = false;
    });
    this.survey.onComplete.add(this.onComplete);
    if (this.storedMergedData) {
      const notNullValues = omitBy(this.storedMergedData, isNil);
      Object.keys(notNullValues).forEach((question) => {
        this.survey.setValue(question, notNullValues[question]);
      });
    }

    // After the survey is created, we add common callback to survey events
    this.formBuilderService.addEventsCallBacksToSurvey(
      this.survey,
      this.selectedPageIndex,
      this.temporaryFilesStorage
    );

    if (this.data.recordId && this.record) {
      if (this.isMultiEdition) {
        this.survey.data = null;
      } else {
        const notNullValues = omitBy(this.record.data, isNil);
        Object.keys(notNullValues).forEach((question) => {
          this.survey.setValue(question, notNullValues[question]);
        });
      }
      addCustomFunctions(this.authService, this.record);
      this.survey.showCompletedPage = false;
      this.form?.fields?.forEach((field) => {
        if (field.readOnly && this.survey.getQuestionByName(field.name))
          this.survey.getQuestionByName(field.name).readOnly = true;
      });
    }

    this.loading = false;
  }

  /**
   * Calls the complete method of the survey if no error.
   */
  public async submit(): Promise<void> {
    this.saving = true;
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
    }
  }

  /**
   * Creates the record, or update it if provided.
   *
   * @param survey Survey instance.
   */
  public onComplete = (survey: any) => {
    this.survey?.clear(false);

    /** we can send to backend empty data if they are not required */
    this.formHelpersService.setEmptyQuestions(survey);
    // Displays confirmation modal.
    if (this.data.askForConfirm) {
      const confirmMessage = this.getConfirmMessageByContext();
      const dialogRef = this.confirmService.openConfirmModal(confirmMessage);
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe(async (value: any) => {
          if (value) {
            await this.onUpdate(survey);
          } else {
            this.saving = false;
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
    // await Promise.allSettled(promises);
    await this.formHelpersService.createTemporaryRecords(survey);

    if (this.data.recordId) {
      if (this.isMultiEdition) {
        this.updateMultipleData(this.data.recordId, survey);
      } else {
        this.updateData(this.data.recordId, survey);
      }
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
        },
      })
      .subscribe({
        next: ({ errors, data }) => {
          this.handleRecordMutationResponse({ data, errors }, 'editRecord');
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
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
    } else {
      if (data) {
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.objectUpdated', {
            type,
            value: '',
          })
        );
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
   * Saves the current data as a draft record
   */
  public saveAsDraft(): void {
    const callback = (details: any) => {
      this.lastDraftRecord = details.id;
    };
    this.formHelpersService.saveAsDraft(
      this.survey,
      this.form?.id as string,
      this.lastDraftRecord,
      callback
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
  }

  /**
   * Clears the cache for the records created by resource questions
   */
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.survey?.dispose();
  }
}
