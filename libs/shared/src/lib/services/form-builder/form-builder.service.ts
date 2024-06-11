import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  Model,
  Question,
  QuestionFileModel,
  SurveyModel,
  settings,
  IPanel,
} from 'survey-core';
import { ReferenceDataService } from '../reference-data/reference-data.service';
import { renderGlobalProperties } from '../../survey/render-global-properties';
import { Apollo } from 'apollo-angular';
import { EDIT_RECORD } from './graphql/mutations';
import {
  EditRecordMutationResponse,
  Record as RecordModel,
} from '../../models/record.model';
import { Metadata } from '../../models/metadata.model';
import { RestService } from '../rest/rest.service';
import { BehaviorSubject } from 'rxjs';
import { SnackbarService } from '@oort-front/ui';
import { FormHelpersService } from '../form-helper/form-helper.service';
import { cloneDeep, difference, get } from 'lodash';
import { Form } from '../../models/form.model';

let counter = Math.floor(Math.random() * 0xffffff); // Initialize counter with a random value

/**
 * Generates a new MongoDB ObjectId.
 *
 * @returns A new ObjectId in the form of a 24-character hexadecimal string.
 */
const createNewObjectId = () => {
  const timestamp = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, '0');

  const randomValue = Array.from({ length: 5 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0')
  ).join('');

  const counterHex = (counter++).toString(16).padStart(6, '0');

  return timestamp + randomValue + counterHex;
};

/** Type for the temporary file storage */
export type TemporaryFilesStorage = Map<Question, File[]>;

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
 * Gets the payload for the update mutation
 *
 * @param op Input expression in the form of {key} = "value"
 * @param survey Survey instance
 * @returns Formatted payload for the update mutation
 */
const getUpdateData = (
  op: string,
  survey: SurveyModel
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
export class FormBuilderService {
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
    private referenceDataService: ReferenceDataService,
    private translate: TranslateService,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private restService: RestService,
    private formHelpersService: FormHelpersService
  ) {}

  /**
   * Creates new survey from the structure and add on complete expression to it.
   *
   * @param structure form structure
   * @param fields list of fields used to check if the fields should be hidden or disabled
   * @param record record that'll be edited, if any
   * @param form form linked to the survey, if any
   * @returns New survey
   */
  createSurvey(
    structure: string,
    fields: Metadata[] = [],
    record?: RecordModel,
    form?: Form
  ): SurveyModel {
    settings.useCachingForChoicesRestful = false;
    settings.useCachingForChoicesRestfull = false;
    const survey = new Model(structure);

    // Adds function to survey to be able to get the current parsed data
    survey.getParsedData = () => {
      return transformSurveyData(survey);
    };

    // Add form model to the survey
    if (form) {
      survey.form = form;

      // Add resource model to the survey
      if (form.resource) {
        survey.resource = survey.form.resource;
      }
    }

    // Add record model to the survey
    if (record) {
      survey.record = record;
    }

    // Add custom variables
    this.formHelpersService.addUserVariables(survey);
    this.formHelpersService.addApplicationVariables(survey);
    this.formHelpersService.setWorkflowContextVariable(survey);
    if (record) {
      this.recordId = record.id;
      this.formHelpersService.addRecordVariables(survey, record);
    } else if (survey.generateNewRecordOid) {
      survey.setVariable('record.id', createNewObjectId());
    }
    survey.onAfterRenderQuestion.add(
      renderGlobalProperties(this.referenceDataService)
    );

    //Add tooltips to questions if exist
    survey.onAfterRenderQuestion.add(
      this.formHelpersService.addQuestionTooltips.bind(this.formHelpersService)
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
        if (!isResource && !isResources) {
          return;
        }
        const initSelection = [get(record, `data.${question.name}`, [])]
          .flat()
          .filter(Boolean);

        const wasSelected = (id: string) => initSelection.includes(id);

        const questionRecords = (
          isResource ? [question.value] : question.value
        ).filter(Boolean);

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

    survey.getAllQuestions().forEach((question) => {
      if (question.getType() == 'paneldynamic') {
        // Set all the indexes of configured dynamic panel questions in the survey to the last panel.
        if (question.getPropertyValue('startOnLastElement')) {
          question.currentIndex = question.visiblePanelCount - 1;
        }

        // This fixes one weird bug from SurveyJS's new version
        // Without it, the panel property isn't updated on survey initialization
        if (question.AllowNewPanelsExpression) {
          question.allowAddPanel = true;
        }
      }
    });

    // set the lang of the survey
    const surveyLang = localStorage.getItem('surveyLang');
    const surveyLocales = survey.getUsedLocales();
    if (surveyLang && surveyLocales.includes(surveyLang)) {
      survey.locale = surveyLang;
    } else {
      const lang = this.translate.currentLang || this.translate.defaultLang;
      if (surveyLocales.includes(lang)) {
        survey.locale = lang;
      } else {
        survey.locale = surveyLocales[0] ?? survey.locale;
      }
    }

    // Set query params as variables
    this.formHelpersService.addQueryParamsVariables(survey);

    survey.showNavigationButtons = 'none';
    survey.showProgressBar = 'off';
    survey.focusFirstQuestionAutomatic = false;
    survey.applyTheme({ isPanelless: true });
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
    temporaryFilesStorage: TemporaryFilesStorage
  ) {
    survey.onAfterRenderSurvey.add(() => {
      // Open survey on a specific page (openOnQuestionValuesPage has priority over openOnPage)
      if (survey.openOnQuestionValuesPage) {
        const question = survey.getQuestionByName(
          survey.openOnQuestionValuesPage
        );
        if (question) {
          const page = survey.getPageByName(question.value);
          if (page) {
            selectedPageIndex.next(page.visibleIndex);
          }
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
    survey.onCurrentPageChanged.add((survey: SurveyModel) => {
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
  private onUploadFiles(
    temporaryFilesStorage: TemporaryFilesStorage,
    options: any
  ): void {
    const question = options.question as QuestionFileModel;
    temporaryFilesStorage.set(question, options.files);

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
