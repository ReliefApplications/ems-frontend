// This is needed for compilation of some packages with strict option enabled.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../typings/extract-files/index.d.ts" />

import { Apollo } from 'apollo-angular';
import { UntypedFormBuilder } from '@angular/forms';
import { DomService } from '../services/dom/dom.service';
import { SafeAuthService } from '../services/auth/auth.service';
import { SafeReferenceDataService } from '../services/reference-data/reference-data.service';
import addCustomFunctions from '../utils/custom-functions';
import * as ResourceComponent from './components/resource';
import * as ResourcesComponent from './components/resources';
import * as DateRangeComponent from './components/date-range';
import * as OwnerComponent from './components/owner';
import * as UsersComponent from './components/users';
import * as GeospatialComponent from './components/geospatial';
import * as TextWidget from './widgets/text-widget';
import * as CommentWidget from './widgets/comment-widget';
import * as DropdownWidget from './widgets/dropdown-widget';
import * as TagboxWidget from './widgets/tagbox-widget';
import * as OtherProperties from './global-properties/others';
import * as ChoicesByUrlProperties from './global-properties/choicesByUrl';
import * as ReferenceDataProperties from './global-properties/reference-data';
import * as TooltipProperty from './global-properties/tooltip';
import { initLocalization } from './localization';
import { Dialog } from '@angular/cdk/dialog';
import { NgZone } from '@angular/core';
import { Survey as SurveyModel } from 'survey-knockout';
import { loadDateEditor } from './editors/date';

/** Array with available custom questions */
const CUSTOM_QUESTIONS = [
  'resource',
  'resources',
  'date-range',
  'owner',
  'users',
  'comment',
  'geospatial',
] as const;

export type CustomQuestions = (typeof CUSTOM_QUESTIONS)[number];

/**
 * Executes all init methods of custom SurveyJS.
 *
 * @param Survey surveyjs or surveyjsCreator library
 * @param domService Shared DOM service, used to inject components on the go
 * @param dialog dialog service
 * @param apollo apollo service
 * @param formBuilder form builder service
 * @param authService custom auth service
 * @param environment injected environment
 * @param referenceDataService Reference data service
 * @param ngZone Angular Service to execute code inside Angular environment
 * @param customQuestions list of custom questions to be added to the survey
 */
export const initCustomSurvey = (
  Survey: any,
  domService: DomService,
  dialog: Dialog,
  apollo: Apollo,
  formBuilder: UntypedFormBuilder,
  authService: SafeAuthService,
  environment: any,
  referenceDataService: SafeReferenceDataService,
  ngZone: NgZone,
  customQuestions: (typeof CUSTOM_QUESTIONS)[number][] = []
): void => {
  // If the survey created does not contain custom questions, we destroy previously set custom questions if so
  Survey.CustomWidgetCollection.Instance.clear();
  Survey.ComponentCollection.Instance.clear();

  TagboxWidget.init(Survey, domService);
  TextWidget.init(Survey, domService);
  DropdownWidget.init(Survey, domService);

  // load custom icons
  registerIcons(Survey);

  // load components (same as widgets, but with less configuration options)
  if (customQuestions.includes('comment')) CommentWidget.init(Survey);

  if (customQuestions.includes('resource'))
    ResourceComponent.init(
      Survey,
      domService,
      apollo,
      dialog,
      formBuilder,
      ngZone
    );

  if (customQuestions.includes('resources'))
    ResourcesComponent.init(
      Survey,
      domService,
      apollo,
      dialog,
      formBuilder,
      ngZone
    );

  if (customQuestions.includes('date-range')) {
    DateRangeComponent.init(Survey, domService);
  }

  if (customQuestions.includes('owner'))
    OwnerComponent.init(Survey, domService, apollo);

  if (customQuestions.includes('users'))
    UsersComponent.init(Survey, domService, apollo);

  if (customQuestions.includes('geospatial'))
    GeospatialComponent.init(Survey, domService);

  // load global properties
  ReferenceDataProperties.init(Survey, domService, referenceDataService);
  TooltipProperty.init(Survey);
  OtherProperties.init(Survey, environment);

  // enables POST requests for choicesByUrl
  ChoicesByUrlProperties.init(Survey);

  // set localization
  initLocalization(Survey);
  // load internal functions
  addCustomFunctions(Survey, authService);
  // load custom editors
  loadDateEditor(domService);
};

/**
 * Registers custom icons in the SurveyJS library.
 *
 * @param survey SurveyJS library
 */
const registerIcons = (survey: SurveyModel) => {
  // registers icon-daterange in the SurveyJS library
  survey.SvgRegistry.registerIconFromSvg(
    'daterange',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="5.428 4.92 15.638 16" width="15.638" height="16"><path d="M8.686 5.119c-.258.18-.284.297-.284 1.551 0 1.706.077 1.861.878 1.861.35 0 .685-.064.775-.155.103-.103.155-.647.155-1.589 0-1.241-.039-1.474-.233-1.653-.297-.272-.917-.284-1.292-.013zm7.832-.064c-.206.117-.233.336-.233 1.641 0 1.021.052 1.577.155 1.681.091.091.4.155.711.155.839 0 .982-.31.917-1.952-.026-1.111-.077-1.331-.284-1.486-.297-.206-.944-.233-1.267-.039z"/><path d="m5.803 6.837-.374.374v12.963l.31.31c.167.167.505.336.737.388.245.039 3.45.064 7.134.039l6.708-.039.374-.428.374-.414v-6.28c0-5.338-.026-6.32-.194-6.643-.272-.517-.556-.647-1.474-.647h-.788v.982c0 .917-.026.994-.388 1.37-.374.374-.44.388-1.188.336-.66-.052-.839-.117-1.099-.414s-.297-.488-.297-1.315v-.956h-4.782v.839c0 1.384-.428 1.874-1.616 1.874-.452 0-.672-.077-.982-.362-.374-.336-.414-.44-.477-1.356l-.064-.994h-.763c-.672 0-.814.039-1.15.374zm14.332 8.686c.026 3.45 0 4.239-.142 4.369-.142.103-2.004.13-6.889.117l-6.707-.039-.039-4.199c-.013-2.314 0-4.277.039-4.369.039-.13 1.474-.155 6.875-.13l6.825.039.039 4.214z"/><path d="M9.705 14.552c-.647.542-1.176 1.021-1.176 1.086 0 .117 2.339 2.069 2.481 2.069.064 0 .103-.297.103-.647v-.647h4.265v.647c0 .35.039.647.077.647.194 0 2.366-1.9 2.366-2.069.013-.167-1.991-1.925-2.325-2.041-.064-.026-.117.245-.117.607v.66h-4.265v-.647c0-.362-.052-.647-.117-.647s-.647.44-1.292.982z"/></svg>'
  );

  // registers icon-owner in the SurveyJS library
  survey.SvgRegistry.registerIconFromSvg(
    'owner',
    '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 20 20" height="18px" viewBox="0 0 20 20" width="18px" fill="#000000"><g><rect fill="none" height="20" width="20" x="0"/></g><g><path d="M17.5,8.5h-6.75C10.11,6.48,8.24,5,6,5c-2.76,0-5,2.24-5,5s2.24,5,5,5c2.24,0,4.11-1.48,4.75-3.5h0.75L13,13l1.5-1.5L16,13 l3-3L17.5,8.5z M6,12.5c-1.38,0-2.5-1.12-2.5-2.5S4.62,7.5,6,7.5S8.5,8.62,8.5,10S7.38,12.5,6,12.5z"/></g></svg>'
  );

  // registers icon-resource in the SurveyJS library
  survey.SvgRegistry.registerIconFromSvg(
    'resource',
    '<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>'
  );

  // registers icon-resources in the SurveyJS library
  survey.SvgRegistry.registerIconFromSvg(
    'resources',
    '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 20 20" height="18px" viewBox="0 0 20 20" width="18px" fill="#000000"><g><rect fill="none" height="20" width="20" x="0"/></g><g><g><path d="M2.5,5H1v10.5C1,16.33,1.67,17,2.5,17h13.18v-1.5H2.5V5z"/><path d="M16.5,4H11L9,2H5.5C4.67,2,4,2.67,4,3.5v9C4,13.33,4.67,14,5.5,14h11c0.83,0,1.5-0.67,1.5-1.5v-7C18,4.67,17.33,4,16.5,4z M16.5,12.5h-11v-9h2.88l2,2h6.12V12.5z"/></g></g></svg>'
  );

  // registers icon-users in the SurveyJS library
  survey.SvgRegistry.registerIconFromSvg(
    'users',
    '<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5 5.5 6.57 5.5 8.5 7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z"/></svg>'
  );
};
