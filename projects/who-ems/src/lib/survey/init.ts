import { init as initCountryComponent } from './components/country';
import { init as initCountriesComponent } from './components/countries';
import { init as initResourceComponent } from './components/resource';
import { init as initResourcesComponent } from './components/resources';
// import { init as initDateFormatWidget } from './widgets/date-format-widget';
// import { init as initTooltipWidget } from './widgets/tooltip';
import { init as initCustomWidget } from './widgets/customwidget';

/*  Execute all init methods of custom SurveyJS.
*/
export function initCustomWidgets(Survey, API_URL): void {
  // initTooltipWidget(Survey);
  // initDateFormatWidget(Survey);
  initCountryComponent(Survey);
  initCountriesComponent(Survey);
  initResourceComponent(Survey, API_URL);
  initResourcesComponent(Survey, API_URL);
  initCustomWidget(Survey);
}
