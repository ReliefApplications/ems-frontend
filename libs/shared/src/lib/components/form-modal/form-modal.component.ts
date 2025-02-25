import { Apollo } from 'apollo-angular';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  Dialog,
  DIALOG_DATA,
  DialogCloseOptions,
  DialogRef,
} from '@angular/cdk/dialog';
import {
  GET_RECORD_BY_ID,
  GET_FORM_BY_ID,
  GET_COMMENTS,
} from './graphql/queries';
import { Form, FormQueryResponse } from '../../models/form.model';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { SurveyModel } from 'survey-core';
import { SurveyModule } from 'survey-angular-ui';
import {
  AddRecordMutationResponse,
  EditRecordMutationResponse,
  EditRecordsMutationResponse,
  Record,
  RecordQueryResponse,
} from '../../models/record.model';
import {
  EDIT_RECORD,
  ADD_RECORD,
  EDIT_RECORDS,
  ARCHIVE_RECORD,
} from './graphql/mutations';
import addCustomFunctions from '../../survey/custom-functions';
import { AuthService } from '../../services/auth/auth.service';
import {
  FormBuilderService,
  TemporaryFilesStorage,
} from '../../services/form-builder/form-builder.service';
import { BehaviorSubject, firstValueFrom, takeUntil } from 'rxjs';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import { TranslateService } from '@ngx-translate/core';
import { cleanRecord } from '../../utils/cleanRecord';
import { CommonModule } from '@angular/common';
import { IconModule } from '@oort-front/ui';
import { ButtonModule, SnackbarService, TabsModule } from '@oort-front/ui';
import { RecordSummaryModule } from '../record-summary/record-summary.module';
import { FormActionsModule } from '../form-actions/form-actions.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerModule } from '@oort-front/ui';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import {
  CheckUniqueProprietyReturnT,
  FormHelpersService,
  transformSurveyData,
} from '../../services/form-helper/form-helper.service';
import { DialogModule } from '@oort-front/ui';
import { UploadRecordsComponent } from '../upload-records/upload-records.component';
import { ContextService } from '../../services/context/context.service';
import { CommentsPopupComponent } from './comments-popup/comments-popup.component';
import { Comment, CommentsQueryResponse } from '../../models/comments.model';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { FormPagesLayoutComponent } from '../form-pages-layout/form-pages-layout.component';

/**
 * Interface of Dialog data.
 */
interface DialogData {
  template?: string;
  recordId?: string | [];
  prefillRecords?: Record[];
  prefillData?: any;
  askForConfirm?: boolean;
  alwaysCreateRecord?: boolean;
}
/**
 * Defines the default Dialog data
 */
const DEFAULT_DIALOG_DATA = { askForConfirm: true };

/**
 * Modal to edit or add a record.
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
    CommentsPopupComponent,
    FormPagesLayoutComponent,
  ],
})
export class FormModalComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** Reference to form container */
  @ViewChild('formContainer') formContainer!: ElementRef;
  /** Reference to content view container */
  @ViewChild('uploadRecordsContent', { read: ViewContainerRef })
  uploadRecordsContent!: ViewContainerRef;
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
  public temporaryFilesStorage: TemporaryFilesStorage = new Map();
  /** Stored merged data */
  private storedMergedData: any;
  /** If new records was uploaded */
  private uploadedRecords = false;
  /** Currently commented question */
  @ViewChild('popupTemplate', { static: true })
  popupTemplate!: TemplateRef<any>;
  /** Overlay ref */
  protected overlayRef: OverlayRef | null = null;
  /** Opened button */
  popupAnchor: HTMLElement | null = null;
  /** current question being commented */
  public selectedQuestion = { name: '', title: '' };
  /** Comments list for current record */
  public comments: { [key: string]: Comment[] } = {};
  /** Comments loaded event */
  protected commentsLoaded = new EventEmitter();

  /**
   * Modal to edit or add a record.
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
   * @param contextService Shared context service
   * @param overlay cdk overlay
   * @param viewContainerRef View container ref
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
    protected contextService: ContextService,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.data = { ...DEFAULT_DIALOG_DATA, ...this.data };

    this.isMultiEdition = Array.isArray(this.data.recordId);
    const promises: Promise<FormQueryResponse | RecordQueryResponse | void>[] =
      [];
    // Fetch record data if record id provided
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
              getForm: !this.data.template,
            },
          })
        ).then(({ data }) => {
          this.record = data.record;
          this.modifiedAt = this.isMultiEdition
            ? null
            : this.record?.modifiedAt || null;
          if (!this.data.template) {
            this.form = this.record?.form;
          }
        })
      );
    }
    // Fetch form if no record id provided or specific template provided
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

    // Creates UploadRecordsComponent

    if (this.survey.allowUploadRecords && !this.record) {
      const componentRef = this.uploadRecordsContent.createComponent(
        UploadRecordsComponent
      );

      componentRef.setInput('id', this.form?.id);
      componentRef.setInput('name', this.form?.name);
      componentRef.setInput('path', 'form');
      componentRef.instance.uploaded.subscribe(
        () => (this.uploadedRecords = true)
      );

      /** To use angular hooks */
      componentRef.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Initializes the form
   */
  private initSurvey(): void {
    this.survey = this.formBuilderService.createSurvey(
      this.form?.structure || '',
      this.form?.metadata,
      this.record,
      this.form
    );
    // After the survey is created we add common callback to survey events
    this.formBuilderService.addEventsCallBacksToSurvey(
      this.survey,
      this.selectedPageIndex,
      this.temporaryFilesStorage,
      this.destroy$
    );

    // Set questions readOnly propriety
    const structure = JSON.parse(this.form?.structure || '');
    const pages = structure.pages;
    const initReadOnly = (elements: any): void => {
      elements.forEach((question: any) => {
        if (question.elements) {
          // If question is a panel type that has sub-questions
          initReadOnly(question.elements);
        } else if (question.templateElements) {
          // If question is a paneldynamic type that has sub-questions
          initReadOnly(question.templateElements);
        } else if (this.survey.getQuestionByName(question.name)) {
          this.survey.getQuestionByName(question.name).readOnly =
            question.readOnly ?? false;
        }
      });
    };
    pages.forEach((page: any) => {
      if (page.elements) {
        initReadOnly(page.elements);
      }
    });

    if (this.data.recordId && this.record) {
      addCustomFunctions({
        record: this.record,
        authService: this.authService,
        apollo: this.apollo,
        form: this.form,
        translateService: this.translate,
      });
      this.survey.data = this.isMultiEdition ? null : this.record.data;
      this.survey.showCompletedPage = false;
      this.form?.fields?.forEach((field) => {
        if (field.readOnly && this.survey.getQuestionByName(field.name))
          this.survey.getQuestionByName(field.name).readOnly = true;
      });
    }
    this.survey.onValueChanged.add((_, options) => {
      // Allow user to save as draft
      this.disableSaveAsDraft = false;
      if (this.survey.autoSave) {
        this.formHelpersService.autoSaveRecord(
          options,
          this.onUpdate.bind(this, false, true),
          this
        );
      }
    });
    this.survey.onComplete.add(() => {
      this.onComplete();
      this.formHelpersService.saveDebounced.cancel();
    });
    if (this.storedMergedData) {
      this.survey.data = {
        ...this.survey.data,
        ...omitBy(this.storedMergedData, isNil),
      };
    }
    this.loading = false;
    if (this.survey.canBeCommented && this.record) {
      this.getComments();
      //Cannot comment on newly created record
      this.survey.onAfterRenderQuestion.add((survey, options) => {
        const questionElement = options.htmlElement;
        const question = this.survey
          .getAllQuestions()
          .find((question) => question.id === options.question.id);
        if (!question) {
          return;
        }
        const buttonId = 'popup_button_' + questionElement.id;
        if (document.getElementById(buttonId)) {
          // avoids having duplicated buttons
          return;
        }
        questionElement.classList.add('group');

        // Create the hover button
        const button = document.createElement('button');
        button.className = 'comment-button closed group-hover:opacity-100';
        button.id = buttonId;
        this.setButtonText(button, question.name);
        this.commentsLoaded.subscribe(() => {
          this.setButtonText(button, question.name);
        });

        button.onclick = () => {
          this.selectedQuestion = {
            name: question.name,
            title: question.title,
          };
          this.openPopup(button);
        };
        questionElement.appendChild(button);
      });
    }
  }

  /**
   * Gets the number of resolved comments and affects the number
   *
   * @param button button to modify
   * @param questionName question name to get comments from
   */
  setButtonText(button: HTMLElement, questionName: string) {
    const relatedComments = this.comments[questionName];
    if (relatedComments) {
      const lastResolvedIndex = relatedComments
        .map((comment) => comment.resolved)
        .lastIndexOf(true);
      const unresolvedCount = relatedComments.slice(
        lastResolvedIndex + 1
      ).length;
      if (unresolvedCount > 0) {
        button.classList.add('unresolved');
        button.textContent = `${unresolvedCount}`;
        return;
      }
      button.textContent = `${relatedComments.length}`;
      button.classList.add('resolved');
      return;
    }
    button.textContent = '+';
  }

  /**
   * Gets comments related to current record
   */
  getComments() {
    this.apollo
      .query<CommentsQueryResponse>({
        query: GET_COMMENTS,
        variables: {
          record: this.record?.id,
        },
      })
      .subscribe((comments) => {
        this.comments = comments.data.comments.reduce(
          (acc: { [key: string]: Comment[] }, comment) => {
            if (!acc[comment.questionId]) {
              acc[comment.questionId] = [];
            }
            acc[comment.questionId].push(comment);
            return acc;
          },
          {}
        );
        this.commentsLoaded.emit();
      });
  }

  /**
   * Closes the open popup, and opens a new one next to clicked button
   *
   * @param anchor Button to anchor the popup to
   */
  openPopup(anchor: HTMLElement): void {
    // Close any open popup
    if (this.overlayRef && this.popupAnchor) {
      this.closePopup();
    }
    this.popupAnchor = anchor;
    anchor.classList.replace('closed', 'open');

    // Create overlay position strategy
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(anchor)
      .withPositions([
        {
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'top',
          offsetX: -10,
        },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
    });
    const portal = new TemplatePortal(
      this.popupTemplate,
      this.viewContainerRef
    );
    this.overlayRef.attach(portal);
  }

  /**
   * Closes the popup
   */
  closePopup() {
    this.popupAnchor?.classList.replace('open', 'closed');
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
    this.popupAnchor = null;
  }

  /**
   * Closes the dialog if not in autosave mode
   *
   * @param autoSave whether the save is automatic or manual
   * @param result Optional result to return to the dialog opener.
   * @param options Additional options to customize the closing behavior.
   */
  closeDialog(
    autoSave: boolean,
    result?: FormModalComponent | undefined,
    options?: DialogCloseOptions
  ) {
    if (autoSave) {
      return;
    }
    this.dialogRef.close(result, options);
  }

  /**
   * Listen for clicks anywhere in the document
   *
   * @param event mouse event
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.overlayRef || !this.popupAnchor) {
      return;
    }
    const clickTarget = event.target as Node;
    const overlayElement = this.overlayRef.hostElement;
    if (
      overlayElement &&
      !overlayElement.contains(clickTarget) &&
      !this.popupAnchor.contains(clickTarget)
    ) {
      this.closePopup();
    }
  }

  /**
   * Calls the complete method of the survey if no error.
   */
  public submit(): void {
    this.saving = true;
    if (!this.survey?.hasErrors()) {
      this.survey.completeLastPage();
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant('models.form.notifications.savingFailed'),
        { error: true }
      );
      this.saving = false;
    }
  }

  /**
   * Closes the dialog asking for confirmation if needed.
   */
  public close(): void {
    this.closePopup();
    const surveyData = transformSurveyData(this.survey);
    const recordData = this.record?.data || {};

    // To check if the user modified the data, we check if there's any key on the surveyData
    // that is different from or doesn't exist in the recordData
    const isModified = Object.keys(surveyData).some(
      (key) => surveyData[key] !== recordData[key]
    );
    if (
      this.survey.confirmOnModalClose &&
      !this.survey.autoSave &&
      isModified
    ) {
      const dialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('common.close'),
        content: this.translate.instant(
          'components.record.modal.closeConfirmation'
        ),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmVariant: 'primary',
      });
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          if (value) {
            this.dialogRef.close(!!this.uploadedRecords as any);
          }
        });
    } else {
      this.dialogRef.close(!!this.uploadedRecords as any);
    }
  }

  /**
   * Creates the record, or update it if provided.
   */
  public onComplete = () => {
    this.survey?.clear(false);
    const rowsSelected = Array.isArray(this.data.recordId)
      ? this.data.recordId.length
      : 1;

    /** we can send to backend empty data if they are not required */
    this.formHelpersService.setEmptyQuestions(this.survey);
    // Displays confirmation modal.
    if (this.data.askForConfirm) {
      const dialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant(
          `common.row.update.${rowsSelected > 1 ? 'few' : 'one'}.title`
        ),
        content: this.translate.instant(
          `common.row.update.${rowsSelected > 1 ? 'few' : 'one'}.content`,
          {
            quantity: rowsSelected,
          }
        ),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmVariant: 'primary',
      });
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe(async (value: any) => {
          if (value) {
            await this.onUpdate();
          } else {
            this.saving = false;
          }
        });
      // Updates the data directly.
    } else {
      this.onUpdate();
    }
  };

  /**
   * Handles update data event.
   *
   * @param refreshWidgets if updating/creating resource on resource-modal and widgets using it need to be refreshed
   * @param autoSave whether the save is automatic or manual
   */
  public async onUpdate(
    refreshWidgets = false,
    autoSave = false
  ): Promise<void> {
    this.formHelpersService
      .checkUniquePropriety(this.survey)
      .then(async (response: CheckUniqueProprietyReturnT) => {
        if (response.verified) {
          if (!autoSave) {
            this.loading = true;
          }
          await this.formHelpersService.uploadFiles(
            this.temporaryFilesStorage,
            this.form?.id
          );
          this.temporaryFilesStorage.clear();
          // await Promise.allSettled(promises);
          await this.formHelpersService.createTemporaryRecords(this.survey);
          const editRecord = response.overwriteRecord
            ? response.overwriteRecord
            : this.data.recordId;
          if (editRecord) {
            // If update or creation of record is overwriting another record because unique field values
            const recordId = response.overwriteRecord
              ? response.overwriteRecord.id
              : this.data.recordId;
            if (this.isMultiEdition) {
              this.updateMultipleData(
                recordId,
                this.survey,
                refreshWidgets,
                autoSave
              );
            } else {
              this.updateData(recordId, this.survey, refreshWidgets, autoSave);
            }
          } else {
            this.apollo
              .mutate<AddRecordMutationResponse>({
                mutation: ADD_RECORD,
                variables: {
                  id: this.survey.getVariable('record.id'),
                  form: this.data.template,
                  data: this.survey.getParsedData?.() ?? this.survey.data,
                },
              })
              .subscribe({
                next: async ({ errors, data }) => {
                  if (errors) {
                    this.snackBar.openSnackBar(`Error. ${errors[0].message}`, {
                      error: true,
                    });
                    if (!autoSave) {
                      this.ngZone.run(() => {
                        this.closeDialog(autoSave);
                      });
                    }
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
                    if (refreshWidgets) {
                      this.contextService.setWidgets(
                        await this.formHelpersService.checkResourceOnFilter(
                          this.form?.resource?.id as string,
                          this.contextService.filterStructure.getValue()
                        )
                      );
                    }
                    if (!autoSave) {
                      this.ngZone.run(() => {
                        this.closeDialog(autoSave, {
                          template: this.data.template,
                          data: data?.addRecord,
                        } as any);
                      });
                    }
                    this.data.recordId = data?.addRecord.id;
                  }
                },
                error: (err) => {
                  this.snackBar.openSnackBar(err.message, { error: true });
                },
              });
          }
          this.survey.showCompletedPage = true;
        } else {
          this.snackBar.openSnackBar(
            this.translate.instant('components.form.display.cancelMessage')
          );
          this.survey.clear(false);
          this.saving = false;
        }
      });
  }

  /**
   * Updates a specific record.
   *
   * @param id record id.
   * @param survey current survey.
   * @param refreshWidgets if updating/creating resource on resource-modal and widgets using it need to be refreshed
   * @param autoSave whether the save is automatic or manual
   */
  public updateData(
    id: any,
    survey: SurveyModel,
    refreshWidgets = false,
    autoSave = false
  ): void {
    this.apollo
      .mutate<EditRecordMutationResponse>({
        mutation: EDIT_RECORD,
        variables: {
          id,
          data: survey.getParsedData?.() ?? survey.data,
          template: this.data.template,
        },
      })
      .subscribe({
        next: async ({ errors, data }) => {
          this.handleRecordMutationResponse(
            { data, errors },
            'editRecord',
            autoSave
          );
          if (refreshWidgets) {
            this.contextService.setWidgets(
              await this.formHelpersService.checkResourceOnFilter(
                this.form?.resource?.id as string,
                this.contextService.filterStructure.getValue()
              )
            );
          }
          this.loading = false;
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.loading = false;
        },
      });
  }

  /**
   * Updates multiple records.
   *
   * @param ids list of record ids.
   * @param survey current survey.
   * @param refreshWidgets if updating/creating resource on resource-modal and widgets using it need to be refreshed
   * @param autoSave whether the save is automatic or manual
   */
  public updateMultipleData(
    ids: any,
    survey: SurveyModel,
    refreshWidgets = false,
    autoSave = false
  ): void {
    const recordData = cleanRecord(survey.getParsedData?.() ?? survey.data);
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
        next: async ({ errors, data }) => {
          if (this.lastDraftRecord) {
            const callback = () => {
              this.lastDraftRecord = undefined;
            };
            this.formHelpersService.deleteRecordDraft(
              this.lastDraftRecord,
              callback
            );
          }
          this.handleRecordMutationResponse(
            { data, errors },
            'editRecords',
            autoSave
          );
          if (refreshWidgets) {
            this.contextService.setWidgets(
              await this.formHelpersService.checkResourceOnFilter(
                this.form?.resource?.id as string,
                this.contextService.filterStructure.getValue()
              )
            );
          }
          this.loading = false;
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.loading = false;
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
   * @param autoSave whether we are autosaving the record
   */
  private handleRecordMutationResponse(
    response: { data: any; errors: any },
    responseType: 'editRecords' | 'editRecord',
    autoSave: boolean
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
    } else if (data) {
      if (!autoSave) {
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.objectUpdated', {
            type,
            value: '',
          })
        );
      }
      this.closeDialog(autoSave, {
        template: this.form?.id,
        data: data[responseType],
      } as any);
    }
  }

  /**
   * Handles the show page event
   *
   * @param i The index of the page
   */
  public onShowPage(i: number): void {
    if (this.selectedPageIndex.getValue() !== i) {
      this.selectedPageIndex.next(i);
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
      this.temporaryFilesStorage,
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

  /** Confirms deletion of record using the confirm service and deletes the record if confirmed */
  public async deleteRecord(): Promise<void> {
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('common.deleteObject', {
        name: this.translate.instant('common.record.one'),
      }),
      content: this.translate.instant(
        'components.record.delete.confirmationMessage',
        {
          name: '',
        }
      ),
      confirmText: this.translate.instant('components.confirmModal.delete'),
      confirmVariant: 'danger',
    });

    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe(async (value) => {
      if (value && this.record?.id) {
        this.apollo
          .mutate({
            mutation: ARCHIVE_RECORD,
            variables: {
              id: this.record.id,
            },
          })
          .subscribe((res) => {
            if (res.errors) {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.objectNotDeleted',
                  {
                    value: this.translate.instant('common.record.one'),
                    error: res.errors[0]?.message ?? '',
                  }
                ),
                { error: true }
              );
              return;
            } else {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectDeleted', {
                  value: this.translate.instant('common.record.one'),
                })
              );
              this.dialogRef.close();
            }
          });
      }
    });
  }

  /**
   * Clears the cache for the records created by resource questions
   */
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.survey?.dispose();
  }
}
