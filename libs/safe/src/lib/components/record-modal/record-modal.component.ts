import { Apollo } from 'apollo-angular';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog,
} from '@angular/material/legacy-dialog';
import { Form } from '../../models/form.model';
import { Record } from '../../models/record.model';
import * as Survey from 'survey-angular';
import {
  GetRecordByIdQueryResponse,
  GET_RECORD_BY_ID,
  GetFormByIdQueryResponse,
  GET_FORM_STRUCTURE,
} from './graphql/queries';
import addCustomFunctions from '../../utils/custom-functions';
import { SafeAuthService } from '../../services/auth/auth.service';
import { EDIT_RECORD, EditRecordMutationResponse } from './graphql/mutations';
import { SafeSnackBarService } from '../../services/snackbar/snackbar.service';
import { SafeFormBuilderService } from '../../services/form-builder/form-builder.service';
import { BehaviorSubject, firstValueFrom, Observable, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import isEqual from 'lodash/isEqual';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { SafeFormHelpersService } from '../../services/form-helper/form-helper.service';
import { CommonModule } from '@angular/common';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { TabsModule } from '@oort-front/ui';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { SafeRecordSummaryModule } from '../record-summary/record-summary.module';
import { SafeFormActionsModule } from '../form-actions/form-actions.module';
import { SafeDateModule } from '../../pipes/date/date.module';
import { SafeModalModule } from '../ui/modal/modal.module';
import { SpinnerModule, ButtonModule, Variant, Category } from '@oort-front/ui';

/**
 * Interface that describes the structure of the data that will be shown in the dialog
 */
interface DialogData {
  recordId: string;
  compareTo?: any;
  canUpdate?: boolean;
  template?: string;
}

/**
 * Component used to display a modal to modify a record
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TabsModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    SafeRecordSummaryModule,
    SafeFormActionsModule,
    TranslateModule,
    SafeDateModule,
    SafeModalModule,
    ButtonModule,
    SpinnerModule,
  ],
  selector: 'safe-record-modal',
  templateUrl: './record-modal.component.html',
  styleUrls: ['./record-modal.component.scss'],
})
export class SafeRecordModalComponent
  extends SafeUnsubscribeComponent
  implements OnInit, AfterViewInit
{
  // === DATA ===
  public loading = true;
  public form?: Form;
  public record: Record = {};
  public modifiedAt: Date | null = null;
  public selectedTabIndex = 0;
  public survey!: Survey.SurveyModel;
  public surveyNext?: Survey.SurveyModel;
  private pages = new BehaviorSubject<any[]>([]);
  public canEdit: boolean | undefined = false;

  @ViewChild('formContainer', { static: false })
  formContainer!: ElementRef;
  @ViewChild('formContainerNext', { static: false })
  formContainerNext!: ElementRef;

  environment: any;

  // === UI VARIANT AND CATEGORY ===
  public variant = Variant;
  public category = Category;

  /**
   * Getter for the different pages of the form
   *
   * @returns The pages as an observable
   */
  public get pages$(): Observable<any[]> {
    return this.pages.asObservable();
  }

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param dialogRef This is the reference to the dialog that is being opened.
   * @param data This is the data that is passed to the modal when it is opened.
   * @param apollo This is the Apollo client that we'll use to make GraphQL requests.
   * @param dialog This is the Material dialog service
   * @param authService This is the service that handles the authentication of the user
   * @param snackBar This is the service that allows you to display a snackbar message to the user.
   * @param formBuilderService This is the service that will be used to build forms.
   * @param formHelpersService This is the service to handle forms.
   * @param translate This is the service that allows us to translate the text in the modal.
   */
  constructor(
    public dialogRef: MatDialogRef<SafeRecordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apollo: Apollo,
    public dialog: MatDialog,
    private authService: SafeAuthService,
    private snackBar: SafeSnackBarService,
    private formBuilderService: SafeFormBuilderService,
    private formHelpersService: SafeFormHelpersService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setFormListeners();
  }

  async ngAfterViewInit(): Promise<void> {
    this.canEdit = this.data.canUpdate;
    Survey.StylesManager.applyTheme();

    const promises: Promise<
      GetFormByIdQueryResponse | GetRecordByIdQueryResponse | void
    >[] = [];
    // Fetch structure from template if needed
    if (this.data.template) {
      promises.push(
        firstValueFrom(
          this.apollo.query<GetFormByIdQueryResponse>({
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
    // Fetch record data
    promises.push(
      firstValueFrom(
        this.apollo.query<GetRecordByIdQueryResponse>({
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
    await Promise.all(promises);
    // INIT SURVEY
    this.initSurvey();
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
   * Initializes the form
   */
  private initSurvey() {
    this.survey = this.formBuilderService.createSurvey(
      this.form?.structure || '',
      this.pages,
      this.form?.metadata,
      this.record
    );

    addCustomFunctions(Survey, this.authService, this.record);
    this.survey.data = this.record.data;

    this.survey.mode = 'display';
    this.survey.render(this.formContainer.nativeElement);

    if (this.data.compareTo) {
      this.surveyNext = this.formBuilderService.createSurvey(
        this.form?.structure || '',
        this.pages,
        this.form?.metadata,
        this.record
      );
      this.surveyNext.data = this.data.compareTo.data;
      this.surveyNext.mode = 'display';
      this.surveyNext.render(this.formContainerNext.nativeElement);
      // Set list of updated questions
      const updatedQuestions: string[] = [];
      const allQuestions = [this.surveyNext.data, this.survey.data].reduce(
        (keys, object) => keys.concat(Object.keys(object)),
        []
      );
      for (const question of allQuestions) {
        const valueNext = this.surveyNext.data[question];
        const value = this.survey.data[question];
        if (!isEqual(value, valueNext)) {
          updatedQuestions.push(question);
        }
      }
      // @TODO CHECK => Repeated, the callback below is the only one applied
      // this.survey.onAfterRenderQuestion.add(
      //   (survey: Survey.SurveyModel, options: any): void => {
      //     if (updatedQuestions.includes(options.question.valueName)) {
      //       options.htmlElement.style.background = '#b2ebbf';
      //     }
      //   }
      // );
      this.surveyNext.onAfterRenderQuestion.add(
        (survey: Survey.SurveyModel, options: any): void => {
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
    this.selectedTabIndex = i;
    if (this.data.compareTo && this.surveyNext) {
      this.surveyNext.currentPageNo = i;
    }
  }

  /**
   * Handles the edition of the record and closes the dialog
   */
  public onEdit(): void {
    this.dialogRef.close(true);
  }

  /**
   * Closes the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
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
}
