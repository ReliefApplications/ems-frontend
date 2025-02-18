import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  Model,
  Question,
  QuestionFileModel,
  SurveyModel,
  settings,
  IPanel,
  DownloadFileEvent,
  PanelModelBase,
  QuestionPanelDynamicModel as PanelDynamicT,
  QuestionMatrixDynamicModel as MatrixDynamicT,
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
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { SnackbarService } from '@oort-front/ui';
import { FormHelpersService } from '../form-helper/form-helper.service';
import { cloneDeep, difference, get } from 'lodash';
import { Form } from '../../models/form.model';
import { marked } from 'marked';
import { DownloadService } from '../download/download.service';

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
      if (
        (!isQuestionVisible(question) && data[filed] === null) ||
        question.omitField
      ) {
        delete data[filed];
      }

      // Remove data from files if from URL
      if (question.downloadFileFrom) {
        data[filed] = [
          {
            name: question.fileName,
            type: question.fileType,
            content: `custom:${question.downloadFileFrom}`,
            includeToken: question.includeOortToken,
          },
        ];
      }
    }
  });
  if (survey.showPercentageProgressBar) {
    const visibleQuestions = getVisibleQuestions(survey.getAllQuestions());
    data.progress =
      (visibleQuestions.filter((question: Question) => !question.isEmpty())
        .length *
        100) /
      visibleQuestions.length;
  }
  return data;
};

/**
 * Gets visible questions
 *
 * @param questions current page questions
 * @returns the interesting questions
 */
export const getVisibleQuestions = (questions: Question[]): Question[] => {
  return questions.flatMap((question: Question) => {
    if (question.getType() === 'panel' && question.elements) {
      // If the question is a static panel, recursively get nested questions
      return getVisibleQuestions(question.elements);
    }
    if (question.getType() === 'paneldynamic' && question.panels) {
      // If the question is a dynamic panel, iterate through each panel's elements
      return question.panels.flatMap((panel: any) =>
        getVisibleQuestions(panel.elements)
      );
    }
    // Include questions that are not read-only and are visible
    return !question.readOnly && question.isVisible ? [question] : [];
  });
};

/**
 * Gets the outermost parent of a question before page level
 *
 * @param question Question to get the root parent of
 * @returns The title and name of the root
 */
export const getRootParent = (
  question: Question | PanelModelBase
): {
  title: string;
  name: string;
} => {
  if (question.parent?.getType() === 'page') {
    return { title: question.title, name: question.name };
  }

  if ('parentQuestion' in question && question.parentQuestion) {
    return getRootParent(question.parentQuestion);
  } else {
    return getRootParent(question.parent as PanelModelBase);
  }
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
   * @param downloadService Shared download service
   */
  constructor(
    private referenceDataService: ReferenceDataService,
    private translate: TranslateService,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private restService: RestService,
    private formHelpersService: FormHelpersService,
    private downloadService: DownloadService
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
    survey.onAfterRenderQuestion.add((_, options) => {
      renderGlobalProperties(this.referenceDataService);
      //Add tooltips to questions if exist
      this.formHelpersService.addQuestionTooltips.bind(this.formHelpersService);

      if (options.question.getType() === 'file') {
        const files = options.question.value;
        const fileElement = options.htmlElement.querySelector('a');
        fileElement?.addEventListener('click', (event) => {
          event.preventDefault();
          files.forEach((file: any) => {
            if (
              file.content &&
              !(file.content.indexOf('base64') !== -1) &&
              !file.content.startsWith('http') &&
              !file.content.startsWith('custom:') &&
              this.recordId
            ) {
              const path = `${this.restService.apiUrl}/download/file/${file.content}/${this.recordId}/${file.name}`;
              this.downloadService.getFile(path, file.type, file.name);
            }
          });
        });
      }
    });

    // For each question, if validateOnValueChange is true, we will add a listener to the value change event
    survey.getAllQuestions().forEach((question) => {
      if (question.validateOnValueChange) {
        question.registerFunctionOnPropertyValueChanged('value', () => {
          question.validate();
        });
      }
    });

    survey.onQuestionValueChanged = {};
    survey.onValueChanged.add((_, options) => {
      if (survey.onQuestionValueChanged[options.name]) {
        survey.onQuestionValueChanged[options.name](options);
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

    // Adds upload button
    const showUploadButtonTypes = ['paneldynamic', 'matrixdynamic'];
    survey.onAfterRenderQuestion.add((_, options) => {
      const questionType = options.question.getType();
      if (!showUploadButtonTypes.includes(questionType)) {
        return;
      }

      const uploadButton = document.createElement('button');
      uploadButton.classList.add('sd-action', 'ml-auto');
      uploadButton.onclick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx';
        input.addEventListener('change', (e) => {
          const file = (e.target as HTMLInputElement)?.files?.[0];
          if (file) {
            this.downloadService
              .uploadFile('upload/parse/json', file)
              .subscribe((data) => {
                data.forEach((row: Record<string, unknown>) => {
                  if (questionType === 'paneldynamic') {
                    const question = options.question as PanelDynamicT;
                    const newPanel = question.addPanel();

                    Object.entries(row).forEach(([key, value]) => {
                      const question = newPanel.getQuestionByName(key);
                      if (question) {
                        question.value = value;
                      }
                    });
                  } else {
                    const question = options.question as MatrixDynamicT;

                    const idx = question.rowCount;
                    question.addRow();
                    console.log(idx, row);
                    question.setRowValue(idx, row);
                    question.expand();
                  }
                });
              });
          }
        });
        input.click();
      };
      uploadButton.innerHTML = this.translate.instant('common.uploadObject', {
        name: 'XLSX',
      });

      const htmlEl = options.htmlElement.querySelector('.sd-element__header');
      const title = htmlEl?.querySelector('.sd-element__title');

      const div = document.createElement('div');
      div.classList.add('flex', 'items-center');

      if (title) {
        div.appendChild(title.cloneNode(true));
        htmlEl?.appendChild(div);
        title.remove(); // remove original title
      }

      div.appendChild(uploadButton);
      htmlEl?.appendChild(div);
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
    if (survey.showPercentageProgressBar) {
      import('../../survey/progress-bar/progress-bar.component').then(() => {
        survey.addLayoutElement({
          id: 'progressbar-percentage',
          component: 'sv-progressbar-percentage',
          container: 'contentTop',
          data: survey,
        });
      });
    }
    survey.onTextMarkdown.add((_, options) => {
      let str = marked(options.text);
      str = str.substring(3);
      str = str.substring(0, str.length - 5);
      options.html = str;
    });
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
   * @param destroy$ Subject to destroy the subscription
   */
  public addEventsCallBacksToSurvey(
    survey: SurveyModel,
    selectedPageIndex: BehaviorSubject<number>,
    temporaryFilesStorage: TemporaryFilesStorage,
    destroy$: Subject<boolean>
  ) {
    selectedPageIndex
      .asObservable()
      .pipe(takeUntil(destroy$))
      .subscribe((index) => {
        survey.currentPageNo = index;
      });

    survey.onAfterRenderSurvey.add(() => {
      // onAfterRenderSurvey is called after each page change,
      // so we add a custom flag to avoid running the code multiple times
      // as it should only be run once, on first loading the entire survey
      if (survey.initialConfigurationDone) {
        return;
      }
      survey.checkErrorsMode = 'onComplete';
      survey.initialConfigurationDone = true;

      // Open survey on a specific page (openOnQuestionValuesPage has priority over openOnPage)
      if (survey.openOnQuestionValuesPage) {
        const question = survey.getQuestionByName(
          survey.openOnQuestionValuesPage
        );
        if (question) {
          const page = survey.getPageByName(question.value);
          if (page) {
            setTimeout(() => {
              selectedPageIndex.next(page.visibleIndex);
            }, 100);
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
      survey.onFocusInQuestion.add((survey, e) => {
        const { title: rootTitle, name: rootName } = getRootParent(e.question);
        survey.setVariable('__FOCUSED__.name', e.question.name);
        survey.setVariable('__FOCUSED__.title', e.question.title);
        survey.setVariable('__FOCUSED__.root.name', rootName);
        survey.setVariable('__FOCUSED__.root.title', rootTitle);
      });
    });
    survey.onClearFiles.add((_, options: any) => this.onClearFiles(options));
    survey.onUploadFiles.add((_, options: any) =>
      this.onUploadFiles(temporaryFilesStorage, options)
    );
    survey.onDownloadFile.add((_, options: DownloadFileEvent) => {
      this.onDownloadFile(options);
    });
    survey.onCurrentPageChanged.add((survey: SurveyModel) => {
      if (survey.currentPageNo !== selectedPageIndex.getValue()) {
        selectedPageIndex.next(survey.currentPageNo);
      }
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
  private onDownloadFile(options: DownloadFileEvent): void {
    if (
      options.content.indexOf('base64') !== -1 ||
      options.content.startsWith('http')
    ) {
      options.callback('success', options.content);
    } else if (options.content.startsWith('custom:')) {
      fetch(options.content.slice(7), {
        headers: options.fileValue.includeOortToken
          ? {
              Authorization: `Bearer ${localStorage.getItem('idtoken')}`,
            }
          : {},
      })
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], options.fileValue.name, {
            type: options.fileValue.fileType,
          });
          const reader = new FileReader();
          reader.onload = (e) => {
            options.callback('success', e.target?.result);
          };
          reader.readAsDataURL(file);
        })
        .catch((error) => {
          console.error('Error downloading file:', error);
          options.callback('error', error);
        });
    } else if (this.recordId) {
      options.callback('success', '');
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
