import { Injectable } from '@angular/core';
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
   */
  constructor(private referenceDataService: SafeReferenceDataService) {}

  /**
   * Creates new survey from the structure and add on complete expression to it.
   *
   * @param structure form structure
   * @param fields list of fields used to check if the fields should be hidden or disabled
   * @returns New survey
   */
  createSurvey(structure: string, fields: any[] = []): Survey.Survey {
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
    if (fields.length > 0) {
      for (const f of fields) {
        const hidden: boolean = (f.canSee !== undefined && !f.canSee) || false;
        const disabled: boolean =
          (f.canUpdate !== undefined && !f.canUpdate) || false;
        survey.getQuestionByName(f.name).visible = !hidden;
        survey.getQuestionByName(f.name).readOnly = disabled;
      }
    }
    return survey;
  }
}
