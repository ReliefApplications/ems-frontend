// This is needed for compilation of surveyjs-widgets with strict option enabled.
// tslint:disable-next-line: no-reference
/// <reference path="../../typings/surveyjs-widgets/index.d.ts" />

import * as widgets from 'surveyjs-widgets';
import { init as initCountryComponent } from './components/country';
import { init as initCountriesComponent } from './components/countries';
import { init as initResourceComponent } from './components/resource';
import { init as initResourcesComponent } from './components/resources';
import { init as initOwnerComponent } from './components/owner';
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
  widgets.select2tagbox(Survey);
  initCountryComponent(Survey);
  initCountriesComponent(Survey);
  initResourceComponent(Survey, domService, apollo, dialog, formBuilder);
  initResourcesComponent(Survey, domService, apollo, dialog, formBuilder);
  initOwnerComponent(Survey, domService, apollo, dialog, formBuilder);
  initCustomWidget(Survey, domService, dialog, environment);
  addCustomFunctions(Survey, authService);
}
