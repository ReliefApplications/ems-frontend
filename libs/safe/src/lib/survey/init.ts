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
import * as OwnerComponent from './components/owner';
import * as UsersComponent from './components/users';
import * as GeospatialComponent from './components/geospatial';
import * as TextWidget from './widgets/text-widget';
import * as CommentWidget from './widgets/comment-widget';
import * as DropdownWidget from './widgets/dropdown-widget';
import * as TagboxWidget from './widgets/tagbox-widget';
import * as OtherProperties from './global-properties/others';
// import * as ChoicesByUrlProperties from './global-properties/choicesByUrl';
import * as ReferenceDataProperties from './global-properties/reference-data';
import * as TooltipProperty from './global-properties/tooltip';
import { initLocalization } from './localization';
import { Dialog } from '@angular/cdk/dialog';
import { NgZone } from '@angular/core';

/**
 * Executes all init methods of custom SurveyJS.
 *
 * @param Survey surveyjs or surveyjsCreator library
 * @param domService Shared DOM service, used to inject components on the go
 * @param dialog dialog service
 * @param apollo apollo service
 * @param fb form builder service
 * @param authService custom auth service
 * @param environment injected environment
 * @param referenceDataService Reference data service
 * @param containsCustomQuestions If survey contains custom questions or not
 * @param ngZone Angular Service to execute code inside Angular environment
 */
export const initCustomSurvey = (
  Survey: any,
  domService: DomService,
  dialog: Dialog,
  apollo: Apollo,
  fb: UntypedFormBuilder,
  authService: SafeAuthService,
  environment: any,
  referenceDataService: SafeReferenceDataService,
  containsCustomQuestions: boolean,
  ngZone: NgZone
): void => {
  // If the survey created does not contain custom questions, we destroy previously set custom questions if so
  if (!containsCustomQuestions) {
    Survey.CustomWidgetCollection.Instance.clear();
    Survey.ComponentCollection.Instance.clear();
  }

  TagboxWidget.init(Survey, domService);
  TextWidget.init(Survey, domService);
  DropdownWidget.init(Survey, domService);

  if (containsCustomQuestions) {
    CommentWidget.init(Survey);
    // load components (same as widgets, but with less configuration options)
    ResourceComponent.init(Survey, domService, apollo, dialog, fb, ngZone);
    ResourcesComponent.init(Survey, domService, apollo, dialog, fb, ngZone);
    OwnerComponent.init(Survey, domService, apollo);
    UsersComponent.init(Survey, domService, apollo);
    GeospatialComponent.init(Survey, domService);
  }

  // load global properties
  ReferenceDataProperties.init(Survey, domService, referenceDataService);
  TooltipProperty.init(Survey);
  OtherProperties.init(Survey, environment);

  // enables POST requests for choicesByUrl
  // todo: enable
  // ChoicesByUrlProperties.init(Survey);

  // set localization
  initLocalization(Survey);
  // load internal functions
  addCustomFunctions(Survey, authService);
};
