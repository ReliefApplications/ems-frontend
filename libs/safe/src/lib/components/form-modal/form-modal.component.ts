import { Apollo } from 'apollo-angular';
import {
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  GetFormByIdQueryResponse,
  GetRecordByIdQueryResponse,
  GET_RECORD_BY_ID,
  GET_FORM_BY_ID,
} from './graphql/queries';
import { Form } from '../../models/form.model';
import { Record } from '../../models/record.model';
import * as Survey from 'survey-angular';
import {
  EditRecordMutationResponse,
  EDIT_RECORD,
  AddRecordMutationResponse,
  ADD_RECORD,
  EDIT_RECORDS,
  EditRecordsMutationResponse,
} from './graphql/mutations';
import { SafeConfirmService } from '../../services/confirm/confirm.service';
import addCustomFunctions from '../../utils/custom-functions';
import { SafeAuthService } from '../../services/auth/auth.service';
import { SafeFormBuilderService } from '../../services/form-builder/form-builder.service';
import { BehaviorSubject, firstValueFrom, Observable, takeUntil } from 'rxjs';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import { TranslateService } from '@ngx-translate/core';
import { cleanRecord } from '../../utils/cleanRecord';
import { CommonModule } from '@angular/common';
import { IconModule } from '@oort-front/ui';
import { ButtonModule, SnackbarService, TabsModule } from '@oort-front/ui';
import { SafeRecordSummaryModule } from '../record-summary/record-summary.module';
import { SafeFormActionsModule } from '../form-actions/form-actions.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerModule } from '@oort-front/ui';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { SafeFormHelpersService } from '../../services/form-helper/form-helper.service';
import { DialogModule } from '@oort-front/ui';

/**
 * Interface of Dialog data.
 */
interface DialogData {
  template?: string;
  recordId?: string | [];
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
  standalone: true,
  selector: 'safe-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss'],
  imports: [
    CommonModule,
    IconModule,
    TabsModule,
    SafeRecordSummaryModule,
    SafeFormActionsModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    SpinnerModule,
  ],
})
export class SafeFormModalComponent
  extends SafeUnsubscribeComponent
  implements OnInit, OnDestroy
{
  // === DATA ===
  public loading = true;
  public saving = false;
  public form?: Form;
  public record?: Record;

  public modifiedAt: Date | null = null;

  protected isMultiEdition = false;
  private storedMergedData: any;

  public survey!: Survey.SurveyModel;
  public selectedTabIndex = 0;
  private pages = new BehaviorSubject<any[]>([]);
  protected temporaryFilesStorage: any = {};

  @ViewChild('formContainer') formContainer!: ElementRef;

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
    public dialogRef: DialogRef<SafeFormModalComponent>,
    private apollo: Apollo,
    protected snackBar: SnackbarService,
    private authService: SafeAuthService,
    private formBuilderService: SafeFormBuilderService,
    protected formHelpersService: SafeFormHelpersService,
    protected confirmService: SafeConfirmService,
    protected translate: TranslateService,
    protected ngZone: NgZone
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.setFormListeners();

    this.data = { ...DEFAULT_DIALOG_DATA, ...this.data };
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
        firstValueFrom(
          this.apollo.query<GetRecordByIdQueryResponse>({
            query: GET_RECORD_BY_ID,
            variables: {
              id,
            },
          })
        ).then(({ data }) => {
          this.record = data.record;
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
        firstValueFrom(
          this.apollo.query<GetFormByIdQueryResponse>({
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
      this.pages,
      this.form?.metadata,
      this.record
    );
    // After the survey is created we add common callback to survey events
    this.formBuilderService.addEventsCallBacksToSurvey(
      this.survey,
      this.pages,
      this.temporaryFilesStorage
    );

    if (this.data.recordId && this.record) {
      addCustomFunctions(Survey, this.authService, this.record);
      this.survey.data = this.isMultiEdition ? null : this.record.data;
      this.survey.showCompletedPage = false;
    }
    this.survey.onComplete.add(this.onComplete);
    if (this.storedMergedData) {
      this.survey.data = {
        ...this.survey.data,
        ...omitBy(this.storedMergedData, isNil),
      };
    }
    this.survey.render(this.formContainer.nativeElement);
    // this.survey.render(this.containerId);
    this.loading = false;
  }

  /**
   * Set needed listeners for the component
   */
  private setFormListeners() {
    this.formBuilderService.selectedPageIndex
      .asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((pageIndex: number) => (this.selectedTabIndex = pageIndex));
  }

  /**
   * Calls the complete method of the survey if no error.
   */
  public submit(): void {
    this.saving = true;
    if (!this.survey?.hasErrors()) {
      this.survey?.completeLastPage();
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant('models.form.notifications.savingFailed'),
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
    const rowsSelected = Array.isArray(this.data.recordId)
      ? this.data.recordId.length
      : 1;

    /** we can send to backend empty data if they are not required */
    this.formHelpersService.setEmptyQuestions(survey);
    // Displays confirmation modal.
    if (this.data.askForConfirm) {
      const dialogRef = this.confirmService.openConfirmModal({
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
      });
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
    const promises = this.formHelpersService.uploadTemporaryRecords(survey);
    promises.push(
      this.formHelpersService.uploadFiles(
        survey,
        this.temporaryFilesStorage,
        this.form?.id
      )
    );

    await Promise.allSettled(promises);
    await this.formHelpersService.createCachedRecords(survey);

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
              this.ngZone.run(() => {
                this.dialogRef.close({
                  template: this.data.template,
                  data: data?.addRecord,
                } as any);
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
          if (errors) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotUpdated', {
                type: this.translate.instant('common.record.one'),
                error: errors ? errors[0].message : '',
              }),
              { error: true }
            );
          } else {
            if (data) {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectUpdated', {
                  type: this.translate.instant('common.record.one'),
                  value: '',
                })
              );
              this.dialogRef.close({
                template: this.form?.id,
                data: data.editRecord,
              } as any);
            }
          }
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
          if (errors) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotUpdated', {
                type: this.translate.instant('common.record.few'),
                error: errors ? errors[0].message : '',
              }),
              { error: true }
            );
          } else {
            if (data) {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectUpdated', {
                  type: this.translate.instant('common.record.few'),
                  value: '',
                })
              );
              this.dialogRef.close({
                template: this.form?.id,
                data: data.editRecords,
              } as any);
            }
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
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
    //       confirmVariant: 'primary'
    //     }
    //   });
    //   closeDialogRef.closed.subscribe((value: any) => {
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
   * Clears the cache for the records created by resource questions
   */
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.formHelpersService.cleanCachedRecords(this.survey);
  }
}
