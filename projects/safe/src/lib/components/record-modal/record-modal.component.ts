import { Apollo } from 'apollo-angular';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Form } from '../../models/form.model';
import { Record } from '../../models/record.model';
import { v4 as uuidv4 } from 'uuid';
import * as Survey from 'survey-angular';
import {
  GetRecordByIdQueryResponse,
  GET_RECORD_BY_ID,
  GetFormByIdQueryResponse,
  GET_FORM_STRUCTURE,
  GetRecordDetailsQueryResponse,
  GET_RECORD_DETAILS,
} from '../../graphql/queries';
import addCustomFunctions from '../../utils/custom-functions';
import { SafeDownloadService } from '../../services/download.service';
import { SafeAuthService } from '../../services/auth.service';
import { SafeConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import {
  EDIT_RECORD,
  EditRecordMutationResponse,
} from '../../graphql/mutations';
import { SafeSnackBarService } from '../../services/snackbar.service';
import { SafeFormBuilderService } from '../../services/form-builder.service';
import { RecordHistoryModalComponent } from '../record-history-modal/record-history-modal.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

interface DialogData {
  recordId: string;
  locale?: string;
  compareTo?: any;
  canUpdate?: boolean;
  template?: string;
}

@Component({
  selector: 'safe-record-modal',
  templateUrl: './record-modal.component.html',
  styleUrls: ['./record-modal.component.scss'],
})
export class SafeRecordModalComponent implements OnInit {
  // === DATA ===
  public loading = true;
  public form?: Form;
  public record: Record = {};
  public modifiedAt: Date | null = null;
  public selectedTabIndex = 0;
  public survey!: Survey.Model;
  public surveyNext: Survey.Model | null = null;
  private pages = new BehaviorSubject<any[]>([]);
  public canEdit: boolean | undefined = false;

  public containerId: string;
  public containerNextId = '';

  environment: any;

  public get pages$(): Observable<any[]> {
    return this.pages.asObservable();
  }

  constructor(
    public dialogRef: MatDialogRef<SafeRecordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    @Inject('environment') environment: any,
    private apollo: Apollo,
    public dialog: MatDialog,
    private downloadService: SafeDownloadService,
    private authService: SafeAuthService,
    private snackBar: SafeSnackBarService,
    private formBuilderService: SafeFormBuilderService,
    private translate: TranslateService
  ) {
    this.containerId = uuidv4();
    if (this.data.compareTo) {
      this.containerNextId = uuidv4();
    }
    this.environment = environment;
  }

  async ngOnInit(): Promise<void> {
    this.canEdit = this.data.canUpdate;
    const defaultThemeColorsSurvey = Survey.StylesManager.ThemeColors.default;
    defaultThemeColorsSurvey['$main-color'] = this.environment.theme.primary;
    defaultThemeColorsSurvey['$main-hover-color'] =
      this.environment.theme.primary;

    Survey.StylesManager.applyTheme();
    const promises: Promise<
      GetFormByIdQueryResponse | GetRecordByIdQueryResponse | void
    >[] = [];
    // Fetch structure from template if needed
    if (this.data.template) {
      promises.push(
        this.apollo
          .query<GetFormByIdQueryResponse>({
            query: GET_FORM_STRUCTURE,
            variables: {
              id: this.data.template,
            },
          })
          .toPromise()
          .then((res) => {
            this.form = res.data.form;
          })
      );
    }
    // Fetch record data
    promises.push(
      this.apollo
        .query<GetRecordByIdQueryResponse>({
          query: GET_RECORD_BY_ID,
          variables: {
            id: this.data.recordId,
          },
        })
        .toPromise()
        .then((res) => {
          this.record = res.data.record;
          this.modifiedAt = this.record.modifiedAt || null;
          if (!this.data.template) {
            this.form = this.record.form;
          }
        })
    );
    await Promise.all(promises);
    // INIT SURVEY
    addCustomFunctions(Survey, this.authService, this.apollo, this.record);
    this.survey = this.formBuilderService.createSurvey(
      this.form?.structure || ''
    );
    this.survey.onDownloadFile.add((survey: Survey.SurveyModel, options: any) =>
      this.onDownloadFile(survey, options)
    );
    this.survey.onCurrentPageChanged.add(
      (survey: Survey.SurveyModel, options: any) => {
        this.selectedTabIndex = survey.currentPageNo;
      }
    );
    this.survey.data = this.record.data;
    this.survey.locale = this.data.locale ? this.data.locale : 'en';
    this.survey.mode = 'display';
    this.survey.showNavigationButtons = 'none';
    this.survey.showProgressBar = 'off';
    this.survey.render(this.containerId);
    this.setPages();
    if (this.data.compareTo) {
      this.surveyNext = this.formBuilderService.createSurvey(
        this.form?.structure || ''
      );
      this.survey.onDownloadFile.add(
        (survey: Survey.SurveyModel, options: any) =>
          this.onDownloadFile(survey, options)
      );
      this.surveyNext.data = this.data.compareTo.data;
      this.surveyNext.locale = this.data.locale ? this.data.locale : 'en';
      this.surveyNext.mode = 'display';
      this.surveyNext.showNavigationButtons = 'none';
      this.surveyNext.showProgressBar = 'off';
      // Set list of updated questions
      const updatedQuestions: string[] = [];
      const allQuestions = [this.surveyNext.data, this.survey.data].reduce(
        (keys, object) => keys.concat(Object.keys(object)),
        []
      );
      for (const question of allQuestions) {
        const valueNext = this.surveyNext.data[question];
        const value = this.survey.data[question];
        if (!valueNext && !value) {
          continue;
        } else {
          if (valueNext !== value) {
            updatedQuestions.push(question);
          }
        }
      }
      this.survey.onAfterRenderQuestion.add(
        (survey: Survey.SurveyModel, options: any): void => {
          if (updatedQuestions.includes(options.question.valueName)) {
            options.htmlElement.style.background = '#b2ebbf';
          }
        }
      );
      this.surveyNext.onAfterRenderQuestion.add(
        (survey: Survey.SurveyModel, options: any): void => {
          if (updatedQuestions.includes(options.question.valueName)) {
            options.htmlElement.style.background = '#EBB2B2';
          }
        }
      );
      this.surveyNext.render(this.containerNextId);
    }
    this.loading = false;
  }

  public onShowPage(i: number): void {
    this.survey.currentPageNo = i;
    this.selectedTabIndex = i;
    if (this.data.compareTo && this.surveyNext) {
      this.surveyNext.currentPageNo = i;
    }
  }

  /* Download the file.
   */
  private onDownloadFile(survey: Survey.SurveyModel, options: any): void {
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

  public onEdit(): void {
    this.dialogRef.close(true);
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

  /**
   * Closes the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
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
            this.snackBar.openSnackBar(
              this.translate.instant('notification.dataRecovered')
            );
            this.dialogRef.close();
          });
      }
    });
  }

  /**
   * Opens the history of the record in a modal.
   */
  public onShowHistory(): void {
    this.apollo
      .query<GetRecordDetailsQueryResponse>({
        query: GET_RECORD_DETAILS,
        variables: {
          id: this.record.id,
        },
      })
      .subscribe((res) => {
        this.dialog.open(RecordHistoryModalComponent, {
          data: {
            record: res.data.record,
            revert: (item: any, dialog: any) => {
              this.confirmRevertDialog(res.data.record, item);
            },
          },
          panelClass: 'no-padding-dialog',
          autoFocus: false,
        });
      });
  }
}
