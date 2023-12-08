import { Apollo } from 'apollo-angular';
import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';
import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { SurveyModel } from 'survey-core';
import { SurveyModule } from 'survey-angular-ui';
import { Form, FormQueryResponse } from '../../models/form.model';
import {
  EditRecordMutationResponse,
  Record,
  RecordQueryResponse,
} from '../../models/record.model';
import { GET_RECORD_BY_ID, GET_FORM_STRUCTURE } from './graphql/queries';
import addCustomFunctions from '../../utils/custom-functions';
import { AuthService } from '../../services/auth/auth.service';
import { EDIT_RECORD } from './graphql/mutations';
import { FormBuilderService } from '../../services/form-builder/form-builder.service';
import { BehaviorSubject, firstValueFrom, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import isEqual from 'lodash/isEqual';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { FormHelpersService } from '../../services/form-helper/form-helper.service';
import { CommonModule } from '@angular/common';
import { SnackbarService, TabsModule } from '@oort-front/ui';
import { IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { RecordSummaryModule } from '../record-summary/record-summary.module';
import { FormActionsModule } from '../form-actions/form-actions.module';
import { DateModule } from '../../pipes/date/date.module';
import { SpinnerModule, ButtonModule } from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';

/**
 * Interface that describes the structure of the data that will be shown in the dialog
 */
interface DialogData {
  recordId: string;
  compareTo?: any;
  canUpdate?: boolean;
  template?: string;
  isTemporary?: boolean;
  temporaryRecordData?: any;
}

/**
 * Component used to display a modal to modify a record
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    TabsModule,
    IconModule,
    RecordSummaryModule,
    FormActionsModule,
    TranslateModule,
    DateModule,
    ButtonModule,
    SpinnerModule,
    SurveyModule,
  ],
  selector: 'shared-record-modal',
  templateUrl: './record-modal.component.html',
  styleUrls: ['../../style/survey.scss', './record-modal.component.scss'],
})
export class RecordModalComponent
  extends UnsubscribeComponent
  implements AfterViewInit, OnDestroy
{
  // === DATA ===
  public loading = true;
  public form?: Form;
  public record: Record = {};
  public modifiedAt: Date | null = null;
  public survey!: SurveyModel;
  public surveyNext?: SurveyModel;
  public canEdit: boolean | undefined = false;

  environment: any;

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
   * @param dialogRef This is the reference to the dialog that is being opened.
   * @param data This is the data that is passed to the modal when it is opened.
   * @param apollo This is the Apollo client that we'll use to make GraphQL requests.
   * @param dialog This is the Dialog service
   * @param authService This is the service that handles the authentication of the user
   * @param snackBar This is the service that allows you to display a snackbar message to the user.
   * @param formBuilderService This is the service that will be used to build forms.
   * @param formHelpersService This is the service to handle forms.
   * @param translate This is the service that allows us to translate the text in the modal.
   */
  constructor(
    public dialogRef: DialogRef<RecordModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private apollo: Apollo,
    public dialog: Dialog,
    private authService: AuthService,
    private snackBar: SnackbarService,
    private formBuilderService: FormBuilderService,
    private formHelpersService: FormHelpersService,
    private translate: TranslateService
  ) {
    super();
  }

  async ngAfterViewInit(): Promise<void> {
    this.canEdit = this.data.canUpdate;

    const promises: Promise<FormQueryResponse | RecordQueryResponse | void>[] =
      [];
    // Fetch structure from template if needed
    if (this.data.template) {
      promises.push(
        firstValueFrom(
          this.apollo.query<FormQueryResponse>({
            query: GET_FORM_STRUCTURE,
            variables: {
              id: this.data.template,
            },
          })
        ).then(({ data }) => {
          this.form = data.form;
        })
      );
    }

    if (this.data.isTemporary) {
      this.modifiedAt = new Date();
      this.record = { data: this.data.temporaryRecordData };
    }
    // Fetch record data
    else {
      promises.push(
        firstValueFrom(
          this.apollo.query<RecordQueryResponse>({
            query: GET_RECORD_BY_ID,
            variables: {
              id: this.data.recordId,
            },
          })
        ).then(({ data }) => {
          this.record = data.record;
          this.modifiedAt = this.record.modifiedAt || null;
          if (!this.data.template) {
            this.form = this.record.form;
          }
        })
      );
    }
    await Promise.all(promises);
    // INIT SURVEY
    this.initSurvey();
  }

  /**
   * Initializes the form
   */
  private initSurvey() {
    this.data.isTemporary
      ? (this.survey = this.formBuilderService.createSurvey(
          this.form?.structure || '',
          this.form?.metadata,
          this.record
        ))
      : (this.survey = this.formBuilderService.createSurvey(
          this.form?.structure || '',
          this.form?.metadata
        ));

    addCustomFunctions(this.authService, this.record);
    this.survey.data = this.record.data;

    this.survey.mode = 'display';
    // After the survey is created we add common callback to survey events
    this.formBuilderService.addEventsCallBacksToSurvey(
      this.survey,
      this.selectedPageIndex,
      {}
    );

    if (this.data.compareTo) {
      this.surveyNext = this.formBuilderService.createSurvey(
        this.form?.structure || '',
        this.form?.metadata,
        this.record
      );
      if (this.surveyNext) {
        this.surveyNext.data = this.data.compareTo.data;
        this.surveyNext.mode = 'display';
      }
      // After the survey is created we add common callback to survey events
      this.formBuilderService.addEventsCallBacksToSurvey(
        this.surveyNext,
        this.selectedPageIndex,
        {}
      );

      // Set list of updated questions
      const updatedQuestions: string[] = [];
      const allQuestions = [this.surveyNext?.data, this.survey.data].reduce(
        (keys, object) => keys.concat(Object.keys(object)),
        []
      );
      for (const question of allQuestions) {
        const valueNext = this.surveyNext?.data[question];
        const value = this.survey.data[question];
        if (!isEqual(value, valueNext) && (value || valueNext)) {
          updatedQuestions.push(question);
        }
      }
      this.survey.onAfterRenderQuestion.add(
        (survey: SurveyModel, options: any): void => {
          if (updatedQuestions.includes(options.question.valueName)) {
            options.htmlElement.style.background = '#b2ebbf';
          }
        }
      );
      this.surveyNext?.onAfterRenderQuestion.add(
        (survey: SurveyModel, options: any): void => {
          if (updatedQuestions.includes(options.question.valueName)) {
            options.htmlElement.style.background = '#EBB2B2';
          }
        }
      );
    }
    this.loading = false;
  }

  /**
   * Shows a page of the form
   *
   * @param i Index of the page to show
   */
  public onShowPage(i: number): void {
    this.survey.currentPageNo = i;
    if (this.data.compareTo && this.surveyNext) {
      this.surveyNext.currentPageNo = i;
    }
  }

  /**
   * Handles the edition of the record and closes the dialog
   */
  public onEdit(): void {
    this.dialogRef.close(true as any);
  }

  /**
   * Opens the history of the record in a modal.
   */
  public async onShowHistory(): Promise<void> {
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
              this.dialogRef.close();
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
    this.survey?.dispose();
    this.surveyNext?.dispose();
  }
}
