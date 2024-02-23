import { ReferenceDataService } from '../services/reference-data/reference-data.service';
import { AfterRenderQuestionEvent, SurveyModel } from 'survey-core';
import * as OthersProperties from './global-properties/others';
import * as ChoicesByGraphQLProperties from './global-properties/choices-by-graphql';
import * as ReferenceDataProperties from './global-properties/reference-data';
import { HttpClient } from '@angular/common/http';

/**
 * Render custom properties which are applied to every questions, or to
 * multiple widgets
 *
 * @param referenceDataService The reference data service
 * @param http Http client
 * @returns A function which takes the survey instance and some options as args
 */
export const renderGlobalProperties =
  (referenceDataService: ReferenceDataService, http: HttpClient) =>
  (survey: SurveyModel, options: AfterRenderQuestionEvent) => {
    OthersProperties.render(options.question);
    ReferenceDataProperties.render(options.question, referenceDataService);
    ChoicesByGraphQLProperties.render(options.question, http);
  };
