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
import {
  SURVEY_PROP_MODAL_SAVE_BUTTON_LABEL,
  SURVEY_PROP_SAVE_BUTTON_LABEL,
} from '../../utils/survey-form-action-labels.util';
import {
  SURVEY_PROP_CONFIRM_RECORD_UPDATE,
  SURVEY_PROP_CONFIRM_RECORD_UPDATE_IF,
} from '../../utils/survey-confirm-record-update.util';
import { Question } from '../types';

type SurveyPropertyOwner = {
  getPropertyValue: (propertyName: string) => unknown;
  [key: string]: unknown;
};

/** Property-grid toggle used to reveal modal-specific label overrides. */
const ADVANCED_NAVIGATION_LABEL_OVERRIDES_PROPERTY =
  'showAdvancedNavigationLabelOverrides';
/** In-memory state key for the advanced navigation toggle. */
const ADVANCED_NAVIGATION_LABEL_OVERRIDES_STATE =
  '__showAdvancedNavigationLabelOverrides';

/**
 * Whether any modal-specific action label override is already configured.
 *
 * @param obj Survey property owner
 * @returns True when at least one modal override has a value
 */
const hasModalActionButtonLabelOverrides = (
  obj?: SurveyPropertyOwner
): boolean =>
  Boolean(obj?.getPropertyValue(SURVEY_PROP_MODAL_SAVE_BUTTON_LABEL));

/**
 * Whether modal-specific navigation overrides should be visible in the property grid.
 *
 * @param obj Survey property owner
 * @returns True when the advanced toggle is opened or override values already exist
 */
const shouldShowAdvancedNavigationLabelOverrides = (
  obj?: SurveyPropertyOwner
): boolean =>
  Boolean(
    obj?.[ADVANCED_NAVIGATION_LABEL_OVERRIDES_STATE] ||
      hasModalActionButtonLabelOverrides(obj)
  );

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

  serializer.addProperty('file', {
    name: 'allowOutdatedFiles:boolean',
    category: 'general',
    visibleIndex: 11,
    displayName: 'Allow marking files as outdated',
    description:
      'When enabled, existing files cannot be removed. Users can mark or unmark them as outdated instead.',
    default: false,
  });

  serializer.addProperty('html', {
    name: 'showOutdatedFiles:boolean',
    category: 'general',
    visibleIndex: 20,
    displayName: 'Show outdated files',
    description:
      'When disabled, file placeholders rendered in this HTML question hide files marked as outdated.',
    default: true,
  });

  // Add set value on complete expression to questions
  serializer.addProperty('question', {
    name: 'setValueOnComplete',
    type: 'expression',
    visibleIndex: -1,
    category: 'logic',
    default: '',
  });

  // Mark the form as public: the back-end extracts this flag from the
  // structure on save, exposing the form on the unauthenticated public routes.
  serializer.addProperty('survey', {
    name: 'isPublic:boolean',
    type: 'boolean',
    category: 'general',
    visibleIndex: 49,
    displayName: 'Public form',
    description:
      'When enabled, the form is accessible without authentication through the public forms application: anyone with the link can open it and submit records.',
    default: false,
  });

  // Require a confirmation modal before updating an existing record.
  serializer.addProperty('survey', {
    name: `${SURVEY_PROP_CONFIRM_RECORD_UPDATE}:boolean`,
    type: 'boolean',
    category: 'general',
    visibleIndex: 50,
    displayName: 'Confirm before updating a record',
    description:
      'When enabled, the user must confirm in a modal before an existing record is updated. Driven by the matching expression in the Logic tab when one is set.',
    default: true,
  });
  // Expression overriding the confirmation toggle (evaluated as a boolean).
  serializer.addProperty('survey', {
    name: SURVEY_PROP_CONFIRM_RECORD_UPDATE_IF,
    type: 'expression',
    category: 'logic',
    visibleIndex: 200,
    displayName: 'Confirm before updating a record (expression)',
    description:
      'When set, its boolean result decides whether the confirmation modal is shown, overriding the toggle in the general settings.',
    default: '',
    isLocalizable: false,
  });

  // Add custom label expressions for the form action buttons
  serializer.addProperty('survey', {
    name: SURVEY_PROP_SAVE_BUTTON_LABEL,
    type: 'expression',
    category: 'navigation',
    visibleIndex: 100,
    default: '',
    // Localizable so admins can author a per-locale expression; the active
    // locale's expression is resolved at runtime by getSurveyFormActionButtonLabels.
    isLocalizable: true,
  });
  serializer.addProperty('survey', {
    name: `${ADVANCED_NAVIGATION_LABEL_OVERRIDES_PROPERTY}:boolean`,
    type: 'boolean',
    category: 'navigation',
    visibleIndex: 102,
    displayName: 'Modal Label Overrides',
    default: false,
    isSerializable: false,
    onGetValue: (obj: SurveyPropertyOwner) =>
      shouldShowAdvancedNavigationLabelOverrides(obj),
    onSetValue: (obj: SurveyPropertyOwner, value: boolean) => {
      obj[ADVANCED_NAVIGATION_LABEL_OVERRIDES_STATE] = value;
    },
  });
  serializer.addProperty('survey', {
    name: SURVEY_PROP_MODAL_SAVE_BUTTON_LABEL,
    type: 'expression',
    category: 'navigation',
    visibleIndex: 103,
    displayName: 'Modal save label override',
    description:
      'Only used when the form is opened in a modal. Falls back to the regular save label if empty.',
    default: '',
    // Localizable so admins can author a per-locale expression; the active
    // locale's expression is resolved at runtime by getSurveyFormActionButtonLabels.
    isLocalizable: true,
    visibleIf: shouldShowAdvancedNavigationLabelOverrides,
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
};
