import {
  ChoicesRestful,
  JsonMetadata,
  QuestionFileModel,
  Serializer,
  matrixDropdownColumnTypes,
  settings,
} from 'survey-core';
import { Question } from '../types';

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
    choices: (survey: Model, choicesCallback: any) => {
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
    choices: (survey: Model, choicesCallback: any) => {
      const pages: string[] = [''].concat(
        survey.pages.map((page: PageModel) => page.name)
      );
      choicesCallback(pages);
    },
  });
  // Adds a property to the survey settings to delete or not unticket translations in the translations tab from the JSON Object
  serializer.addProperty('survey', {
    name: 'deleteUnusedTranslations',
    category: 'general',
    type: 'dropdown',
    choices: [
      {
        value: true,
        text: 'Yes',
      },
      {
        value: false,
        text: 'No',
      },
    ],
    default: false,
  });
  // Adds a property to the survey settings to hide the page tabs
  serializer.addProperty('survey', {
    name: 'hidePagesTab',
    category: 'pages',
    type: 'boolean',
    default: false,
    visibleIndex: 2,
  });

  // Property to allow custumization of the save button label
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
