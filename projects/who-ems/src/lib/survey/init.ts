import { init as initCountryComponent } from './components/country';
import { init as initCountriesComponent } from './components/countries';
import { init as initDateFormatWidget } from './widgets/date-format-widget';
import { init as initResourceComponent } from './components/resource';

/*  Execute all init methods of custom SurveyJS.
*/
export function initCustomWidgets(Survey, API_URL): void{

  Survey
      .Serializer
      .addProperty('question', {
        name: 'tooltip:text',
        category: 'general'
      });

  // initCustomWidget(Survey);
  // initFullnameComponent(Survey);
  initCountryComponent(Survey);
  initCountriesComponent(Survey);
  initDateFormatWidget(Survey);
  // initResourceInputWidget(Survey, API_URL);
  initResourceComponent(Survey, API_URL);
}
