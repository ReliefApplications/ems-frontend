import { Inject, Injectable } from '@angular/core';
import {
  IPanel,
  PageModel,
  QuestionPanelDynamicModel,
  SurveyModel,
} from 'survey-core';
import { Apollo } from 'apollo-angular';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmService } from '../confirm/confirm.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ADD_RECORD } from '../../components/form/graphql/mutations';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { IconComponent, SnackbarService } from '@oort-front/ui';
import localForage from 'localforage';
import { snakeCase, cloneDeep, set, get, isNil, flattenDeep } from 'lodash';
import { AuthService } from '../auth/auth.service';
import { BlobType, DownloadService } from '../download/download.service';
import {
  AddDraftRecordMutationResponse,
  AddRecordMutationResponse,
  EditDraftRecordMutationResponse,
  RecordQueryResponse,
  Record,
} from '../../models/record.model';
import { Question } from '../../survey/types';
import {
  ADD_DRAFT_RECORD,
  DELETE_DRAFT_RECORD,
  EDIT_DRAFT_RECORD,
} from './graphql/mutations';
import { WorkflowService } from '../workflow/workflow.service';
import { ApplicationService } from '../application/application.service';
import { DomService } from '../dom/dom.service';
import { TemporaryFilesStorage } from '../form-builder/form-builder.service';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard/dashboard.service';
import { GET_RECORD_BY_UNIQUE_FIELD_VALUE } from './graphql/queries';
import { Metadata } from '../../models/metadata.model';

export type CheckUniqueProprietyReturnT = {
  verified: boolean;
  overwriteRecord?: Record;
};

/**
 * Applies custom logic to survey data values.
 *
 * @param survey Survey instance
 * @returns Transformed survey data
 */
export const transformSurveyData = (survey: SurveyModel) => {
  // Cloning data to avoid mutating the original survey data
  const data = cloneDeep(survey.data) ?? {};

  Object.keys(data).forEach((filed) => {
    const question = survey.getQuestionByName(filed);
    // Removes data that isn't in the structure, that might've come from prefilling data
    if (!question) {
      delete data[filed];
    } else {
      const isQuestionVisible = (question: Question | IPanel): boolean => {
        // If question is not visible, return false
        if (!question.isVisible || !question) {
          return false;
        }

        // If it is, check if its parent is visible
        if (question.parent) {
          return isQuestionVisible(question.parent);
        }

        // If we're in the root and it's visible, return true
        return true;
      };

      // Removes null values for invisible questions (or pages)
      if (!isQuestionVisible(question) && data[filed] === null) {
        delete data[filed];
      }
    }
  });

  return data;
};

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
   * @param workflowService Shared workflow service
   * @param applicationService Shared application service
   * @param domService Shared dom service
   * @param router Angular router service.
   * @param dialog Dialogs service
   * @param dashboardService Shared dashboard service
   */
  constructor(
    @Inject('environment') private environment: any,
    public apollo: Apollo,
    private snackBar: SnackbarService,
    private confirmService: ConfirmService,
    private translate: TranslateService,
    private authService: AuthService,
    private downloadService: DownloadService,
    private workflowService: WorkflowService,
    private applicationService: ApplicationService,
    private domService: DomService,
    private router: Router,
    public dialog: Dialog,
    private dashboardService: DashboardService
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
   * @param temporaryFilesStorage Temporary files saved while executing the survey
   * @param formId Form where to upload the files
   */
  async uploadFiles(
    temporaryFilesStorage: TemporaryFilesStorage,
    formId: string | undefined
  ): Promise<void> {
    if (!formId) {
      throw new Error('Form id is not defined');
    }

    for (const [question, files] of temporaryFilesStorage) {
      const paths = await Promise.all(
        files.map((file) =>
          this.downloadService.uploadBlob(file, BlobType.RECORD_FILE, formId)
        )
      );

      // Maps the files array, replacing the content with the path from the blob storage
      const mappedFiles = ((question.value as any[]) || []).map((f, idx) => ({
        ...f,
        content: paths[idx],
      }));

      question.value = mappedFiles;
    }
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
    const nestedRecordsToAdd: { draftIds: string[]; question: Question }[] = [];

    // Callbacks to update the ids of new records
    const updateIds: {
      [key in string]: (arg0: string) => void;
    } = {};

    const nestedQuestions: Question[] = [];
    // Get questions nested in panels
    survey
      .getAllQuestions()
      .filter((q) => q.getType() === 'paneldynamic')
      .forEach((question) => {
        const panel = question as QuestionPanelDynamicModel;
        const embeddedResourcesQuestions: string[] = [];
        // Filter questions of type resource or resources in the panel
        panel.templateElements.forEach((element) => {
          if (['resource', 'resources'].includes(element.getType())) {
            embeddedResourcesQuestions.push(element.name);
          }
        });
        // Extract each element from the panel
        embeddedResourcesQuestions.forEach((name) => {
          (panel.value || []).forEach((_: any, index: number) => {
            const question = panel.getQuestionFromArray(
              name,
              index
            ) as Question;
            nestedQuestions.push(question as Question);
          });
        });
      });
    const updateResourcesExpressions: ((arg1: string, arg2: string) => void)[] =
      [];

    // Get all nested records to add
    questions.concat(nestedQuestions).forEach((question) => {
      const type = question.getType();
      if (!['resource', 'resources'].includes(type) || !question.draftData) {
        return;
      }

      // If this question uses valueExpression, we should not upload the records
      // in it, as they will be uploaded by the fields they get their values from
      // Instead, we create a callback to update the ids of the new records
      // if they happen to te part of the resources using valueExpression
      if (question.valueExpression) {
        updateResourcesExpressions.push((oldId, newId) => {
          const value = question.value;
          // value is a array of strings, replace occurrences of oldId with newId
          if (Array.isArray(value)) {
            question.value = value.map((x) => (x === oldId ? newId : x));
          }
        });
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
            if (!newId) {
              return;
            }
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
   * Add tooltip to the survey question if exists
   *
   * @param _ current survey
   * @param options current survey question options
   */
  public addQuestionTooltips(_: any, options: any): void {
    //Return if there is no description to show in popup
    if (!options.question.tooltip) {
      return;
    }
    const titleElement = (options.htmlElement as HTMLElement).querySelector(
      '.sd-question__title'
    );
    if (titleElement) {
      titleElement.querySelectorAll('.sv-string-viewer').forEach((el: any) => {
        // Create ui-icon
        const component = this.domService.appendComponentToBody(
          IconComponent,
          el
        );
        component.instance.icon = 'help';
        component.instance.variant = 'primary';
        component.location.nativeElement.classList.add('ml-2'); // Add margin to the icon

        // Sets the tooltip text
        component.instance.tooltip = options.question.tooltip;
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
   * @param temporaryFilesStorage Temporary files saved while executing the survey
   * @param draftId Draft record id
   * @param callback callback method
   */
  public saveAsDraft(
    survey: SurveyModel,
    formId: string,
    temporaryFilesStorage: TemporaryFilesStorage,
    draftId?: string,
    callback?: any
  ): void {
    // First we need to upload any files that were added to the survey
    this.uploadFiles(temporaryFilesStorage, formId).then(() => {
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
              this.translate.instant(
                'components.form.draftRecords.successEdit'
              ),
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
    });
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

  /**
   * Registration of new custom variables for the survey.
   * Custom variables can be used in the logic fields.
   * This function is used to add the application id, name and description to the survey variables
   *
   * @param survey Survey instance
   */
  public addApplicationVariables = (survey: SurveyModel) => {
    const application = this.applicationService.application.getValue();
    survey.setVariable('application.id', application?.id ?? null);
    survey.setVariable('application.name', application?.name ?? null);
    survey.setVariable(
      'application.description',
      application?.description ?? null
    );
  };
  /**
   * Registration of new custom variables for the survey.
   * Custom variables can be used in the logic fields.
   * This function is used to add the record id and the incremental id to the survey variables
   *
   * @param survey Survey instance
   * @param record Record to add to the survey variables
   * @param record.id Record id
   * @param record.incrementalId Record incremental id
   */
  public addRecordVariables = (survey: SurveyModel, record: Record) => {
    survey.setVariable('record.id', record.id);
    survey.setVariable('record.incrementalID', record?.incrementalId ?? '');

    Object.keys(record?.data ?? {}).forEach((key) => {
      survey.setVariable(`record.${key}`, record.data[key]);
    });
  };

  /**
   * Registers custom variables based on the workflow state
   * to be used in the survey.
   *
   * @param survey Survey instance
   */
  public setWorkflowContextVariable = (survey: SurveyModel) => {
    survey.setVariable(
      `__WORKFLOW_CONTEXT__`,
      this.workflowService.workflowContextValue ?? []
    );

    // After the workflow context is set, we clear it
    this.workflowService.setContext([]);
  };

  /**
   * Adds any query parameters to the survey variables
   * These variables are accessible using the variables {param.<paramName>}
   *
   * @param survey Survey instance
   */
  public addQueryParamsVariables = (survey: SurveyModel) => {
    const queryParams = this.router.parseUrl(this.router.url).queryParams;

    Object.keys(queryParams).forEach((key) => {
      survey.setVariable(`param.${key}`, queryParams[key]);
    });
  };

  /**
   * Checks if record were created/updated from a resource/s question
   * on a dashboard filter and dashboard widgets needs to refresh.
   *
   * @param resourceId id of the resource
   * @param filterStructure id of the resource
   *
   * @returns list of widgets id that needs to be refreshed
   */
  public async checkResourceOnFilter(
    resourceId: string,
    filterStructure: any
  ): Promise<string | undefined> {
    if (filterStructure) {
      const widgets = flattenDeep(
        this.dashboardService.widgets.map((widget: any) => {
          if (widget.component === 'tabs') {
            const tabs = widget.settings.tabs.map((tab: any) => tab.structure);
            return tabs;
          } else {
            return widget;
          }
        })
      );
      for await (const widget of widgets) {
        if (
          widget.settings.resource === resourceId ||
          widget.settings.card?.resource === resourceId
        ) {
          return resourceId;
        }
      }
      return;
    } else {
      return;
    }
  }

  /**
   * Checks survey for unique fields when adding/editing records.
   *
   * @param survey Survey to get questions from
   * @returns if the validation is approved and can create/update the record,
   * or if overwrite existing record with unique field is allowed
   */
  public async checkUniquePropriety(
    survey: SurveyModel
  ): Promise<CheckUniqueProprietyReturnT> {
    const uniqueFields: Question[] = [];
    survey.getAllQuestions().forEach((question) => {
      if (question.unique) {
        uniqueFields.push(question);
      }
    });
    const checkUniqueResponse: CheckUniqueProprietyReturnT = {
      verified: true,
    };
    if (uniqueFields.length) {
      let firstOverwriteRecord = true;
      for await (const field of uniqueFields) {
        if (isNil(field.value)) {
          continue;
        }
        const { data } = await lastValueFrom(
          this.apollo.query<RecordQueryResponse>({
            query: GET_RECORD_BY_UNIQUE_FIELD_VALUE,
            variables: {
              uniqueField: field.name,
              uniqueValue: field.value,
            },
          })
        );

        // If the record is the same as the one we are editing, we can skip the check
        // We can also skip the check if the record is not found
        if (!data.record || data.record.id === survey.record?.id) {
          continue;
        } else {
          const canUpdate = data.record.form?.metadata?.find(
            (metadataField: Metadata) => field.name === metadataField.name
          )?.canUpdate;
          if (!canUpdate) {
            // if user doesn’t have permission to edit that record, permission denied
            this.snackBar.openSnackBar(
              this.translate.instant('components.record.uniqueField.exist', {
                question: field.title,
                value: field.value,
              }) +
                this.translate.instant(
                  'components.record.uniqueField.cannotUpdate'
                ),
              { error: true }
            );
            return { verified: false };
          }

          // If is the first (or unique) record to overwrite and the user allow it, it will be the one updated in the form component
          if (firstOverwriteRecord) {
            firstOverwriteRecord = false;
            const dialogRef = this.confirmService.openConfirmModal({
              title: this.translate.instant(
                'components.record.uniqueField.title'
              ),
              content:
                this.translate.instant('components.record.uniqueField.exist', {
                  question: field.title,
                  value: field.value,
                }) +
                ' ' +
                this.translate.instant(
                  'components.record.uniqueField.overwriteConfirm'
                ),
              confirmText: this.translate.instant(
                'components.confirmModal.confirm'
              ),
              confirmVariant: 'primary',
            });
            const confirm = await lastValueFrom(dialogRef.closed);
            if (confirm) {
              checkUniqueResponse.overwriteRecord = data.record;
              continue;
            } else {
              return { verified: false };
            }
          } else {
            // Otherwise, user needs first to update the other records where the other unique fields are present
            this.snackBar.openSnackBar(
              this.translate.instant('components.record.uniqueField.exist', {
                question: field.title,
                value: field.value,
              }) +
                this.translate.instant(
                  'components.record.uniqueField.updateRecord'
                ),
              { error: true }
            );
            const { FormModalComponent } = await import(
              '../../components/form-modal/form-modal.component'
            );

            const dialogRef = this.dialog.open(FormModalComponent, {
              disableClose: true,
              data: {
                recordId: data.record.id,
              },
              autoFocus: false,
            });
            const updateRecordDialogRef = await lastValueFrom(dialogRef.closed);
            if (updateRecordDialogRef) {
              continue;
            } else {
              return { verified: false };
            }
          }
        }
      }
      return checkUniqueResponse;
    } else {
      return checkUniqueResponse;
    }
  }
}
