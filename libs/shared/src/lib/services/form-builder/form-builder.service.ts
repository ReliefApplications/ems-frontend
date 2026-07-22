import { Inject, Injectable, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { renderGlobalProperties } from '../../survey/render-global-properties';
import { SnackbarService } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { isNil } from 'lodash';
import get from 'lodash/get';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import {
  Model,
  Question,
  QuestionFileModel,
  SurveyModel,
  settings,
  surveyLocalization,
} from 'survey-core';
import { Metadata } from '../../models/metadata.model';
import {
  EditRecordMutationResponse,
  Record as RecordModel,
} from '../../models/record.model';
import { FormHelpersService } from '../form-helper/form-helper.service';
import { RestService } from '../rest/rest.service';
import { EDIT_RECORD } from './graphql/mutations';
import { DocumentManagementService } from '../document-management/document-management.service';
import { AutoTranslateService } from '../auto-translate/auto-translate.service';
import { toSurveyLocale } from '../../utils/languages';
import { isFileOutdated } from '../file/file-outdated.utils';

/**
 * Shared form builder service.
 * Only used to add on complete expression to the survey.
 */
@Injectable({
  providedIn: 'root',
})
export class FormBuilderService {
  /**
   * Shared form builder service.
   * Only used to add on complete expression to the survey.
   *
   * @param translate Translation service
   * @param apollo Apollo service
   * @param snackBar Service used to show a snackbar.
   * @param restService This is the service that is used to make http requests.
   * @param formHelpersService Shared form helper service.
   * @param injector Angular injector
   * @param documentManagementService Document management service
   * @param autoTranslateService Field auto-translation service
   * @param environment Environment
   */
  constructor(
    private translate: TranslateService,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private restService: RestService,
    private formHelpersService: FormHelpersService,
    private injector: Injector,
    private documentManagementService: DocumentManagementService,
    private autoTranslateService: AutoTranslateService,
    @Inject('environment') private environment: any
  ) {}

  /**
   * Creates new survey from the structure and add on complete expression to it.
   *
   * @param structure form structure
   * @param fields list of fields used to check if the fields should be hidden or disabled
   * @param record record that'll be edited, if any
   * @returns New survey
   */
  createSurvey(
    structure: string,
    fields: Metadata[] = [],
    record?: RecordModel
  ): SurveyModel {
    settings.useCachingForChoicesRestful = false;
    settings.useCachingForChoicesRestfull = false;
    const survey = new Model(structure);
    this.formHelpersService.addUserVariables(survey);
    survey.onAfterRenderQuestion.add(renderGlobalProperties(this.injector));
    //Add tooltips to questions & render html question file links if exist
    this.formHelpersService.registerCustomSurveyHandlers(survey);

    survey.onCompleting.add(() => {
      for (const page of survey.toJSON().pages) {
        if (!page.elements) continue;
        for (const element of page.elements) {
          if (element.type === 'resources' || element.type === 'resource') {
            // if its a single record, the value will be string
            // so we account for that by putting it in an array
            const valueIterator =
              (element.type === 'resources'
                ? survey.getValue(element.name)
                : [survey.getValue(element.name)]) || [];

            const regex = /{\s*(\b.*\b)\s*}\s*=\s*"(.*)"/g;
            for (const item of valueIterator) {
              let operation: any;
              if (
                element.newCreatedRecords &&
                element.newCreatedRecords.includes(item) &&
                element.afterRecordCreation
              ) {
                regex.lastIndex = 0; // ensure that regex restarts
                operation = regex.exec(element.afterRecordCreation); // divide string into groups for key : value mapping
              } else if (element.afterRecordSelection) {
                regex.lastIndex = 0; // ensure that regex restarts
                const isNewlySelected =
                  element.type === 'resources'
                    ? !get(record, `data.${element.name}`, []).includes(item)
                    : !(get(record, `data.${element.name}`, null) === item);
                // only updates those records that were not in the old value for the field
                if (isNewlySelected)
                  operation = regex.exec(element.afterRecordSelection); // divide string into groups for key : value mapping
              }
              this.updateRecord(item, operation);
            }
          }
        }
      }
    });
    if (fields.length > 0) {
      for (const f of fields.filter((x) => !x.automated)) {
        const accessible = !!f.canSee;
        const editable = !!f.canUpdate;
        const disabled: boolean =
          (f.canUpdate !== undefined && !f.canUpdate) || false;
        const question = survey.getQuestionByName(f.name);
        if (question) {
          //If is not accessible for the current user, we will delete the question from the current survey instance
          if (!accessible) {
            question.delete();
          } else {
            question.readOnly = disabled || !editable;
            if (f.canDeleteFiles !== undefined) {
              question.setPropertyValue('canDeleteFiles', f.canDeleteFiles);
            }
          }
        }
      }
    }
    // Set the lang of the survey
    const usedLocales = survey.getUsedLocales();
    // SurveyJS locale codes differ from Angular's for some languages
    // (e.g. Ukrainian is 'uk' in Angular but 'ua' in SurveyJS).
    const systemLang = toSurveyLocale(
      this.translate.currentLang || this.translate.defaultLang
    );
    if (systemLang && usedLocales.includes(systemLang)) {
      // The language the user sees the system in takes priority over their last
      // manual form-language pick (if the form has a version for that language).
      survey.locale = systemLang;
    }
    survey.showNavigationButtons = 'none';
    survey.showProgressBar = 'off';
    survey.focusFirstQuestionAutomatic = false;
    survey.applyTheme({ isPanelless: true });
    /** Apply placeholders with limitations to all file type questions */
    survey.onGetQuestionTitle.add((_, options) => {
      if (options.question instanceof QuestionFileModel) {
        const text = surveyLocalization.getString(
          'oort:fileLimitations',
          (options.question.survey as SurveyModel).locale
        )(options.question);
        options.question.dragAreaPlaceholder = text;
      }
    });
    // Add record to survey properties
    survey.setPropertyValue('record', record);
    // Wire field auto-translation onto every survey instance (no-op unless some
    // question is configured with translateField). Components load data with
    // autoTranslateService.suppressAutoTranslationWhile(...) to avoid
    // translating on load.
    this.autoTranslateService.registerAutoTranslation(survey);
    return survey;
  }

  /**
   * Add common events callbacks to the created survey taking in account pages
   * and temporary files storage
   *
   * @param survey Survey where to add the callbacks
   * @param selectedPageIndex Current page of the survey
   * @param temporaryFilesStorage Temporary files saved while executing the survey
   */
  public addEventsCallBacksToSurvey(
    survey: SurveyModel,
    selectedPageIndex: BehaviorSubject<number>,
    temporaryFilesStorage: Record<string, Array<File>>
  ) {
    this.updateTemporaryFileStorage(survey, temporaryFilesStorage);
    survey.onClearFiles.add((_, options: any) =>
      this.onClearFiles(temporaryFilesStorage, options)
    );
    survey.onUploadFiles.add((_, options: any) =>
      this.onUploadFiles(temporaryFilesStorage, options)
    );
    survey.onDownloadFile.add((_, options: any) =>
      this.onDownloadFile(options)
    );
    survey.onCurrentPageChanged.add((survey: SurveyModel) => {
      survey.checkErrorsMode = survey.isLastPage ? 'onComplete' : 'onNextPage';
      selectedPageIndex.next(survey.currentPageNo);
    });
  }

  /**
   * Set temporary file storage
   *
   * @param survey Survey where to add the callbacks
   * @param temporaryFilesStorage Temporary files saved while executing the survey
   */
  private updateTemporaryFileStorage(
    survey: SurveyModel,
    temporaryFilesStorage: Record<string, Array<File>>
  ) {
    const fileQuestions =
      survey.getAllQuestions()?.filter((q) => q instanceof QuestionFileModel) ??
      [];
    fileQuestions.forEach((fq) => {
      temporaryFilesStorage[fq.name] = fq.value;
    });
  }

  /**
   * Check if given files are valid for given file type question
   *
   * @param question File question to apply checks
   * @param files Uploaded files
   * @returns Given files validity against given question
   */
  private checkFileUploadValidity(question: Question, files: File[]) {
    let isValid = true;
    const allowMultiple = question.getPropertyValue('allowMultiple');
    const allowedFileNumber = question.getPropertyValue('allowedFileNumber');
    const allowOutdatedFiles = question.getPropertyValue('allowOutdatedFiles');
    const maximumFiles = allowMultiple ? allowedFileNumber : 1;
    const activeFilesCount = files.filter((f) => !isFileOutdated(f)).length;
    if (allowOutdatedFiles && activeFilesCount > maximumFiles) {
      this.snackBar.openSnackBar(
        this.translate.instant(
          'components.formBuilder.errors.maximumAllowedFiles',
          { number: maximumFiles }
        ),
        { error: true }
      );
      isValid = false;
    }
    if (
      !allowOutdatedFiles &&
      allowMultiple &&
      files.length > allowedFileNumber
    ) {
      this.snackBar.openSnackBar(
        this.translate.instant(
          'components.formBuilder.errors.maximumAllowedFiles',
          { number: allowedFileNumber }
        ),
        { error: true }
      );
      isValid = false;
    }
    return isValid;
  }

  /**
   * Handles the clearing of files
   *
   * @param temporaryFilesStorage Temporary files saved while executing the survey
   * @param options Options regarding the files
   */
  private onClearFiles(temporaryFilesStorage: any, options: any): void {
    const filesToClear = Array.isArray(options.value) ? options.value : [];
    const canDeleteFiles = options.question?.getPropertyValue('canDeleteFiles') !== false;
    if (
      options.question?.getPropertyValue('allowOutdatedFiles') &&
      !canDeleteFiles &&
      filesToClear.length > 0
    ) {
      options.question.value = options.value;
      options.callback('error');
      return;
    }
    if (options.question.allowMultiple) {
      // Filtering the temp storage to remove the file based on filename
      if (temporaryFilesStorage[options.name]) {
        /** If there is no fileName from the options, it means that the user has click on clear all files from the upload */
        temporaryFilesStorage[options.name] = !isNil(options.fileName)
          ? temporaryFilesStorage[options.name].filter(
              (x: File) => x.name !== options.fileName
            )
          : [];
      }
    } else {
      // If single upload, the options doesn't contain fileName, so we can just clear the temp storage
      temporaryFilesStorage[options.name] = [];
    }
    options.callback('success');
  }

  /**
   * Handles the uploading of files event
   *
   * @param temporaryFilesStorage Temporary files saved while executing the survey
   * @param options Options regarding the upload
   */
  private onUploadFiles(temporaryFilesStorage: any, options: any): void {
    const isUploadValid = this.checkFileUploadValidity(options.question, [
      ...options.files,
      ...(temporaryFilesStorage[options.name] ?? []),
    ]);
    if (!isUploadValid) {
      options.callback('error');
      return;
    }
    if (!isNil(temporaryFilesStorage[options.name])) {
      temporaryFilesStorage[options.name] = temporaryFilesStorage[
        options.name
      ].concat(options.files);
    } else {
      temporaryFilesStorage[options.name] = options.files;
    }
    let content: Array<{
      file: File;
      content: string | ArrayBuffer | null;
    }> = [];
    options.files.forEach((file: File) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        content = content.concat([
          {
            content: fileReader.result,
            file,
          },
        ]);
        if (content.length === options.files.length) {
          options.callback(
            'success',
            content.map((fileContent) => ({
              file: fileContent.file,
              content: fileContent.content,
            }))
          );
        }
      };
      fileReader.readAsDataURL(file);
    });
  }

  /**
   * Handles the downloading of a file event
   *
   * @param options Options regarding the download
   */
  private onDownloadFile(options: any): void {
    const buildRequest = (token: string, url: string) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
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
    };
    // Default behavior
    if (typeof options.content === 'string') {
      if (
        options.content.indexOf('base64') !== -1 ||
        options.content.indexOf('http') !== -1
      ) {
        options.callback('success', options.content);
      } else {
        const token = localStorage.getItem('idtoken') as string;
        const url = `${this.restService.apiUrl}/download/file/${options.content}`;
        buildRequest(token, url);
      }
    } else {
      // Using document management
      firstValueFrom(
        this.documentManagementService.getDocumentDriveId(
          options.content.itemId
        )
      ).then((driveId) => {
        options.content.driveId = driveId;
        const token = localStorage.getItem('access_token') as string;
        const url = `${this.environment.csApiUrl}/documents/drives/${options.content.driveId}/items/${options.content.itemId}/content`;
        buildRequest(token, url);
      });
    }
  }

  /**
   * Updates the field with the specified information.
   *
   * @param id Id of the record to update
   * @param operation Operation to execute
   */
  private updateRecord(id: string, operation: any): void {
    if (id && operation) {
      this.apollo
        .mutate<EditRecordMutationResponse>({
          mutation: EDIT_RECORD,
          variables: {
            id,
            data: { [operation[1]]: operation[2] },
          },
        })
        .subscribe({
          next: ({ errors }) => {
            if (errors) {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.objectNotUpdated',
                  {
                    type: this.translate.instant('common.record.one'),
                    error: errors ? errors[0].message : '',
                  }
                ),
                { error: true }
              );
            } else {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectUpdated', {
                  type: this.translate.instant('common.record.one'),
                  value: '',
                })
              );
            }
          },
        });
    }
  }
}
