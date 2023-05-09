import { Injectable } from '@angular/core';
import * as Survey from 'survey-angular';
import { MatLegacyDialogRef } from '@angular/material/legacy-dialog';
import { Apollo } from 'apollo-angular';
import { SafeSnackBarService } from '../snackbar/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { SafeConfirmService } from '../confirm/confirm.service';
import { firstValueFrom } from 'rxjs';
import {
  UPLOAD_FILE,
  UploadFileMutationResponse,
  AddRecordMutationResponse,
  ADD_RECORD,
} from '../../components/form/graphql/mutations';
import localForage from 'localforage';

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
    private snackBar: SafeSnackBarService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService
  ) {}

  /**
   * Create a dialog modal to confirm the recovery of survey data
   *
   * @param version The version to recover
   * @returns dialogRef
   */
  createRevertDialog(version: any): MatLegacyDialogRef<any> {
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
    return dialogRef;
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

  /**
   * Return an array of promises to upload asynchronously records created on the go while creating a parent record
   *
   * @param survey The form of the parent record
   * @returns A promise with all the requests to upload files
   */
  uploadTemporaryRecords(survey: Survey.SurveyModel): Promise<any>[] {
    const promises: Promise<any>[] = [];
    const surveyData = survey.data;
    const questions = survey.getAllQuestions();
    for (const question of questions) {
      if (question) {
        if (
          question.getType() === 'resources' ||
          question.getType() == 'resource'
        ) {
          //We save the records created from the resources question
          for (const recordId of question.value) {
            const promise = new Promise<void>((resolve, reject) => {
              localForage
                .getItem(recordId)
                .then((data: any) => {
                  if (data != null) {
                    // We ensure to make it only if such a record is found
                    const recordFromResource = JSON.parse(data);
                    this.apollo
                      .mutate<AddRecordMutationResponse>({
                        mutation: ADD_RECORD,
                        variables: {
                          form: recordFromResource.template,
                          data: recordFromResource.data,
                        },
                      })
                      .subscribe({
                        next: ({ data, errors }) => {
                          if (errors) {
                            this.snackBar.openSnackBar(
                              `Error. ${errors[0].message}`,
                              {
                                error: true,
                              }
                            );
                            reject(errors);
                          } else {
                            question.value[question.value.indexOf(recordId)] =
                              question.value.includes(recordId)
                                ? data?.addRecord.id
                                : recordId; // If there is no error, we replace in the question the temporary id by the final one
                            surveyData[question.name] = question.value; // We update the survey data to consider our changes
                            resolve();
                          }
                        },
                        error: (err) => {
                          this.snackBar.openSnackBar(err.message, {
                            error: true,
                          });
                          reject(err);
                        },
                      });
                  } else {
                    resolve(); //there is no data
                  }
                })
                .catch((error: any) => {
                  console.error(error); // Handle any errors that occur while getting the item
                  reject(error);
                });
              localForage.removeItem(recordId); // We clear it from the local storage once we have retrieved it
            });
            promises.push(promise);
          }
        }
      }
    }
    return promises;
  }

  /**
   * Clean cached records from passed survey.
   *
   * @param survey Survey from which we need to clean cached records.
   */
  cleanCachedRecords(survey: Survey.SurveyModel): void {
    survey.getAllQuestions().forEach((question) => {
      if (['resources', 'resource'].includes(question.getType())) {
        question.value.forEach((recordId: any) =>
          localForage.removeItem(recordId)
        );
      }
    });
  }
}
