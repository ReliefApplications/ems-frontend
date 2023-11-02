import { ReferenceDataService } from '../services/reference-data/reference-data.service';
import { AfterRenderQuestionEvent, SurveyModel } from 'survey-core';
import * as OthersProperties from './global-properties/others';
import * as ReferenceDataProperties from './global-properties/reference-data';

/**
 * Render custom properties which are applied to every questions, or to
 * multiple widgets
 *
 * @param referenceDataService The reference data service
 * @returns A function which takes the survey instance and some options as args
 */
export const renderGlobalProperties =
  (referenceDataService: ReferenceDataService) =>
  (survey: SurveyModel, options: AfterRenderQuestionEvent) => {
    OthersProperties.render(options.question);
    ReferenceDataProperties.render(options.question, referenceDataService);
  };
