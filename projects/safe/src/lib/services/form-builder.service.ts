import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as Survey from 'survey-angular';
import { SafeReferenceDataService } from './reference-data.service';
import { renderGlobalProperties } from '../survey/render-global-properties';

/**
 * Shared form builder service.
 * Only used to add on complete expression to the survey.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeFormBuilderService {
  /**
   * Constructor of the service
   *
   * @param referenceDataService Reference data service
   * @param translate Translation service
   */
  constructor(
    private referenceDataService: SafeReferenceDataService,
    private translate: TranslateService
  ) {}

  /**
   * Creates new survey from the structure and add on complete expression to it.
   *
   * @param structure form structure
   * @returns New survey
   */
  createSurvey(structure: string): Survey.Survey {
    const survey = new Survey.Model(structure);
    survey.onAfterRenderQuestion.add(
      renderGlobalProperties(this.referenceDataService)
    );
    const onCompleteExpression = survey.toJSON().onCompleteExpression;
    if (onCompleteExpression) {
      survey.onCompleting.add(() => {
        survey.runExpression(onCompleteExpression);
      });
    }
    // set the lang of the survey
    const surveyLang = localStorage.getItem('surveyLang');
    if (surveyLang && survey.getUsedLocales().includes(surveyLang)) {
      survey.locale = surveyLang;
    } else {
      const lang = this.translate.currentLang || this.translate.defaultLang;
      if (survey.getUsedLocales().includes(lang)) {
        survey.locale = lang;
      }
    }
    return survey;
  }
}
