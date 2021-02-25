import { init as initCountryComponent } from './components/country';
import { init as initCountriesComponent } from './components/countries';
import { init as initResourceComponent } from './components/resource';
import { init as initDateFormatWidget } from './widgets/date-format-widget';
import { init as initTooltipWidget } from './widgets/tooltip';

/*  Execute all init methods of custom SurveyJS.
*/
export function initCustomWidgets(Survey, API_URL): void{
  initTooltipWidget(Survey);
  initCountryComponent(Survey);
  initCountriesComponent(Survey);
  initDateFormatWidget(Survey);
  initResourceComponent(Survey, API_URL);
}
