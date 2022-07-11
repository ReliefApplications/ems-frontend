import {
  ChoicesRestful,
  JsonMetadata,
  Question,
  QuestionFile,
  SurveyModel,
} from 'survey-angular';

/**
 * Add support for custom properties to the survey
 *
 * @param Survey Survey library
 * @param environment Current environment
 */
export const init = (Survey: any, environment: any): void => {
  const serializer: JsonMetadata = Survey.Serializer;

  // change the prefix for comments
  Survey.settings.commentPrefix = '_comment';
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
  // Pass token before the request to fetch choices by URL if it's targeting SAFE API
  Survey.ChoicesRestfull.onBeforeSendRequest = (
    sender: ChoicesRestful,
    options: { request: XMLHttpRequest }
  ) => {
    if (sender.url.includes(environment.apiUrl)) {
      const token = localStorage.getItem('idtoken');
      options.request.setRequestHeader('Authorization', `Bearer ${token}`);
    }
  };
  // add the onCompleteExpression property to the survey
  serializer.addProperty('survey', {
    name: 'onCompleteExpression:expression',
    type: 'expression',
    visibleIndex: 350,
    category: 'logic',
  });
};

/**
 * Render the other global properties
 *
 * @param survey The survey instance
 * @param options The options object
 * @param options.question The question object
 * @param options.htmlElement The dom element
 */
export const render = (
  survey: SurveyModel,
  options: { question: Question; htmlElement: HTMLElement }
): void => {
  // get the question and the html element of the question
  const question = options.question;

  // define the max size for files
  if (question.getType() === 'file') {
    (question as QuestionFile).maxSize = 7340032;
  }
};
