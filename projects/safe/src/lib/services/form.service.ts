import { Inject, Injectable } from '@angular/core';
import * as SurveyKo from 'survey-knockout';
import * as Survey from 'survey-angular';
import { initCreatorSettings } from '../survey/creator';
import { initCustomWidgets } from '../survey/init';
import { Record } from '../models/record.model';
@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(@Inject('environment') environment: any) {
    // === CUSTOM WIDGETS / COMPONENTS ===
    initCustomWidgets(SurveyKo, `${environment.API_URL}/graphql`);

    // === CREATOR SETTINGS ===
    initCreatorSettings(SurveyKo);

    // === CUSTOM WIDGETS / COMPONENTS FOR SURVEY ===
    initCustomWidgets(Survey, `${environment.API_URL}/graphql`);
  }

  addCustomFunctions(record?: Record | undefined): void {
    Survey.FunctionFactory.Instance.register('createdAt', () => record ? new Date(Number(record.createdAt) || '') : new Date());
    Survey.FunctionFactory.Instance.register('modifiedAt', () => record ? new Date(Number(record.modifiedAt) || '') : new Date());
    Survey.FunctionFactory.Instance.register('weekday', (params: Date[]) => (new Date(params[0])).getDay());
    Survey.FunctionFactory.Instance.register('addDays', (params: any[]) => {
      const result = new Date(params[0]);
      result.setDate(result.getDate() + Number(params[1]));
      return result;
    });
  }
}
