import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as Survey from 'survey-angular';
import { SafeReferenceDataService } from '../reference-data/reference-data.service';
import { renderGlobalProperties } from '../../survey/render-global-properties';
import { Apollo } from 'apollo-angular';
import get from 'lodash/get';
import { Record as RecordModel } from '../../models/record.model';
import { EditRecordMutationResponse, EDIT_RECORD } from './graphql/mutations';
import { Metadata } from '../../models/metadata.model';
import { SafeRestService } from '../rest/rest.service';
import { BehaviorSubject } from 'rxjs';
import { SnackbarService } from '@oort-front/ui';
import { SafeFormHelpersService } from '../form-helper/form-helper.service';
import { difference } from 'lodash';

/**
 * Gets the payload for the update mutation
 *
 * @param op Input expression in the form of {key} = "value"
 * @param survey Survey instance
 * @returns Formatted payload for the update mutation
 */
const getUpdateData = (
  op: string,
  survey: Survey.SurveyModel
): Record<string, any> | null => {
  if (!op) return null;
  // Op can either be a stringified JSON object or
  // in the form of {key} = "value"
  try {
    // Replace used variables with their values
    survey.getVariableNames().forEach((variable) => {
      op = op.replace(
        new RegExp(`{${variable}}`, 'g'),
        JSON.stringify(survey.getVariable(variable))
      );
    });

    // Replace question template with their values
    survey.getAllQuestions().forEach((question) => {
      op = op.replace(
        new RegExp(`{${question.name}}`, 'g'),
        JSON.stringify(question.value)
      );
    });

    return JSON.parse(op);
  } catch {
    // Original way of parsing the expression.
    // Matches {key} = "value" and returns the key and value
    const regex = /{\s*(\b.*\b)\s*}\s*=\s*"(.*)"/g;
    const operation = regex.exec(op); // divide string into groups for key : value mapping

    return operation
      ? {
          [operation[1]]: operation[2],
        }
      : null;
  }
};

/**
 * Shared form builder service.
 * Only used to add on complete expression to the survey.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeFormBuilderService {
  /** If updating record, saves recordId if necessary gets files from questions */
  public recordId?: string;
  /**
   * Constructor of the service
   *
   * @param referenceDataService Reference data service
   * @param translate Translation service
   * @param apollo Apollo service
   * @param snackBar Service used to show a snackbar.
   * @param restService This is the service that is used to make http requests.
   * @param formHelpersService Shared form helper service.
   */
  constructor(
    private referenceDataService: SafeReferenceDataService,
    private translate: TranslateService,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private restService: SafeRestService,
    private formHelpersService: SafeFormHelpersService
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
  ): Survey.SurveyModel {
    Survey.settings.useCachingForChoicesRestful = false;
    Survey.settings.useCachingForChoicesRestfull = false;
    const survey = new Survey.Model(structure);

    // Add custom variables
    this.formHelpersService.addUserVariables(survey);
    this.formHelpersService.setWorkflowContextVariable(survey);
    if (record) {
      this.formHelpersService.addRecordIDVariable(survey, record);
    }
    survey.onAfterRenderQuestion.add(
      renderGlobalProperties(this.referenceDataService)
    );

    // For each question, if validateOnValueChange is true, we will add a listener to the value change event
    survey.getAllQuestions().forEach((question) => {
      if (question.validateOnValueChange) {
        question.registerFunctionOnPropertyValueChanged('value', () => {
          question.validate();
        });
      }
    });

    // Handles logic for after record creation, selection and deselection on resource type questions
    survey.onCompleting.add(() => {
      survey.getAllQuestions().forEach((question) => {
        const isResource = question.getType() === 'resource';
        const isResources = question.getType() === 'resources';
        if ((!isResource && !isResources) || !question.value) {
          return;
        }
        const initSelection = [get(record, `data.${question.name}`, [])].flat();
        const wasSelected = (id: string) => initSelection.includes(id);

        const questionRecords = isResource ? [question.value] : question.value;
        for (const recordID of questionRecords) {
          if (
            question.newCreatedRecords &&
            question.newCreatedRecords.includes(recordID) &&
            question.afterRecordCreation
          ) {
            // Newly created records
            const data = getUpdateData(question.afterRecordCreation, survey);
            data && this.updateRecord(recordID, data);
          } else if (question.afterRecordSelection && !wasSelected(recordID)) {
            // Newly selected records
            const data = getUpdateData(question.afterRecordSelection, survey);
            data && this.updateRecord(recordID, data);
          }
        }

        // Now we get the records that were deselected
        const deselectedRecords = difference(initSelection, questionRecords);
        if (question.afterRecordDeselection) {
          for (const recordID of deselectedRecords) {
            const data = getUpdateData(question.afterRecordDeselection, survey);
            data && this.updateRecord(recordID, data);
          }
        }
      });
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
    survey: Survey.SurveyModel,
    selectedPageIndex: BehaviorSubject<number>,
    temporaryFilesStorage: Record<string, Array<File>>
  ) {
    survey.onAfterRenderSurvey.add(() => {
      // Open survey on a specific page (openOnQuestionValuesPage has priority over openOnPage)
      if (survey.openOnQuestionValuesPage) {
        const question = survey.getQuestionByName(
          survey.openOnQuestionValuesPage
        );
        const page = survey.getPageByName(question.value);
        if (page) {
          selectedPageIndex.next(page.visibleIndex);
        }
      } else if (survey.openOnPage) {
        const page = survey.getPageByName(survey.openOnPage);
        if (page) {
          selectedPageIndex.next(page.visibleIndex);
        }
      }

      // Set all the indexes of configured dynamic panel questions in the survey to the last panel.
      survey.getAllQuestions().forEach((question) => {
        if (
          question.getType() == 'paneldynamic' &&
          question.getPropertyValue('startOnLastElement')
        ) {
          question.currentIndex = question.visiblePanelCount - 1;
        }
      });
    });
    survey.onClearFiles.add((_, options: any) => this.onClearFiles(options));
    survey.onUploadFiles.add((_, options: any) =>
      this.onUploadFiles(temporaryFilesStorage, options)
    );
    survey.onDownloadFile.add((_, options: any) =>
      this.onDownloadFile(options)
    );
    survey.onUpdateQuestionCssClasses.add((_, options: any) =>
      this.onSetCustomCss(options)
    );
    survey.onCurrentPageChanged.add((survey: Survey.SurveyModel) => {
      survey.checkErrorsMode = survey.isLastPage ? 'onComplete' : 'onNextPage';
      selectedPageIndex.next(survey.currentPageNo);
    });
  }

  /**
   * Handles the clearing of files
   *
   * @param options Options regarding the files
   */
  private onClearFiles(options: any): void {
    options.callback('success');
  }

  /**
   * Handles the uploading of files event
   *
   * @param temporaryFilesStorage Temporary files saved while executing the survey
   * @param options Options regarding the upload
   */
  private onUploadFiles(temporaryFilesStorage: any, options: any): void {
    if (temporaryFilesStorage[options.name] !== undefined) {
      temporaryFilesStorage[options.name].concat(options.files);
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
    if (
      options.content.indexOf('base64') !== -1 ||
      options.content.indexOf('http') !== -1
    ) {
      options.callback('success', options.content);
    } else if (this.recordId) {
      /**
       * Only gets here if: editing record (we need to download the file to be available)
       * OR saving a new record with files (because when we edit the file.content after the uploadFile
       * mutation the survey.onDownloadFile() event is triggered, but we don't need to download the file
       *  in this case and the undefined this.recordId prevents this unnecessary call)
       */
      const xhr = new XMLHttpRequest();
      xhr.open(
        'GET',
        `${this.restService.apiUrl}/download/file/${options.content}/${this.recordId}/${options.name}`
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
  }

  /**
   * Add custom CSS classes to the survey elements.
   *
   * @param options survey options.
   */
  private onSetCustomCss(options: any): void {
    const classes = options.cssClasses;
    classes.content += 'safe-qst-content';
  }

  /**
   * Updates the field with the specified information.
   *
   * @param id Id of the record to update
   * @param data Data to update
   */
  private updateRecord(id: string, data: any): void {
    if (id && data) {
      this.apollo
        .mutate<EditRecordMutationResponse>({
          mutation: EDIT_RECORD,
          variables: {
            id,
            data,
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
