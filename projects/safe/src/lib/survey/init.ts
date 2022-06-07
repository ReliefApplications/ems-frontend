// This is needed for compilation of surveyjs-widgets with strict option enabled.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../typings/surveyjs-widgets/index.d.ts" />

import * as widgets from 'surveyjs-widgets';
import { init as initResourceComponent } from './components/resource';
import { init as initResourcesComponent } from './components/resources';
import { init as initOwnerComponent } from './components/owner';
import { init as initUsersComponent } from './components/users';
import { init as initTextWidget } from './widgets/text-widget';
import { init as initCommentWidget } from './widgets/comment-widget';
import { initCustomProperties } from './custom-properties';
import addCustomFunctions from '../utils/custom-functions';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { DomService } from '../services/dom.service';
import { FormBuilder } from '@angular/forms';
import { SafeAuthService } from '../services/auth.service';

/**
 * Executes all init methods of custom SurveyJS.
 *
 * @param Survey surveyjs or surveyjs creator library
 * @param domService Shared DOM service, used to inject components on the go
 * @param dialog dialog service
 * @param apollo apollo service
 * @param formBuilder form builder service
 * @param authService custom auth service
 * @param environment injected environment
 */
export const initCustomSurvey = (
  Survey: any,
  domService: DomService,
  dialog: MatDialog,
  apollo: Apollo,
  formBuilder: FormBuilder,
  authService: SafeAuthService,
  environment: any
): void => {
  // load widgets (aka custom questions)
  widgets.select2tagbox(Survey);
  initCommentWidget(Survey);
  initTextWidget(Survey, domService);
  // load components (same as widgets, but with less configuration options)
  initResourceComponent(Survey, domService, apollo, dialog, formBuilder);
  initResourcesComponent(Survey, domService, apollo, dialog, formBuilder);
  initOwnerComponent(Survey, domService, apollo);
  initUsersComponent(Survey, domService, apollo);
  // load custom properties
  initCustomProperties(Survey, environment);
  // load internal functions
  addCustomFunctions(Survey, authService, apollo);
};
