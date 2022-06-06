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
import { init as initResourceWidget } from './widgets/resource-widget';
import { init as initResourcesWidget } from './widgets/resources-widget';
import addCustomFunctions from '../utils/custom-functions';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { DomService } from '../services/dom.service';
import { FormBuilder } from '@angular/forms';
import { SafeAuthService } from '../services/auth.service';

/**
 * Executes all init methods of custom SurveyJS.
 *
 * @param survey surveyjs or surveyjs creator
 * @param domService Shared DOM service, used to inject components on the go
 * @param dialog dialog service
 * @param apollo apollo service
 * @param formBuilder form builder service
 * @param authService custom auth service
 * @param environment injected environment
 */
export const initCustomWidgets = (
  survey: any,
  domService: DomService,
  dialog: MatDialog,
  apollo: Apollo,
  formBuilder: FormBuilder,
  authService: SafeAuthService,
  environment: any
): void => {
  survey.settings.commentPrefix = '_comment';
  // load widgets (custom questions)
  widgets.select2tagbox(survey);
  initCommentWidget(survey);
  initTextWidget(survey, domService);
  initResourceWidget(survey, domService, dialog, environment);
  initResourcesWidget(survey, domService, dialog, environment);
  // load components (pre-filled questions)
  initResourceComponent(survey, domService, apollo, dialog, formBuilder);
  initResourcesComponent(survey, domService, apollo, dialog, formBuilder);
  initOwnerComponent(survey, domService, apollo, dialog, formBuilder);
  initUsersComponent(survey, domService, apollo, dialog, formBuilder);
  // load internal functions
  addCustomFunctions(survey, authService, apollo);
};
