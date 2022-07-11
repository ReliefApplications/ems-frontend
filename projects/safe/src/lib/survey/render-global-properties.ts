import { SafeReferenceDataService } from '../services/reference-data.service';
import { Question, SurveyModel } from 'survey-angular';
import * as OthersProperties from './global-properties/others';
import * as ReferenceDataProperties from './global-properties/reference-data';
import * as TooltipProperty from './global-properties/tooltip';

/**
 * Render the custom properties
 *
 * @param referenceDataService The reference data service
 * @returns A function which takes the survey instance and the options as args
 */
export const renderGlobalProperties =
  (
    referenceDataService: SafeReferenceDataService
  ): ((
    survey: SurveyModel,
    options: { question: Question; htmlElement: HTMLElement }
  ) => void) =>
  (
    survey: SurveyModel,
    options: { question: Question; htmlElement: HTMLElement }
  ): void => {
    OthersProperties.render(survey, options);
    TooltipProperty.render(survey, options);
    ReferenceDataProperties.render(survey, options, referenceDataService);
  };
