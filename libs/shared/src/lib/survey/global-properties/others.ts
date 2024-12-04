import {
  ChoicesRestful,
  JsonMetadata,
  QuestionFileModel,
  Serializer,
  matrixDropdownColumnTypes,
  settings,
} from 'survey-core';
import { registerCustomPropertyEditor } from '../components/utils/component-register';
import { CustomPropertyGridComponentTypes } from '../components/utils/components.enum';
import { Question } from '../types';
import { QuestionType } from '../../services/form-helper/form-helper.service';

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

  /** Readonly default accepted types, will use the acceptedTypesValues component */
  serializer.getProperty('file', 'acceptedTypes').readOnly = true;
  /** Size per file is mandatory */
  serializer.getProperty('file', 'maxSize').isRequired = true;

  serializer.addProperty('file', {
    category: 'general',
    type: CustomPropertyGridComponentTypes.acceptedTypesValues,
    name: 'acceptedTypesValues',
    displayName:
      'Accepted file types list(use this dropdown to set the accepted file types)',
    visibleIndex: 12,
  });

  // Accepted types tagbox
  registerCustomPropertyEditor(
    CustomPropertyGridComponentTypes.acceptedTypesValues
  );

  serializer.addProperty('file', {
    name: 'allowedFileNumber',
    category: 'general',
    dependsOn: 'allowMultiple',
    type: 'number',
    required: true,
    visibleIf: (obj: any) => {
      if (!obj || !obj.allowMultiple) {
        return false;
      } else {
        return true;
      }
    },
    visibleIndex: 10,
    default: 5,
    minValue: 2,
  });
};

/**
 * Render the other global properties
 *
 * @param question The question object
 */
export const render = (question: Question): void => {
  // define the default max size for files
  if (
    question.getType() === QuestionType.FILE &&
    !question.getPropertyValue('maxSize')
  ) {
    (question as QuestionFileModel).maxSize = 7340032;
  }
};
