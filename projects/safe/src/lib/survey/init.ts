// This is needed for compilation of surveyjs-widgets with strict option enabled.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../typings/surveyjs-widgets/index.d.ts" />

import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import * as SurveyJSWidgets from 'surveyjs-widgets';

import { DomService } from '../services/dom.service';
import { SafeAuthService } from '../services/auth.service';
import { SafeReferenceDataService } from '../services/reference-data.service';
import addCustomFunctions from '../utils/custom-functions';

import * as ResourceComponent from './components/resource';
import * as ResourcesComponent from './components/resources';
import * as OwnerComponent from './components/owner';
import * as UsersComponent from './components/users';
import * as TextWidget from './widgets/text-widget';
import * as CommentWidget from './widgets/comment-widget';
import * as OtherProperties from './global-properties/others';
import * as ReferenceDataProperties from './global-properties/reference-data';
import * as TooltipProperty from './global-properties/tooltip';

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
 */
export const initCustomSurvey = (
  Survey: any,
  domService: DomService,
  dialog: MatDialog,
  apollo: Apollo,
  formBuilder: FormBuilder,
  authService: SafeAuthService,
  environment: any,
  referenceDataService: SafeReferenceDataService
): void => {
  // load widgets (aka custom questions)
  SurveyJSWidgets.select2tagbox(Survey);
  CommentWidget.init(Survey);
  TextWidget.init(Survey, domService);
  // load components (same as widgets, but with less configuration options)
  ResourceComponent.init(Survey, domService, apollo, dialog, formBuilder);
  ResourcesComponent.init(Survey, domService, apollo, dialog, formBuilder);
  OwnerComponent.init(Survey, domService, apollo);
  UsersComponent.init(Survey, domService, apollo);
  // load global properties
  ReferenceDataProperties.init(Survey, domService, referenceDataService);
  TooltipProperty.init(Survey);
  OtherProperties.init(Survey, environment);
  // load internal functions
  addCustomFunctions(Survey, authService, apollo);
};
