import {
  ChoicesRestful,
  JsonMetadata,
  QuestionFileModel,
  QuestionPanelDynamicModel,
  Serializer,
  matrixDropdownColumnTypes,
  settings,
} from 'survey-core';
import { Question } from '../types';
import { SurveyModel, PageModel, surveyLocalization } from 'survey-core';

/**
 * Add support for custom properties to the survey
 *
 * @param environment Current environment
 */
export const init = (environment: any): void => {
  const serializer: JsonMetadata = Serializer;
  // change the prefix for comments
  settings.commentPrefix = '_comment';
  // override default expression properties
  serializer.removeProperty('expression', 'readOnly');
  serializer.removeProperty('survey', 'focusFirstQuestionAutomatic');
  serializer.addProperty('expression', {
    name: 'readOnly:boolean',
    type: 'boolean',
    visibleIndex: 6,
    default: false,
    category: 'general',
    required: true,
  });
  // Pass token before the request to fetch choices by URL if it's targeting SHARED API
  ChoicesRestful.onBeforeSendRequest = (
    sender: ChoicesRestful,
    // need to use any because the interface is not correct
    options: any
  ) => {
    if (sender.url.includes(environment.apiUrl)) {
      const token = localStorage.getItem('idtoken');
      options.request.setRequestHeader('Authorization', `Bearer ${token}`);
      // options.request.headers.append('Authorization', `Bearer ${token}`);
    }
  };

  // Add file option for file columns on matrix questions
  matrixDropdownColumnTypes.file = {
    properties: ['showPreview', 'imageHeight', 'imageWidth'],
    tabs: [
      { name: 'visibleIf', index: 12 },
      { name: 'enableIf', index: 20 },
    ],
  };

  // Adds property that clears the value when condition is met
  serializer.addProperty('question', {
    name: 'clearIf:condition',
    category: 'logic',
    visibleIndex: 4,
    default: '',
    isLocalizable: true,
    onExecuteExpression: (obj: Question, res: boolean) => {
      if (res) {
        obj.clearValue();
      }
    },
  });

  // Adds a property that makes it so the question is validated on every value change
  serializer.addProperty('question', {
    name: 'validateOnValueChange:boolean',
    category: 'validation',
    visibleIndex: 4,
    default: false,
  });
  // Adds a property to the survey settings to open the form on a specific page using the question value
  // of the selected question (the value must be a page name)
  serializer.addProperty('survey', {
    name: 'openOnQuestionValuesPage',
    category: 'pages',
    choices: (survey: SurveyModel, choicesCallback: any) => {
      let questions: string[] = [''];
      survey.pages.forEach((page: PageModel) => {
        questions = questions.concat(
          page.questions.map((question: Question) => question.name)
        );
      });
      choicesCallback(questions);
    },
  });
  // Adds a property to the survey settings to open the form on a specific page, displaying a dropdown with all the page names
  serializer.addProperty('survey', {
    name: 'openOnPage',
    category: 'pages',
    choices: (survey: SurveyModel, choicesCallback: any) => {
      const pages: string[] = [''].concat(
        survey.pages.map((page: PageModel) => page.name)
      );
      choicesCallback(pages);
    },
  });
  // Add property to survey settings to allow translations
  serializer.addProperty('survey', {
    name: 'translationsAllowed',
    category: 'general',
    type: 'multiplevalues',
    choices: (survey: SurveyModel, choicesCallback: any) => {
      choicesCallback(survey.getUsedLocales());
    },
  });
  // Adds a property to the survey settings to hide the page tabs
  serializer.addProperty('survey', {
    name: 'hidePagesTab',
    category: 'pages',
    type: 'boolean',
    default: false,
    visibleIndex: 2,
  });

  // Property to allow customization of the save button label
  serializer.addProperty('survey', {
    name: 'saveButtonText',
    type: 'string',
    category: 'general',
    visibleIndex: 2,
    isRequired: false,
  });

  // Allow user to select the default language of the survey
  serializer.addProperty('survey', {
    name: 'defaultLanguage:dropdown',
    category: 'general',
    visibleIndex: 3,
    isRequired: false,
    choices: (_: SurveyModel, choicesCallback: any) => {
      const languages =
        Object.keys(surveyLocalization.locales).map((locale) => ({
          value: locale,
          text:
            surveyLocalization.localeNames[locale].charAt(0).toUpperCase() +
            surveyLocalization.localeNames[locale].slice(1),
        })) ?? [];
      choicesCallback(languages);
    },
    default: 'en',
    onSetValue: (survey: SurveyModel, newValue: string) => {
      surveyLocalization.defaultLocale = newValue || 'en';
      survey.setPropertyValue('defaultLanguage', newValue || 'en');
    },
  });

  // Add ability to conditionally allow dynamic panel add new panel
  serializer.addProperty('paneldynamic', {
    name: 'AllowNewPanelsExpression:expression',
    category: 'logic',
    visibleIndex: 7,
    default: '',
    isLocalizable: true,
    onExecuteExpression: (obj: QuestionPanelDynamicModel, res: any) => {
      obj.allowAddPanel = !!res;
    },
  });

  const copyOtherMatrixProp = {
    name: 'copyRowsFromAnotherMatrix',
    category: 'rows',
    type: 'dropdown',
    choices: (question: Question, choicesCallback: any) => {
      const choices: { value: string | null; text: string }[] = [
        {
          value: null,
          text: 'None',
        },
      ];
      const questions = (question.survey as SurveyModel)?.getAllQuestions?.();
      for (const surveyQuestion of questions) {
        if (['matrix', 'matrixdropdown'].includes(surveyQuestion.getType())) {
          choices.push({
            value: surveyQuestion.name,
            text: surveyQuestion.title || surveyQuestion.name,
          });
        }
      }
      choicesCallback(
        choices.filter((choice) => choice.value !== question.name)
      );
    },

    onSetValue: (actualMatrix: Question, nameMatrix: any) => {
      const matrixToBeCopied = (
        actualMatrix.survey as SurveyModel
      )?.getQuestionByName(nameMatrix);
      actualMatrix.rows = matrixToBeCopied.rows;
      actualMatrix.choices = matrixToBeCopied.choices;
    },
  };

  // Add a property that allows copying rows from another matrix or matrixdropdown
  serializer.addProperty('matrix', copyOtherMatrixProp);
  serializer.addProperty('matrixdropdown', copyOtherMatrixProp);

  // Add a property that allows copying rows from another matrixdynamic
  serializer.addProperty('matrixdynamic', {
    name: 'copyChoicesFromAnotherDynamicMatrix',
    category: 'general',
    type: 'dropdown',
    choices: (question: Question, choicesCallback: any) => {
      const choices: { value: string | null; text: string }[] = [
        {
          value: null,
          text: 'None',
        },
      ];
      const questions = (question.survey as SurveyModel)?.getAllQuestions?.();
      for (const surveyQuestion of questions) {
        if (surveyQuestion.getType() === 'matrixdynamic') {
          choices.push({
            value: surveyQuestion.name,
            text: surveyQuestion.title || surveyQuestion.name,
          });
        }
      }
      choicesCallback(
        choices.filter((choice) => choice.value !== question.name)
      );
    },
    onSetValue: (currMatrix: Question, nameMatrix: any) => {
      const matrixToBeCopied = (
        currMatrix.survey as SurveyModel
      )?.getQuestionByName(nameMatrix);
      currMatrix.choices = matrixToBeCopied.choices;
      for (let q = currMatrix.rowCount; q < matrixToBeCopied.rowCount; q++) {
        currMatrix.addRow();
      }
    },
  });
};

/**
 * Render the other global properties
 *
 * @param question The question object
 */
export const render = (question: Question): void => {
  // define the max size for files
  if (question.getType() === 'file') {
    (question as QuestionFileModel).maxSize = 7340032;
  }
};
