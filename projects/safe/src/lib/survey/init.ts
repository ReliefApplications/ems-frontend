// tslint:disable-next-line: no-reference
/// <reference path="../../typings/surveyjs-widgets/index.d.ts" />

import * as widgets from 'surveyjs-widgets';
import { init as initCountryComponent } from './components/country';
import { init as initCountriesComponent } from './components/countries';
import { init as initResourceComponent } from './components/resource';
import { init as initResourcesComponent } from './components/resources';
import { init as initCustomWidget } from './widgets/customwidget';
import addCustomFunctions from '../utils/custom-functions';

/*  Execute all init methods of custom SurveyJS.
*/
export function initCustomWidgets(Survey: any, API_URL: string): void {
  widgets.select2tagbox(Survey);
  initCountryComponent(Survey);
  initCountriesComponent(Survey);
  initResourceComponent(Survey, API_URL);
  initResourcesComponent(Survey, API_URL);
  initCustomWidget(Survey);
  addCustomFunctions(Survey);
}
