// This is needed for compilation of surveyjs-widgets with strict option enabled.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../typings/surveyjs-widgets/index.d.ts" />

import * as widgets from 'surveyjs-widgets';
import { init as initResourceComponent } from './components/resource';
import { init as initResourcesComponent } from './components/resources';
import { init as initOwnerComponent } from './components/owner';
import { init as initUsersComponent } from './components/users';
import addCustomFunctions from '../utils/custom-functions';
import { init as initCustomWidget } from './widget';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { DomService } from '../services/dom.service';
import { FormBuilder } from '@angular/forms';
import { SafeAuthService } from '../services/auth.service';

/*  Execute all init methods of custom SurveyJS.
*/
export function initCustomWidgets(
  Survey: any,
  domService: DomService,
  dialog: MatDialog,
  apollo: Apollo,
  formBuilder: FormBuilder,
  authService: SafeAuthService,
  environment: any
): void {
  Survey.settings.commentPrefix = '_comment';
  // supportCreatorV2
  widgets.select2tagbox(Survey);
  initResourceComponent(Survey, domService, apollo, dialog, formBuilder);
  initResourcesComponent(Survey, domService, apollo, dialog, formBuilder);
  initOwnerComponent(Survey, domService, apollo, dialog, formBuilder);
  initUsersComponent(Survey, domService, apollo, dialog, formBuilder);
  initCustomWidget(Survey, domService, dialog, environment);
  addCustomFunctions(Survey, authService, apollo);
}
