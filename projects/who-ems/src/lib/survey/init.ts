// tslint:disable-next-line: no-reference
/// <reference path="../../typings/surveyjs-widgets/index.d.ts" />

import * as widgets from 'surveyjs-widgets';
import { init as initCountryComponent } from './components/country';
import { init as initCountriesComponent } from './components/countries';
import { init as initResourceComponent } from './components/resource';
import { init as initResourcesComponent } from './components/resources';
import { init as initCustomWidget } from './widgets/customwidget';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { DomService } from '../services/dom.service';

/*  Execute all init methods of custom SurveyJS.
*/
export function initCustomWidgets(Survey: any, domService: DomService, dialog: MatDialog, apollo: Apollo): void {
  widgets.select2tagbox(Survey);
  initCountryComponent(Survey);
  initCountriesComponent(Survey);
  initResourceComponent(Survey, dialog, apollo);
  initResourcesComponent(Survey, domService, dialog, apollo);
  initCustomWidget(Survey);
}
