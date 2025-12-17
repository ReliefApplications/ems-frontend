import { Inject, Injectable, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { renderGlobalProperties } from '../../survey/render-global-properties';
import { SnackbarService } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { isEqual, isNil } from 'lodash';
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
    //Add tooltips to questions if exist
    survey.onAfterRenderQuestion.add(
      this.formHelpersService.addQuestionTooltips
    );

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
      this.appendDynamicPanelHistoryEntriesOnSave(survey);
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
          }
        }
      }
    }
    // set the lang of the survey
    const surveyLang = localStorage.getItem('surveyLang');
    if (surveyLang && survey.getUsedLocales().includes(surveyLang)) {
      survey.locale = surveyLang;
    } else {
      const lang = this.translate.currentLang || this.translate.defaultLang;
      if (survey.getUsedLocales().includes(lang)) {
        survey.locale = lang;
      }
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
    return survey;
  }

  /**
   * Make the panel be normalized to render saved entries.
   *
   * @param survey Survey instance
   */
  public normalizeHistoryPanels(survey: SurveyModel): void {
    const normalizeArray = (value: unknown): any[] => {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) return parsed;
          if (parsed && typeof parsed === 'object') return [parsed];
        } catch {
          return [];
        }
      }
      if (value && typeof value === 'object') return [value];
      return [];
    };

    survey
      .getAllQuestions()
      .filter((q) => q.getType() === 'paneldynamic')
      .forEach((q: any) => {
        if (!q.getPropertyValue('appendOnSave')) return;
        const key = q.valueName || q.name;
        const raw = survey.getValue(key);
        const entries = normalizeArray(raw);
        survey.setValue(key, entries);
        q.value = entries;
        if (
          typeof q.panelCount === 'number' &&
          q.panelCount !== entries.length
        ) {
          q.panelCount = entries.length;
        }
      });
  }

  /**
   * Append dynamic panel history entries on save.
   *
   * @param survey Survey instance
   */
  private appendDynamicPanelHistoryEntriesOnSave(survey: SurveyModel): void {
    const normalizeArray = (value: unknown): any[] => {
      if (Array.isArray(value)) {
        if (value.every((v) => typeof v === 'string')) {
          const parsed = (value as string[])
            .map((v) => {
              try {
                return JSON.parse(v);
              } catch {
                return null;
              }
            })
            .filter((v) => v && typeof v === 'object');
          return parsed.length ? (parsed as any[]) : [];
        }
        return value;
      }
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) return parsed;
          if (parsed && typeof parsed === 'object') return [parsed];
        } catch {
          return [];
        }
      }
      if (value && typeof value === 'object') return [value];
      return [];
    };

    const isEmpty = (value: any): boolean => {
      if (isNil(value) || value === '') return true;
      if (Array.isArray(value) && value.length === 0) return true;
      return false;
    };

    const normalizeKey = (value: any): string =>
      String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

    const resolveTemplateKey = (panelQuestion: any, logicalName: string) => {
      const templateElements: any[] =
        panelQuestion?.template?.elements ||
        panelQuestion?.template?.questions ||
        panelQuestion?.templateElements ||
        [];

      const wanted = normalizeKey(logicalName);

      const match = (q: any) => {
        const name = normalizeKey(q?.name);
        const valueName = normalizeKey(q?.valueName);
        const title = normalizeKey(q?.title);
        const placeholder = normalizeKey(q?.placeholder);
        return (
          name === wanted ||
          valueName === wanted ||
          title === wanted ||
          placeholder === wanted
        );
      };

      const found = templateElements.find(match);
      return found?.valueName || found?.name;
    };

    survey
      .getAllQuestions()
      .filter((q) => q.getType() === 'paneldynamic')
      .forEach((question: any) => {
        if (!question.getPropertyValue('appendOnSave')) {
          return;
        }

        const fromField = question.getPropertyValue('fromField');
        const toField = question.getPropertyValue('toField');
        const subjectField = question.getPropertyValue('subjectField');
        const sentOnField = question.getPropertyValue('sentOnField');
        const bodyField = question.getPropertyValue('bodyField');
        const commentField = question.getPropertyValue('commentField');
        const clearCommentFieldOnSave = !!question.getPropertyValue(
          'clearCommentFieldOnSave'
        );

        const fromKey = resolveTemplateKey(question, 'from') || 'from';
        const toKey = resolveTemplateKey(question, 'to') || 'to';
        const subjectKey = resolveTemplateKey(question, 'subject') || 'subject';
        const sentOnKey = resolveTemplateKey(question, 'sentOn') || 'sentOn';
        const bodyKey = resolveTemplateKey(question, 'body') || 'body';
        const commentKey = resolveTemplateKey(question, 'comment') || 'comment';

        const entry: Record<string, any> = {};
        entry[fromKey] = fromField ? survey.getValue(fromField) : undefined;
        entry[toKey] = toField ? survey.getValue(toField) : undefined;
        entry[subjectKey] = subjectField
          ? survey.getValue(subjectField)
          : undefined;
        entry[sentOnKey] = sentOnField
          ? survey.getValue(sentOnField)
          : undefined;
        entry[bodyKey] = bodyField ? survey.getValue(bodyField) : undefined;
        entry[commentKey] = commentField
          ? survey.getValue(commentField)
          : undefined;

        if (
          Object.values(entry).every((value) => isEmpty(value)) ||
          (!fromField &&
            !toField &&
            !subjectField &&
            !sentOnField &&
            !bodyField &&
            !commentField)
        ) {
          return;
        }

        const existing = normalizeArray(question.value);
        const newestFirst = !!question.getPropertyValue('newestFirst');
        const allowDuplicates = !!question.getPropertyValue('allowDuplicates');

        if (!allowDuplicates && existing.length > 0) {
          const last = newestFirst
            ? existing[0]
            : existing[existing.length - 1];
          if (isEqual(last, entry)) {
            return;
          }
        }

        let updated = newestFirst ? [entry, ...existing] : [...existing, entry];

        const maxEntries = Number(question.getPropertyValue('maxEntries') || 0);
        if (maxEntries > 0 && updated.length > maxEntries) {
          updated = newestFirst
            ? updated.slice(0, maxEntries)
            : updated.slice(updated.length - maxEntries);
        }

        const key = question.valueName || question.name;
        survey.setValue(key, updated);
        question.value = updated;
        if (
          typeof question.panelCount === 'number' &&
          question.panelCount !== updated.length
        ) {
          question.panelCount = updated.length;
        }

        if (commentField && clearCommentFieldOnSave) {
          survey.setValue(commentField, null);
        }
      });
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
    if (allowMultiple && files.length > allowedFileNumber) {
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
      return;
    }
    if (!isNil(temporaryFilesStorage[options.name])) {
      temporaryFilesStorage[options.name] = temporaryFilesStorage[
        options.name
      ].concat(options.files);
    } else {
      temporaryFilesStorage[options.name] = options.files;
    }
    let content: any[] = [];
    options.files.forEach((file: any) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        content = content.concat([
          {
            name: file.name,
            type: file.type,
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
