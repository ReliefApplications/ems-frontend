import { Injectable } from '@angular/core';
import * as Survey from 'survey-angular';
import { Apollo } from 'apollo-angular';
import { TranslateService } from '@ngx-translate/core';
import { SafeConfirmService } from '../confirm/confirm.service';
import { firstValueFrom } from 'rxjs';
import {
  UPLOAD_FILE,
  UploadFileMutationResponse,
} from '../../components/form/graphql/mutations';
import { DialogRef } from '@angular/cdk/dialog';
import { SnackbarService } from '@oort-front/ui';

/**
 * Shared survey helper service.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeFormHelpersService {
  /**
   * Shared survey helper service.
   *
   * @param apollo Apollo client
   * @param snackBar This is the service that allows you to display a snackbar.
   * @param confirmService This is the service that will be used to display confirm window.
   * @param translate This is the service that allows us to translate the text in our application.
   */
  constructor(
    public apollo: Apollo,
    private snackBar: SnackbarService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService
  ) {}

  /**
   * Create a dialog modal to confirm the recovery of survey data
   *
   * @param version The version to recover
   * @returns dialogRef
   */
  createRevertDialog(version: any): DialogRef<any> {
    // eslint-disable-next-line radix
    const date = new Date(parseInt(version.createdAt, 0));
    const formatDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('components.record.recovery.title'),
      content: this.translate.instant(
        'components.record.recovery.confirmationMessage',
        { date: formatDate }
      ),
      confirmText: this.translate.instant('components.confirmModal.confirm'),
      confirmColor: 'primary',
    });
    return dialogRef as any;
  }

  /**
   * Set data from survey empty questions
   *
   * @param survey Current survey to set up empty questions
   */
  setEmptyQuestions(survey: Survey.SurveyModel): void {
    // We get all the questions from the survey and check which ones contains values
    const questions = survey.getAllQuestions();
    for (const field in questions) {
      if (questions[field]) {
        const key = questions[field].getValueName();
        // If there is no value for this question
        if (!survey.data[key]) {
          // And is not boolean(false by default, we want to save that), we nullify it
          if (questions[field].getType() !== 'boolean') {
            survey.data[key] = null;
          }
          // Or if is not visible or not actionable by the user, we don't want to save it, just delete the field from the data
          if (questions[field].readOnly || !questions[field].visible) {
            delete survey.data[key];
          }
        }
      }
    }
  }

  /**
   * Upload asynchronously files to create questions in the form
   *
   * @param survey The form in which the files will be updated
   * @param temporaryFilesStorage Temporary files saved while executing the survey
   * @param formId Form where to upload the files
   */
  async uploadFiles(
    survey: any,
    temporaryFilesStorage: any,
    formId: string | undefined
  ): Promise<void> {
    const data = survey.data;
    const questionsToUpload = Object.keys(temporaryFilesStorage);
    for (const name of questionsToUpload) {
      const files = temporaryFilesStorage[name];
      for (const [index, file] of files.entries()) {
        const res = await firstValueFrom(
          this.apollo.mutate<UploadFileMutationResponse>({
            mutation: UPLOAD_FILE,
            variables: {
              file,
              form: formId,
            },
            context: {
              useMultipart: true,
            },
          })
        );
        if (res.errors) {
          this.snackBar.openSnackBar(res.errors[0].message, { error: true });
          return;
        } else {
          data[name][index].content = res.data?.uploadFile;
        }
      }
    }
    survey.data = data;
  }
}
