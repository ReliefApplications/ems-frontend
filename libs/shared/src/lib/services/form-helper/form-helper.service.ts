import { DialogRef } from '@angular/cdk/dialog';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import localForage from 'localforage';
import { get, isNil, omit, set, snakeCase } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { PageModel, QuestionFileModel, SurveyModel } from 'survey-core';
import { ADD_RECORD } from '../../components/form/graphql/mutations';
import {
  AddRecordMutationResponse,
  DeleteRecordMutationResponse,
  EditRecordMutationResponse,
} from '../../models/record.model';
import { Question } from '../../survey/types';
import { AuthService } from '../auth/auth.service';
import { ConfirmService } from '../confirm/confirm.service';
import { DocumentManagementService } from '../document-management/document-management.service';
import { BlobType, DownloadService } from '../download/download.service';
import {
  ADD_DRAFT_RECORD,
  DELETE_DRAFT_RECORD,
  EDIT_DRAFT_RECORD,
} from './graphql/mutations';
import { File, FileService } from '../file/file.service';
import {
  getFileIcon,
  isDraftFile,
  isPendingFile,
  localUrlToFile,
  removeFileExtension,
  revokeFileUrl,
} from '../file/file.utils';
import { keepsFilesOnComplete } from '../../survey/components/utils/files-widgets.util';

/** Details returned after a draft save. */
interface DraftSaveDetails {
  id?: string;
  save: {
    completed: false;
    hideNewRecord: true;
  };
}

/** Callback executed after a draft save. */
type DraftSaveCallback = (details: DraftSaveDetails) => void;

/** File that could not be uploaded, with the question it belongs to */
export interface UploadFileError {
  question: string;
  file: { name: string };
}

/** File of the survey waiting to be uploaded */
interface PendingUpload {
  /** File question holding the file */
  question: QuestionFileModel;
  /** File value item: a data URL, or a draft file saved in the back-end storage */
  item: File;
  /** Raw file picked during the session, if any */
  raw?: globalThis.File;
}

/** Files upload options */
export interface UploadFilesOptions {
  /**
   * Draft save: new files go to the back-end storage, flagged as draft files,
   * and the files already stored are left untouched. On submission ( default ),
   * new and draft files reach their final storage.
   */
  draft?: boolean;
}

/** Class toggled on HTML questions hiding the links of outdated files. */
const HIDE_OUTDATED_FILES_CLASS = 'html-question--hide-outdated-files';

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
   * @param documentManagementService Shared cs documentation
   * @param fileService File service
   */
  constructor(
    @Inject('environment') private environment: any,
    public apollo: Apollo,
    private snackBar: SnackbarService,
    private confirmService: ConfirmService,
    private translate: TranslateService,
    private authService: AuthService,
    private downloadService: DownloadService,
    private documentManagementService: DocumentManagementService,
    private fileService: FileService
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
   * Message describing a files upload failure, listing the files that could
   * not be uploaded.
   *
   * @param errors Errors thrown by the files upload
   * @returns Translated message
   */
  public getUploadErrorMessage(errors: unknown): string {
    const message = this.translate.instant(
      'models.form.notifications.savingFailed'
    );
    if (!Array.isArray(errors) || !errors.length) {
      return message;
    }
    const failedFiles = (errors as UploadFileError[]).map(
      (error) => `${error.question}: ${error.file.name}`
    );
    return `${message}\n${failedFiles.join('\n')}`;
  }

  /**
   * Uploads the files of the survey that are not in their final storage yet,
   * and replaces their content in the survey with the storage reference. A
   * file picked by the user is held as a data URL until uploaded: such a file
   * must never reach the database.
   *
   * - Draft save: picked files are uploaded to the back-end storage ( like
   *   record files were before document management ) and flagged as draft
   *   files. Document management is not involved until the submission.
   * - Submission: picked files are uploaded to document management when it
   *   is configured, to the back-end storage otherwise. Draft files are
   *   fetched from the back-end storage and uploaded to document management
   *   when it is configured; otherwise the back-end storage is their final
   *   storage and the flag is simply dropped. The properties of the files
   *   already stored in document management are synced.
   *
   * Picked files are uploaded from the raw file kept in the temporary
   * storage, or rebuilt from their data URL ( e.g. a file restored from a
   * record saved before its upload ). Copies of the same file ( e.g. default
   * values shared between questions ) share a single upload. Successful
   * uploads are applied to the survey even when others fail, so a retry does
   * not upload them again.
   *
   * @param survey The form in which the files will be updated
   * @param temporaryFilesStorage Raw files picked while executing the survey, per question
   * @param formId Form where to upload the files
   * @param options Upload options
   * @throws Files that could not be uploaded ( UploadFileError[] )
   */
  async uploadFiles(
    survey: SurveyModel,
    temporaryFilesStorage:
      | Record<string, Array<globalThis.File> | undefined>
      | undefined
      | null,
    formId: string | undefined,
    options: UploadFilesOptions = {}
  ): Promise<void> {
    if (!formId) {
      throw new Error('Form id is not defined');
    }
    const { draft = false } = options;
    // On submission, the files of a question whose value is cleared on
    // completion ( hidden by a condition ) are not saved: no need to upload
    // them. Drafts save every value.
    const fileQuestions = survey
      .getAllQuestions()
      .filter(
        (q) => q.getType() === 'file' && (draft || keepsFilesOnComplete(q))
      ) as QuestionFileModel[];
    // Try to update existing files, if required. Update is only about document properties, not about the content of the file itself
    if (!draft) {
      fileQuestions.forEach((q) => {
        if (q.value && Array.isArray(q.value)) {
          q.value.forEach(async (file: any) => {
            if (
              file.content &&
              typeof file.content === 'object' &&
              'itemId' in file.content &&
              'driveId' in file.content
            ) {
              await this.documentManagementService.updateFile(file, q);
            }
          });
        }
      });
    }
    // Is using document management system: never for drafts
    const useDocumentManagement = !!this.environment.csApiUrl && !draft;
    const upload = async (
      file: globalThis.File,
      question: QuestionFileModel
    ): Promise<File['content'] | null> => {
      if (useDocumentManagement) {
        const result = await this.documentManagementService.uploadFile(
          file,
          question
        );
        return result?.driveId && result?.itemId
          ? { driveId: result.driveId, itemId: result.itemId }
          : null;
      }
      // Default behavior, use app builder back-end. Draft saves run in the
      // background ( auto-save ): no upload feedback
      const path = await this.downloadService.uploadBlob(
        file,
        BlobType.RECORD_FILE,
        formId,
        { silent: draft }
      );
      return path || null;
    };

    // Pending files, the ones picked during the session first so their
    // copies reuse their upload instead of uploading again
    const pending: PendingUpload[] = [];
    fileQuestions.forEach((question) => {
      // The storage is seeded with the question values: only raw files count
      const stored = temporaryFilesStorage?.[question.name];
      const rawFiles = Array.isArray(stored) ? stored : [];
      const value: File[] = Array.isArray(question.value) ? question.value : [];
      value.forEach((item) => {
        if (isPendingFile(item)) {
          const raw = rawFiles.find(
            (file) => file instanceof Blob && file.name === item.name
          );
          pending.push({ question, item, raw });
        } else if (
          !draft &&
          isDraftFile(item) &&
          typeof item.content === 'string'
        ) {
          // Draft files reach their final storage on submission
          pending.push({ question, item });
        }
      });
    });
    pending.sort((a, b) => Number(!!b.raw) - Number(!!a.raw));

    /** Final content per pending content ( data URL or draft file path ) */
    const resolved = new Map<string, File['content']>();
    const failedFilesToUpload: UploadFileError[] = [];
    for (const { question, item, raw } of pending) {
      const key = item.content as string;
      // Copy of a file processed already
      if (!raw && resolved.has(key)) {
        continue;
      }
      let file: { name: string } = { name: item.name };
      try {
        let content: File['content'] | null;
        if (isDraftFile(item) && !useDocumentManagement) {
          // The back-end storage is the final storage of the draft file
          content = key;
        } else {
          file = isDraftFile(item)
            ? await this.getDraftFile(item)
            : raw ?? (await localUrlToFile(key, item.name, item.type));
          content = await upload(file as globalThis.File, question);
        }
        if (isNil(content)) {
          throw new Error(`Upload of ${item.name} failed`);
        }
        resolved.set(key, content);
      } catch {
        failedFilesToUpload.push({ question: question.name, file });
      }
    }

    // Replace the processed files by their storage reference, the failed
    // ones stay as they are
    fileQuestions.forEach((question) => {
      const value: File[] = Array.isArray(question.value) ? question.value : [];
      let changed = false;
      const updated = value.map((item) => {
        const content =
          (isPendingFile(item) || isDraftFile(item)) &&
          typeof item.content === 'string'
            ? resolved.get(item.content)
            : undefined;
        if (isNil(content)) {
          return item;
        }
        changed = true;
        const file = { ...omit(item, 'draft'), content };
        return draft ? { ...file, draft: true } : file;
      });
      if (changed) {
        question.value = updated;
      }
    });
    // The uploaded files are referenced by their storage from now on: release
    // the object URLs of the picked ones
    resolved.forEach((_, key) => revokeFileUrl({ content: key }));
    /** Throw error if any file upload has failed */
    if (failedFilesToUpload.length) {
      throw failedFilesToUpload;
    }
  }

  /**
   * Fetches a draft file from the back-end storage, to upload it to its final
   * storage.
   *
   * @param item Draft file value item
   * @returns Browser file
   */
  private async getDraftFile(item: File): Promise<globalThis.File> {
    const type = item.type || '';
    const blob = await firstValueFrom(
      this.downloadService.getFileBlob(`download/file/${item.content}`, type)
    );
    return new globalThis.File([blob], item.name, { type });
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
                              this.translate.instant(
                                'common.notifications.error',
                                { error: errors[0].message }
                              ),
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
          ).then(({ data }) => {
            // change the draftId to the new recordId
            const newId = data?.addRecord?.id;
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
   * @param options.question current question
   * @param options.htmlElement html element associated to question
   */
  public addQuestionTooltips = (
    survey: SurveyModel,
    options: { question: Question; htmlElement: HTMLElement }
  ): void => {
    //Return if there is no description to show in popup
    if (!options.question.tooltip) {
      return;
    }
    const titleElement = options.htmlElement.querySelector(
      '.sd-question__title'
    );
    const createTooltip = (htmlElement: Element) => {
      const tooltip = document.createElement('span');
      // Tooltips support dynamic text ({placeholders}), like titles do
      tooltip.title = survey.processText(options.question.tooltip || '', true);
      tooltip.innerHTML = '?';
      tooltip.classList.add('survey-title__tooltip');
      htmlElement.appendChild(tooltip);
    };
    if (titleElement) {
      const selector = survey.isDesignMode
        ? '.svc-string-editor'
        : '.sv-string-viewer';
      titleElement.querySelectorAll(selector).forEach((el: Element) => {
        createTooltip(el);
      });
    } else if (options.question.getType() === 'html') {
      const wrapper = document.createElement('div');
      wrapper.classList.add('flex', 'items-center');
      const htmlQuestion = options.htmlElement.querySelector('.sd-html');
      if (!htmlQuestion) return;
      htmlQuestion.parentNode?.insertBefore(wrapper, htmlQuestion);
      wrapper.appendChild(htmlQuestion);
      createTooltip(wrapper);
    }
  };

  /**
   * Runs all the rendering logic that should happen after a survey question is
   * rendered ( tooltips, HTML file links, ... ). Registered on the survey's
   * onAfterRenderQuestion event.
   *
   * @param survey current survey
   * @param options current survey question options
   * @param options.question current question
   * @param options.htmlElement html element associated to question
   */
  public onAfterRenderQuestion = (
    survey: SurveyModel,
    options: { question: Question; htmlElement: HTMLElement }
  ): void => {
    this.addQuestionTooltips(survey, options);
    this.bindHtmlQuestionFileClicks(survey, options);
    this.applyOutdatedFilesDisplay(options);
  };

  /**
   * Registers the custom survey behaviors ( file links rendering, tooltips, ... )
   * on the given survey.
   *
   * @param survey survey to enhance
   */
  public registerCustomSurveyHandlers = (survey: SurveyModel): void => {
    survey.onProcessTextValue.add(this.onProcessTextValue);
    survey.onAfterRenderQuestion.add(this.onAfterRenderQuestion);
  };

  /**
   * Resolves a named value from the survey. A name may point either to a
   * question value (in survey.data) or to a survey variable — e.g.
   * `{resourceQuestion.fileField}` populated from a linked record by the
   * resource component. survey.data takes precedence, falling back to the
   * variable so file fields coming from resource context are handled too.
   *
   * @param survey current survey
   * @param name name of the value / variable to resolve
   * @returns the resolved value, or undefined when absent
   */
  private resolveValue(survey: SurveyModel, name: string): any {
    return get(survey.data, name) ?? survey.getVariable(name);
  }

  /**
   * Substitutes the value of a file question in HTML questions with clickable
   * file links. Registered on the survey's onProcessTextValue event so that,
   * when SurveyJS resolves a `{field}` placeholder pointing to a file question,
   * it renders our links instead of the default `[object Object]`.
   *
   * @param survey current survey
   * @param options process text value options
   * @param options.name name of the placeholder being processed
   * @param options.value value to render in place of the placeholder
   * @param options.isExists whether the value should be used
   */
  public onProcessTextValue = (
    survey: SurveyModel,
    options: { name: string; value: any; isExists: boolean }
  ): void => {
    const question =
      survey.getQuestionByValueName(options.name) ||
      survey.getQuestionByName(options.name);
    const value = this.resolveValue(survey, options.name);
    if (!question || question.getType() !== 'file') {
      // No file question resolved for this placeholder, but the value may still
      // be compatible with the file links format (an array of file objects).
      if (Array.isArray(value) && value.some((file) => this.isFile(file))) {
        options.value = this.renderFileLinks(options.name, value);
        options.isExists = true;
      } else if (!options.isExists && value == null) {
        // The placeholder points to no field/value at all: render nothing
        // instead of leaving the raw `{field}` text in the output.
        options.value = '';
        options.isExists = true;
      }
      return;
    }
    options.value = this.renderFileLinks(options.name, value);
    options.isExists = true;
  };

  /**
   * Builds the clickable file links markup for a file question value.
   *
   * The `type`/`field`/`index` attributes let onFileClick identify the
   * file to download or preview when the link is clicked. Files marked as
   * outdated carry a warning icon and a `data-outdated` attribute, so HTML
   * questions can hide them ( see applyOutdatedFilesDisplay ).
   *
   * @param fieldName name of the file question ( key in survey data )
   * @param files file question value
   * @returns html markup for the file links
   */
  private renderFileLinks(fieldName: string, files: unknown): string {
    if (!Array.isArray(files)) {
      return '';
    }
    const outdatedTitle = this.translate.instant(
      'components.form.file.outdated.tooltip'
    );
    return files
      .map((file, index) => {
        // Index in the question value, used to resolve the clicked file
        if (!this.isFile(file)) return '';
        const outdated = !!(file as File).outdated;
        const warning = outdated
          ? `<span class="material-icons" style="display: inline-block; font-size: 16px; line-height: 1; color: #f59e0b; margin-right: 2px; vertical-align: middle" title="${outdatedTitle}">warning</span>`
          : '';
        return (
          `<button type="file" field="${fieldName}" index="${index}" ` +
          (outdated ? `data-outdated="true" ` : '') +
          `style="border: none; padding: 4px 6px; cursor: pointer;" ` +
          `class="k-button k-button-flat k-button-flat-base"` +
          `title="${file.name}">` +
          `<span class="k-icon ${getFileIcon(
            file.name
          )}" style="margin-right: 4px"></span>` +
          `${warning}${removeFileExtension(file.name)}</button>`
        );
      })
      .join('');
  }

  /**
   * Hides the links of outdated files rendered in an HTML question, unless
   * the question is configured to display them.
   *
   * @param options current survey question options
   * @param options.question current question
   * @param options.htmlElement html element associated to question
   */
  private applyOutdatedFilesDisplay(options: {
    question: Question;
    htmlElement: HTMLElement;
  }): void {
    if (options.question.getType() !== 'html') {
      return;
    }
    options.htmlElement.classList.toggle(
      HIDE_OUTDATED_FILES_CLASS,
      !options.question.getPropertyValue('showOutdatedFiles')
    );
  }

  /**
   * Attaches the file click behavior to a rendered HTML question.
   *
   * @param survey Current survey
   * @param options current survey question options
   * @param options.question current question
   * @param options.htmlElement html element associated to question
   */
  private bindHtmlQuestionFileClicks = (
    survey: SurveyModel,
    options: { question: Question; htmlElement: HTMLElement }
  ): void => {
    if (options.question.getType() !== 'html') {
      return;
    }
    const htmlQuestion =
      options.htmlElement.querySelector<HTMLElement>('.sd-html');
    if (!htmlQuestion || htmlQuestion.dataset['fileLinksBound'] === 'true') {
      return;
    }
    // Bind the click handler once per rendered element.
    htmlQuestion.dataset['fileLinksBound'] = 'true';
    htmlQuestion.addEventListener('click', (event) =>
      this.onFileClick(event, survey)
    );
  };

  /**
   * Handle click event on a rendered HTML question.
   *
   * Detects clicks on file elements rendered in the question and triggers a
   * download or preview of the matching file. The file is resolved from the
   * survey data or, for resource-context fields, from a survey variable.
   *
   * @param event click event
   * @param survey current survey
   */
  private onFileClick(event: Event, survey: SurveyModel): void {
    const target = event?.target as HTMLElement | null;
    if (!target?.getAttribute) {
      return;
    }
    const type = target.getAttribute('type');
    if (type !== 'file') {
      return;
    }
    // Download or preview file from definition
    const fieldName = target.getAttribute('field');
    const index = target.getAttribute('index');
    if (!fieldName || index === null) {
      return;
    }
    const files = this.resolveValue(survey, fieldName);
    const file = Array.isArray(files) ? files[Number(index)] : null;
    if (!this.isFile(file)) {
      return;
    }
    this.fileService.downloadOrPreview(file).subscribe();
  }

  /**
   * Type guard checking the given value is a valid file definition.
   *
   * @param value value to check
   * @returns true when the value is a file
   */
  private isFile(value: unknown): value is File {
    return (
      !!value &&
      typeof value === 'object' &&
      typeof (value as File).name === 'string'
    );
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
   * @param temporaryFilesStorage Raw files picked while executing the survey, per question
   * @param draftId Draft record id
   * @param callback callback method
   * @param errorCallback callback method executed when saving fails
   */
  public async saveAsDraft(
    survey: SurveyModel,
    formId: string,
    temporaryFilesStorage: Record<string, Array<globalThis.File> | undefined>,
    draftId?: string,
    callback?: DraftSaveCallback,
    errorCallback?: () => void
  ): Promise<void> {
    // Picked files are saved in the back-end storage before the draft, so
    // their data URLs never reach the database. They reach their final
    // storage when the record is submitted.
    try {
      await this.uploadFiles(survey, temporaryFilesStorage, formId, {
        draft: true,
      });
    } catch (errors) {
      this.snackBar.openSnackBar(this.getUploadErrorMessage(errors), {
        error: true,
      });
      errorCallback?.();
      return;
    }
    // Check if a draft has already been loaded
    if (!draftId) {
      // Add a new draft record to the database
      const mutation = this.apollo.mutate<AddRecordMutationResponse>({
        mutation: ADD_DRAFT_RECORD,
        variables: {
          form: formId,
          data: survey.data,
        },
      });
      mutation.subscribe({
        next: ({ errors, data }) => {
          const draftId = data?.addRecord?.id;
          if (errors?.length || !draftId) {
            this.snackBar.openSnackBar(
              errors?.[0]?.message ||
                this.translate.instant(
                  'models.form.notifications.savingFailed'
                ),
              { error: true }
            );
            errorCallback?.();
            return;
          }
          // localStorage.removeItem(this.storageId);
          this.snackBar.openSnackBar(
            this.translate.instant('components.form.draftRecords.successSave'),
            {
              error: false,
            }
          );
          // Callback to emit save but stay in record addition mode
          callback?.({
            id: draftId,
            save: {
              completed: false,
              hideNewRecord: true,
            },
          });
        },
        error: (err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          this.snackBar.openSnackBar(message, { error: true });
          errorCallback?.();
        },
      });
    } else {
      // Edit last added draft record in the database
      const mutation = this.apollo.mutate<EditRecordMutationResponse>({
        mutation: EDIT_DRAFT_RECORD,
        variables: {
          id: draftId,
          data: survey.data,
        },
      });
      mutation.subscribe({
        next: ({ errors }) => {
          if (errors?.length) {
            this.snackBar.openSnackBar(errors[0].message, { error: true });
            errorCallback?.();
            return;
          }
          // localStorage.removeItem(this.storageId);
          this.snackBar.openSnackBar(
            this.translate.instant('components.form.draftRecords.successEdit'),
            {
              error: false,
            }
          );
          // Callback to emit save but stay in record addition mode
          callback?.({
            id: draftId,
            save: {
              completed: false,
              hideNewRecord: true,
            },
          });
        },
        error: (err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          this.snackBar.openSnackBar(message, { error: true });
          errorCallback?.();
        },
      });
    }
  }

  /**
   * Handles the deletion of a specific draft record
   *
   * @param draftId Id of the draft record to delete
   * @param callback callback method
   * @param errorCallback callback method called when deletion fails
   */
  public deleteRecordDraft(
    draftId: string,
    callback?: () => void,
    errorCallback?: () => void
  ): void {
    this.apollo
      .mutate<DeleteRecordMutationResponse>({
        mutation: DELETE_DRAFT_RECORD,
        variables: {
          id: draftId,
        },
      })
      .subscribe({
        next: ({ errors }) => {
          if (errors?.length) {
            this.snackBar.openSnackBar(errors[0].message, { error: true });
            errorCallback?.();
            return;
          }
          if (callback) {
            callback();
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          errorCallback?.();
        },
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
