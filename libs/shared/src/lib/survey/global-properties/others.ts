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
import { MatrixManager } from '../controllers/matrixManager';

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

  // When the VisibleIf property is cleared, sets the question to visible
  serializer.getProperty('question', 'visibleIf').onSettingValue = (
    question: Question,
    newValue: string
  ) => {
    if (question.visibleIf && !newValue) {
      question.setPropertyValue('visible', true);
    }
    return newValue;
  };
  // Adds valueExpression to questions, that when set pretty much transforms it into an expression question
  // whilst still keeping normal question behaviors
  Serializer.addProperty('question', {
    name: 'valueExpression:expression',
    category: 'logic',
    onExecuteExpression: (obj: Question, res: any) => {
      obj.readOnly = true;
      obj.value = res;
    },
  });

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

  // Adds a property to the survey settings to hide the page tabs
  serializer.addProperty('survey', {
    name: 'hidePagesTab',
    category: 'pages',
    type: 'boolean',
    default: false,
    visibleIndex: 2,
  });

  // Adds a property to the survey settings to hide the survey navigation buttons
  serializer.addProperty('survey', {
    name: 'hideNavigationButtons',
    category: 'pages',
    type: 'boolean',
    default: false,
    visibleIndex: 3,
  });

  const yesNoChoices = [
    {
      value: true,
      text: 'Yes',
    },
    {
      value: false,
      text: 'No',
    },
  ];
  // Adds a property to the survey settings to show or hide the close button on record modal
  serializer.addProperty('survey', {
    name: 'showCloseButtonOnModal',
    category: 'general',
    type: 'dropdown',
    choices: yesNoChoices,
    default: true,
  });

  // Adds a property to the survey settings to ask for confirmation on closing the record modal
  serializer.addProperty('survey', {
    name: 'confirmOnModalClose',
    category: 'general',
    type: 'dropdown',
    choices: yesNoChoices,
    default: true,
  });
  // Property to allow customization of the save button label
  serializer.addProperty('survey', {
    name: 'saveButtonText',
    type: 'string',
    category: 'general',
    visibleIndex: 2,
    isRequired: false,
  });
  // Adds a property to the survey settings to show or hide the delete button on record modal
  serializer.addProperty('survey', {
    name: 'showDeleteButtonOnModal',
    category: 'general',
    type: 'dropdown',
    choices: yesNoChoices,
    default: false,
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

  // Adds property to display in the form component the upload records button
  serializer.addProperty('survey', {
    name: 'allowUploadRecords',
    category: 'Records',
    type: 'boolean',
    default: false,
    visibleIndex: 2,
  });

  // Add ability to conditionally allow dynamic panel add new panel
  serializer.addProperty('paneldynamic', {
    name: 'AllowNewPanelsExpression:expression',
    category: 'logic',
    visibleIndex: 7,
    default: '',
    isLocalizable: true,
    onExecuteExpression: (obj: QuestionPanelDynamicModel, res: any) => {
      // Weird bug with surveyJS, if we don't wait a bit, it doesn't work
      setTimeout(() => {
        obj.allowAddPanel = !!res;
      }, 50);
    },
  });

  // Add property to the dynamic panel to start on the last element
  serializer.addProperty('paneldynamic', {
    name: 'startOnLastElement:boolean',
    category: 'general',
    default: false,
  });

  // Add option to omit question from fields
  serializer.addProperty('question', {
    name: 'omitField:boolean',
    category: 'general',
    visibleIndex: 6,
    default: false,
  });

  // Add option to omit question on form template
  serializer.addProperty('question', {
    name: 'omitOnXlsxTemplate:boolean',
    category: 'general',
    visibleIndex: 7,
    default: false,
  });

  const copyRowsOtherMatrixProp = {
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
            text: surveyQuestion.name,
          });
        }
      }
      choicesCallback(
        choices.filter((choice) => choice.value !== question.name)
      );
    },

    onSetValue: (question: Question, copyFrom: string | null) => {
      question.setPropertyValue('copyRowsFromAnotherMatrix', copyFrom);
      const matrixManager: MatrixManager = (question.survey as SurveyModel)
        .matrixManager;

      if (!matrixManager) {
        return;
      }
      matrixManager.addCopyConfig(question.name, {
        rows: copyFrom || undefined,
        columns: question.copyColumnsFromAnotherMatrix || undefined,
      });
    },
  };

  // Add a property that allows copying rows from another matrix
  serializer.addProperty('matrix', copyRowsOtherMatrixProp);
  serializer.addProperty('matrixdropdown', copyRowsOtherMatrixProp);

  const copyColumnsOtherMatrixProp = {
    name: 'copyColumnsFromAnotherMatrix',
    category: 'columns',
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
        if (
          ['matrix', 'matrixdropdown', 'matrixdynamic'].includes(
            surveyQuestion.getType()
          )
        ) {
          choices.push({
            value: surveyQuestion.name,
            text: surveyQuestion.name,
          });
        }
      }
      choicesCallback(
        choices.filter((choice) => choice.value !== question.name)
      );
    },
    onSetValue: (question: Question, copyFrom: string | null) => {
      question.setPropertyValue('copyColumnsFromAnotherMatrix', copyFrom);
      const matrixManager: MatrixManager = (question.survey as SurveyModel)
        .matrixManager;

      if (!matrixManager) {
        return;
      }
      matrixManager.addCopyConfig(question.name, {
        rows: question.copyRowsFromAnotherMatrix || undefined,
        columns: copyFrom || undefined,
      });
    },
  };

  // Add a property that allows copying columns from another matrix
  serializer.addProperty('matrixdropdown', copyColumnsOtherMatrixProp);
  serializer.addProperty('matrixdynamic', copyColumnsOtherMatrixProp);
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
