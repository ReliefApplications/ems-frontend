import { Injectable } from '@angular/core';
import * as Survey from 'survey-angular';
import { Apollo } from 'apollo-angular';
import { TranslateService } from '@ngx-translate/core';
import { SafeConfirmService } from '../confirm/confirm.service';
import { firstValueFrom } from 'rxjs';
import {
  UPLOAD_FILE,
  UploadFileMutationResponse,
  AddRecordMutationResponse,
  ADD_RECORD,
} from '../../components/form/graphql/mutations';
import { DialogRef } from '@angular/cdk/dialog';
import { SnackbarService } from '@oort-front/ui';
import localForage from 'localforage';
import { cloneDeep, set } from 'lodash';
import { SafeAuthService } from '../auth/auth.service';
import { SafeWorkflowService } from '../workflow/workflow.service';
import { SafeApplicationService } from '../application/application.service';

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
   * @param authService Shared auth service
   * @param workflowService Shared workflow service
   * @param applicationService Shared application service
   */
  constructor(
    public apollo: Apollo,
    private snackBar: SnackbarService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService,
    private authService: SafeAuthService,
    private workflowService: SafeWorkflowService,
    private applicationService: SafeApplicationService
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
  setEmptyQuestions(survey: Survey.SurveyModel): void {
    // We get all the questions from the survey and check which ones contains values
    const questions = survey.getAllQuestions();
    const data = { ...survey.data };
    for (const field in questions) {
      if (questions[field]) {
        const key = questions[field].getValueName();
        // If there is no value for this question
        if (!survey.data[key]) {
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
    survey: Survey.SurveyModel,
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
          const uploadedFileID = res.data?.uploadFile;
          const fileContent = data[name][index].content;
          data[name][index].content = uploadedFileID;

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
                file.content = uploadedFileID;
              }
            });
          });
        }
      }
    }
    survey.data = cloneDeep(data);
  }

  /**
   * Clean cached records from passed survey.
   *
   * @param survey Survey from which we need to clean cached records.
   */
  cleanCachedRecords(survey: Survey.SurveyModel): void {
    if (!survey) return;
    survey.getAllQuestions().forEach((question) => {
      if (question.value) {
        const type = question.getType();
        if (type === 'resources') {
          question.value.forEach((recordId: string) =>
            localForage.removeItem(recordId)
          );
        } else if (type === 'resource') {
          localForage.removeItem(question.value);
        }
      }
    });
  }

  /**
   * Create cache records (from resource/s questions) of passed survey.
   *
   * @param survey Survey to get questions from
   */
  public async createCachedRecords(survey: Survey.SurveyModel): Promise<void> {
    const promises: Promise<any>[] = [];
    const questions = survey.getAllQuestions();
    const nestedRecordsToAdd: string[] = [];

    // Callbacks to update the ids of new records
    const updateIds: {
      [key in string]: (arg0: string) => void;
    } = {};

    const nestedQuestions: Survey.Question[] = [];
    // Get questions nested in panels
    survey
      .getAllQuestions()
      .filter((q) => q.getType() === 'paneldynamic')
      .forEach((question) => {
        const panel = question as Survey.QuestionPanelDynamicModel;
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
            ) as Survey.Question;
            nestedQuestions.push(question as Survey.Question);
          });
        });
      });

    const updateResourcesExpressions: ((arg1: string, arg2: string) => void)[] =
      [];
    // Get all nested records to add
    questions.concat(nestedQuestions).forEach((question) => {
      const type = question.getType();
      if (!['resource', 'resources'].includes(type)) return;

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
        return;
      }
      const uuidv4Pattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      const isResource = type === 'resource';

      const toAdd = (isResource ? [question.value] : question.value).filter(
        (x: string) => uuidv4Pattern.test(x)
      );
      nestedRecordsToAdd.push(...toAdd);

      toAdd.forEach((id: string) => {
        updateIds[id] = (newId: string) => {
          question.value = isResource
            ? newId
            : question.value.map((x: string) => (x === id ? newId : x));
        };
      });
    });

    for (const localID of nestedRecordsToAdd) {
      // load them from localForage and add them to the promises
      const cache = await localForage.getItem(localID);
      if (!cache) continue;

      const { template, data } = JSON.parse(cache as string);

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
          // change the localID to the new recordId
          const newId = res.data?.addRecord?.id;
          if (!newId) return;
          updateIds[localID](newId);
          updateResourcesExpressions.forEach((update) =>
            update(localID, newId)
          );
          localForage.removeItem(localID);
          return;
        })
      );
    }

    await Promise.all(promises);
  }

  /**
   * Registration of new custom variables for the survey.
   * Custom variables can be used in the logic fields.
   *
   * @param survey Survey instance
   */
  public addUserVariables = (survey: Survey.SurveyModel) => {
    const user = this.authService.user.getValue();

    // set user variables
    survey.setVariable('user.firstName', user?.firstName ?? '');
    survey.setVariable('user.lastName', user?.lastName ?? '');
    survey.setVariable('user.email', user?.username ?? '');

    // Allow us to do some cool stuff like
    // {user.roles} contains '62e3e676c9bcb900656c95c9'
    survey.setVariable('user.roles', user?.roles?.map((r) => r.id || '') ?? []);

    // Allow us to select the current user
    // as a default question for Users question type
    survey.setVariable('user.id', user?.id || '');
  };

  /**
   * Registration of new custom variables for the survey.
   * Custom variables can be used in the logic fields.
   * This function is used to add the application id, name and description to the survey variables
   *
   * @param survey Survey instance
   */
  public addApplicationVariables = (survey: Survey.SurveyModel) => {
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
  public addRecordIDVariable = (
    survey: Survey.SurveyModel,
    record: { id?: string; incrementalId?: string }
  ) => {
    survey.setVariable('record.id', record.id);
    survey.setVariable('record.incrementalID', record?.incrementalId ?? '');
  };

  /**
   * Registers custom variables based on the workflow state
   * to be used in the survey.
   *
   * @param survey Survey instance
   */
  public setWorkflowContextVariable = (survey: Survey.SurveyModel) => {
    firstValueFrom(this.workflowService.workflowContext$).then((context) => {
      if (!context) return;
      const { dashboard, widget, rows } = context;
      survey.setVariable(`workflow_${dashboard}_${widget}`, rows);
    });
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
}
