import { Inject, Injectable } from '@angular/core';
import { PageModel, SurveyModel } from 'survey-core';
import { Apollo } from 'apollo-angular';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmService } from '../confirm/confirm.service';
import { firstValueFrom } from 'rxjs';
import { ADD_RECORD } from '../../components/form/graphql/mutations';
import { DialogRef } from '@angular/cdk/dialog';
import { SnackbarService } from '@oort-front/ui';
import localForage from 'localforage';
import { snakeCase, cloneDeep, set, get, isNil } from 'lodash';
import { AuthService } from '../auth/auth.service';
import { BlobType, DownloadService } from '../download/download.service';
import {
  AddDraftRecordMutationResponse,
  AddRecordMutationResponse,
  EditDraftRecordMutationResponse,
} from '../../models/record.model';
import { Question } from '../../survey/types';
import {
  ADD_DRAFT_RECORD,
  DELETE_DRAFT_RECORD,
  EDIT_DRAFT_RECORD,
} from './graphql/mutations';
/**
 * Shared survey helper service.
 */
@Injectable({
  providedIn: 'root',
})
export class FormHelpersService {
  /**
   * Shared survey helper service.
   *
   * @param environment Environment configuration
   * @param apollo Apollo client
   * @param snackBar This is the service that allows you to display a snackbar.
   * @param confirmService This is the service that will be used to display confirm window.
   * @param translate This is the service that allows us to translate the text in our application.
   * @param authService Shared auth service
   * @param downloadService Shared download service
   */
  constructor(
    @Inject('environment') private environment: any,
    public apollo: Apollo,
    private snackBar: SnackbarService,
    private confirmService: ConfirmService,
    private translate: TranslateService,
    private authService: AuthService,
    private downloadService: DownloadService
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
      confirmVariant: 'primary',
    });
    return dialogRef as any;
  }

  /**
   * Set data from survey empty questions
   *
   * @param survey Current survey to set up empty questions
   */
  setEmptyQuestions(survey: SurveyModel): void {
    // We get all the questions from the survey and check which ones contains values
    const questions = survey.getAllQuestions();
    const data = { ...survey.data };
    for (const field in questions) {
      if (questions[field]) {
        const key = questions[field].getValueName();
        // If there is no value for this question
        if (isNil(survey.data[key])) {
          // And is not boolean(false by default, we want to save that), we nullify it
          if (questions[field].getType() !== 'boolean') {
            // survey.data[key] = null;
            set(data, key, null);
          }
          // Or if is not visible or not actionable by the user, we don't want to save it, just delete the field from the data
          if (questions[field].readOnly || !questions[field].visible) {
            delete data[key];
          }
        }
      }
    }
    survey.data = data;
  }

  /**
   * Upload asynchronously files to create questions in the form
   *
   * @param survey The form in which the files will be updated
   * @param temporaryFilesStorage Temporary files saved while executing the survey
   * @param formId Form where to upload the files
   */
  async uploadFiles(
    survey: SurveyModel,
    temporaryFilesStorage: any,
    formId: string | undefined
  ): Promise<void> {
    if (!formId) {
      throw new Error('Form id is not defined');
    }

    const data = survey.data;
    const questionsToUpload = Object.keys(temporaryFilesStorage);
    for (const name of questionsToUpload) {
      const files = temporaryFilesStorage[name];
      for (const [index, file] of files.entries()) {
        const path = await this.downloadService.uploadBlob(
          file,
          BlobType.RECORD_FILE,
          formId
        );
        if (path) {
          const fileContent = data[name][index].content;
          data[name][index].content = path;

          // Check if any other question is using the same file
          survey.getAllQuestions().forEach((question) => {
            const questionType = question.getType();
            if (
              questionType !== 'file' ||
              // Only change files that are not in the temporary storage
              // meaning their values came from the default values
              !!temporaryFilesStorage[question.name]
            )
              return;

            const files = data[question.name] ?? [];
            files.forEach((file: any) => {
              if (file && file.content === fileContent) {
                file.content = path;
              }
            });
          });
        }
      }
    }
    survey.data = cloneDeep(data);
  }

  /**
   * Return an array of promises to upload asynchronously records created on the go while creating a parent record
   *
   * @param survey The form of the parent record
   * @returns A promise with all the requests to upload files
   */
  uploadTemporaryRecords(survey: SurveyModel): Promise<any>[] {
    const promises: Promise<any>[] = [];
    const surveyData = survey.data;
    const questions = survey.getAllQuestions();
    for (const question of questions) {
      if (question && question.value) {
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
   * Create temporary records (from resource/s questions) of passed survey.
   *
   * @param survey Survey to get questions from
   */
  public async createTemporaryRecords(survey: SurveyModel): Promise<void> {
    const promises: Promise<any>[] = [];
    const questions = survey.getAllQuestions();
    const nestedRecordsToAdd: { draftIds: []; question: Question }[] = [];

    // Callbacks to update the ids of new records
    const updateIds: {
      [key in string]: (arg0: string) => void;
    } = {};

    // Get all nested records to add
    questions.forEach((question: Question) => {
      const type = question.getType();
      if (!['resource', 'resources'].includes(type) || !question.draftData) {
        return;
      }
      const isResource = type === 'resource';
      const toAdd = (isResource ? [question.value] : question.value).filter(
        (id: string) => id in question.draftData
      );
      nestedRecordsToAdd.push({
        draftIds: toAdd,
        question,
      });

      toAdd.forEach((id: string) => {
        updateIds[id] = (newId: string) => {
          question.value = isResource
            ? newId
            : question.value.map((x: string) => (x === id ? newId : x));
        };
      });
    });

    for (const element of nestedRecordsToAdd) {
      for (const draftId of element.draftIds) {
        const data = element.question.draftData[draftId];
        const template = element.question.template;

        promises.push(
          firstValueFrom(
            this.apollo.mutate<AddRecordMutationResponse>({
              mutation: ADD_RECORD,
              variables: {
                form: template,
                data,
              },
            })
          ).then((res) => {
            // change the draftId to the new recordId
            const newId = res.data?.addRecord?.id;
            if (!newId) return;
            updateIds[draftId](newId);
            // update question.newCreatedRecords too
            const isResource = element.question.getType() === 'resource';
            const draftIndex = (
              isResource
                ? [element.question.newCreatedRecords]
                : element.question.newCreatedRecords
            ).indexOf(draftId);
            if (draftIndex !== -1) {
              if (isResource) {
                element.question.newCreatedRecords = newId;
              } else {
                element.question.newCreatedRecords[draftIndex] = newId;
              }
            }
            // delete old temporary/draft record and data
            this.deleteRecordDraft(draftId);
            delete element.question.draftData[draftId];
            return;
          })
        );
      }
    }

    await Promise.all(promises);
  }

  /**
   * Registration of new custom variables for the survey.
   * Custom variables can be used in the logic fields.
   *
   * @param survey Survey instance
   */
  public addUserVariables = (survey: SurveyModel) => {
    const user = this.authService.user.getValue();

    // set user variables
    survey.setVariable('user.name', user?.name ?? '');
    survey.setVariable('user.firstName', user?.firstName ?? '');
    survey.setVariable('user.lastName', user?.lastName ?? '');
    survey.setVariable('user.email', user?.username ?? '');

    // Set user attributes
    for (const attribute of this.environment.user?.attributes || []) {
      survey.setVariable(
        `user.${attribute}`,
        get(user?.attributes, attribute) || ''
      );
    }

    // Allow us to do some cool stuff like
    // {user.roles} contains '62e3e676c9bcb900656c95c9'
    survey.setVariable('user.roles', user?.roles?.map((r) => r.id || '') ?? []);

    // Allow us to select the current user
    // as a default question for Users question type
    survey.setVariable('user.id', user?.id || '');
  };

  /**
   * Clears the temporary files storage
   *
   * @param storage Storage to clear
   */
  public clearTemporaryFilesStorage(
    storage: Record<string, Array<File>>
  ): void {
    Object.keys(storage).forEach((key) => {
      delete storage[key];
    });
  }

  /**
   * Add tooltip to the survey question if exists
   *
   * @param survey current survey
   * @param options current survey question options
   */
  public addQuestionTooltips(survey: any, options: any): void {
    //Return if there is no description to show in popup
    if (!options.question.tooltip) {
      return;
    }
    const titleElement = (options.htmlElement as HTMLElement).querySelector(
      '.sd-question__title'
    );
    if (titleElement) {
      const selector = survey.isDesignMode
        ? '.svc-string-editor'
        : '.sv-string-viewer';
      titleElement.querySelectorAll(selector).forEach((el: any) => {
        const tooltip = document.createElement('span');
        tooltip.title = options.question.tooltip;
        tooltip.innerHTML = '?';
        tooltip.classList.add('survey-title__tooltip');
        el.appendChild(tooltip);
      });
    }
  }

  /**
   * Convert a string to snake_case. Overrides the snakeCase function of lodash
   * by first checking if the text is not already in snake case
   *
   * @param text The text to convert
   * @returns The text in snake_case
   */
  public toSnakeCase(text: string): string {
    if (this.isSnakeCase(text)) {
      return text;
    }
    return snakeCase(text);
  }

  /**
   * Create the valueName of the question in snake case. If valueName exists but with
   * wrong format (not in snake_case), raise an error and return false.
   *
   * @param question The question of the form whose valueName we need to set
   * @param page The page of the form
   * @returns if valueName is set and in the correct format (snake_case)
   */
  public setValueName(question: Question, page: PageModel): boolean {
    if (!question.valueName) {
      if (question.title) {
        question.valueName = this.toSnakeCase(question.title);
      } else if (question.name) {
        question.valueName = this.toSnakeCase(question.name);
      } else {
        this.snackBar.openSnackBar(
          this.translate.instant('pages.formBuilder.errors.missingName', {
            page: page.name,
          }),
          {
            error: true,
            duration: 15000,
          }
        );
        return false;
      }
    } else {
      if (!this.isSnakeCase(question.valueName)) {
        this.snackBar.openSnackBar(
          this.translate.instant('pages.formBuilder.errors.snakecase', {
            name: question.valueName,
            page: page.name,
          }),
          {
            error: true,
            duration: 15000,
          }
        );
        return false;
      }
    }
    return true;
  }

  /**
   * Saves the current data as a draft record
   *
   * @param survey Survey where to add the callbacks
   * @param formId Form id of the survey
   * @param draftId Draft record id
   * @param callback callback method
   */
  public saveAsDraft(
    survey: SurveyModel,
    formId: string,
    draftId?: string,
    callback?: any
  ): void {
    // Check if a draft has already been loaded
    if (!draftId) {
      // Add a new draft record to the database
      const mutation = this.apollo.mutate<AddDraftRecordMutationResponse>({
        mutation: ADD_DRAFT_RECORD,
        variables: {
          form: formId,
          data: survey.data,
        },
      });
      mutation.subscribe({
        next: ({ errors, data }) => {
          if (errors) {
            survey.clear(false, true);
            this.snackBar.openSnackBar(errors[0].message, { error: true });
          } else {
            // localStorage.removeItem(this.storageId);
            this.snackBar.openSnackBar(
              this.translate.instant(
                'components.form.draftRecords.successSave'
              ),
              {
                error: false,
              }
            );
          }
          // Callback to emit save but stay in record addition mode
          if (callback) {
            callback({
              id: data?.addDraftRecord.id,
              save: {
                completed: false,
                hideNewRecord: true,
              },
            });
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
    } else {
      // Edit last added draft record in the database
      const mutation = this.apollo.mutate<EditDraftRecordMutationResponse>({
        mutation: EDIT_DRAFT_RECORD,
        variables: {
          id: draftId,
          data: survey.data,
        },
      });
      mutation.subscribe(({ errors }: any) => {
        if (errors) {
          survey.clear(false, true);
          this.snackBar.openSnackBar(errors[0].message, { error: true });
        } else {
          // localStorage.removeItem(this.storageId);
          this.snackBar.openSnackBar(
            this.translate.instant('components.form.draftRecords.successEdit'),
            {
              error: false,
            }
          );
        }
        // Callback to emit save but stay in record addition mode
        if (callback) {
          callback({
            id: draftId,
            save: {
              completed: false,
              hideNewRecord: true,
            },
          });
        }
      });
    }
  }

  /**
   * Handles the deletion of a specific draft record
   *
   * @param draftId Id of the draft record to delete
   * @param callback callback method
   */
  public deleteRecordDraft(draftId: string, callback?: any): void {
    this.apollo
      .mutate<any>({
        mutation: DELETE_DRAFT_RECORD,
        variables: {
          id: draftId,
        },
      })
      .subscribe(() => {
        if (callback) {
          callback();
        }
      });
  }

  /**
   * Checks if a string is already in snake case
   *
   * @param text The text to check
   * @returns True if the text is in snake case, false otherwise
   */
  private isSnakeCase(text: string): any {
    return text.match(/^[a-z]+[a-z0-9_]+$/);
  }
}
