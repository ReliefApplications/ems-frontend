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
      const accessToken = localStorage.getItem('access_token');
      options.request.setRequestHeader('Authorization', `Bearer ${token}`);
      options.request.setRequestHeader('AccessToken', accessToken);
    } else if (
      environment.csApiUrl &&
      sender.url.startsWith(environment.csApiUrl)
    ) {
      const accessToken = localStorage.getItem('access_token');
      options.request.setRequestHeader(
        'Authorization',
        `Bearer ${accessToken}`
      );
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

  // Adds property to hold the current record
  serializer.addProperty('survey', {
    name: 'record',
    visible: false,
    isSerializable: false,
  });

  // === Communication history (email chain) ===
  // Allows forms to append a snapshot entry into a paneldynamic question only on save.
  serializer.addProperty('paneldynamic', {
    name: 'appendOnSave:boolean',
    category: 'Custom Questions',
    displayName: 'Append entry on save',
    default: false,
    visibleIndex: 1,
  });
  serializer.addProperty('paneldynamic', {
    name: 'allowDuplicates:boolean',
    category: 'Custom Questions',
    displayName: 'Allow duplicate entries',
    default: false,
    visibleIndex: 2,
  });
  serializer.addProperty('paneldynamic', {
    name: 'newestFirst:boolean',
    category: 'Custom Questions',
    displayName: 'Newest first',
    default: false,
    visibleIndex: 3,
  });
  serializer.addProperty('paneldynamic', {
    name: 'maxEntries:number',
    category: 'Custom Questions',
    displayName: 'Maximum entries (0 = unlimited)',
    default: 0,
    visibleIndex: 4,
  });

  serializer.addProperty('paneldynamic', {
    name: 'fromField',
    category: 'Custom Questions',
    displayName: 'From field',
    description: 'Question name to snapshot into history.from',
    visibleIndex: 10,
  });
  serializer.addProperty('paneldynamic', {
    name: 'toField',
    category: 'Custom Questions',
    displayName: 'To field',
    description: 'Question name to snapshot into history.to',
    visibleIndex: 11,
  });
  serializer.addProperty('paneldynamic', {
    name: 'subjectField',
    category: 'Custom Questions',
    displayName: 'Subject field',
    description: 'Question name to snapshot into history.subject',
    visibleIndex: 12,
  });
  serializer.addProperty('paneldynamic', {
    name: 'sentOnField',
    category: 'Custom Questions',
    displayName: 'Sent on field',
    description: 'Question name to snapshot into history.sentOn',
    visibleIndex: 13,
  });
  serializer.addProperty('paneldynamic', {
    name: 'bodyField',
    category: 'Custom Questions',
    displayName: 'Body field',
    description: 'Question name to snapshot into history.body',
    visibleIndex: 14,
  });
  serializer.addProperty('paneldynamic', {
    name: 'commentField',
    category: 'Custom Questions',
    displayName: 'Comment field (optional)',
    description:
      'Question name containing an optional comment attached to the entry (history.comment)',
    visibleIndex: 15,
  });
  serializer.addProperty('paneldynamic', {
    name: 'clearCommentFieldOnSave:boolean',
    category: 'logic',
    displayName: 'Clear comment field on save',
    default: true,
    visibleIndex: 16,
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
  if (question.getType() === 'file' && !question.getPropertyValue('maxSize')) {
    (question as QuestionFileModel).maxSize = 7340032;
  }

  // Ensure dynamic panels that store a history thread render all saved entries.
  if (
    question.getType() === 'paneldynamic' &&
    !question.getPropertyValue('appendOnSave')
  ) {
    // No-op: panel count is handled during append; avoid extra hooks to keep behavior simple.
  }
};
