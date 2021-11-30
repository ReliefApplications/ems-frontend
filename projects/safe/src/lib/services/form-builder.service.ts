import { Injectable } from '@angular/core';
import * as Survey from 'survey-angular';

@Injectable({
  providedIn: 'root'
})
export class SafeFormBuilderService {

  constructor() { }

  createSurvey(structure: string): Survey.Survey {
    const survey = new Survey.Model(structure);
    const onCompleteExpression = survey.toJSON().onCompleteExpression;
    if (onCompleteExpression) {
      survey.onCompleting.add(() => {
        survey.runExpression(onCompleteExpression);
      });
    }
    return survey;
  }
}
