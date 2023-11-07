import {
  ChoicesRestful,
  JsonMetadata,
  QuestionFileModel,
  QuestionPanelDynamicModel,
  Serializer,
  matrixDropdownColumnTypes,
  settings,
} from 'survey-core';
import { Question, QuestionResource } from '../types';
import { SurveyModel, PageModel } from 'survey-core';

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
        obj.value = null;
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
  // Add multiplevalues to survey settings to select the allowed languages
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
  // Add a property to the single select matrix to copy the value of a question from another matrix
  serializer.addProperty('matrix', {
    name: 'copyOtherSingleSelectMatrixValue',
    category: 'general',
    type: 'dropdown',
    choices: (question: Question, choicesCallback: any) => {
      const actualQuestion = question.toJSON().name;
      const choices: string[] = [''];
      const questions = (question.survey as SurveyModel)?.getAllQuestions?.();
      for (const question of questions) {
        if (
          question.getType() === 'matrix' &&
          question.toJSON().name !== actualQuestion
        ) {
          choices.push(question.toJSON().name);
        }
      }
      choicesCallback(choices);
    },
    onSetValue: (actualMatrix: QuestionResource, nameMatrix: any) => {
      const matrixToBeCopied = (
        actualMatrix.survey as SurveyModel
      )?.getQuestionByName(nameMatrix);
      actualMatrix.choices = matrixToBeCopied.choices;
      actualMatrix.rows = matrixToBeCopied.rows;
    },
  });
  // Add a property to the single select matrix to copy the value of a question from another matrix
  serializer.addProperty('matrixdropdown', {
    name: 'copyOtherMultiSelectMatrixValue',
    category: 'general',
    type: 'dropdown',
    choices: (question: Question, choicesCallback: any) => {
      const actualQuestion = question.toJSON().name;
      const choices: string[] = [''];
      const questions = (question.survey as SurveyModel)?.getAllQuestions?.();
      for (const question of questions) {
        if (
          question.getType() === 'matrixdropdown' &&
          question.toJSON().name !== actualQuestion
        ) {
          choices.push(question.toJSON().name);
        }
      }
      choicesCallback(choices);
    },
    onSetValue: (actualMatrix: QuestionResource, nameMatrix: any) => {
      const matrixToBeCopied = (
        actualMatrix.survey as SurveyModel
      )?.getQuestionByName(nameMatrix);
      actualMatrix.rows = matrixToBeCopied.rows;
      actualMatrix.choices = matrixToBeCopied.choices;
    },
  });
  // Add a property to the matrix dynamic to copy the value of a question from another matrix
  serializer.addProperty('matrixdynamic', {
    name: 'copyOtherDynamicMatrixValue',
    category: 'general',
    type: 'dropdown',
    choices: (question: Question, choicesCallback: any) => {
      const actualQuestion = question.toJSON().name;
      const choices: string[] = [''];
      const questions = (question.survey as SurveyModel)?.getAllQuestions?.();
      for (const question of questions) {
        if (
          question.getType() === 'matrixdynamic' &&
          question.toJSON().name !== actualQuestion
        ) {
          choices.push(question.toJSON().name);
        }
      }
      choicesCallback(choices);
    },
    onSetValue: (actualMatrix: Question, nameMatrix: any) => {
      const matrixToBeCopied = (
        actualMatrix.survey as SurveyModel
      )?.getQuestionByName(nameMatrix);
      actualMatrix.choices = matrixToBeCopied.choices;
      for (let q = actualMatrix.rowCount; q < matrixToBeCopied.rowCount; q++) {
        actualMatrix.addRow();
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
