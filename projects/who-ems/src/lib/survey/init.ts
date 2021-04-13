// tslint:disable-next-line: no-reference
/// <reference path="../../typings/surveyjs-widgets/index.d.ts" />

import * as widgets from 'surveyjs-widgets';
import { init as initCountryComponent } from './components/country';
import { init as initCountriesComponent } from './components/countries';
import { init as initResourceComponent } from './components/resource';
import { init as initResourcesComponent } from './components/resources';
import { init as initCustomWidget } from './widgets/customwidget';

/*  Execute all init methods of custom SurveyJS.
*/
export function initCustomWidgets(Survey, API_URL, domService, dialog, apollo): void {
  widgets.select2tagbox(Survey);
  initCountryComponent(Survey);
  initCountriesComponent(Survey);
  initResourceComponent(Survey, API_URL, dialog, apollo);
  initResourcesComponent(Survey, API_URL, domService, dialog);
  initCustomWidget(Survey);
}
