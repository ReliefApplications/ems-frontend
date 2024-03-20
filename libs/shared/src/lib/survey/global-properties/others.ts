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
