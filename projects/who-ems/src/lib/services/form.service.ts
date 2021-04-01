import { ComponentFactoryResolver, Inject, Injectable } from '@angular/core';
import * as SurveyKo from 'survey-knockout';
import * as Survey from 'survey-angular';
import { initCreatorSettings } from '../survey/creator';
import { initCustomWidgets } from '../survey/init';
import { DomService } from './dom.service';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    @Inject('environment') environment,
    private domService: DomService
  ) {
    // === CUSTOM WIDGETS / COMPONENTS ===
    initCustomWidgets(SurveyKo, `${environment.API_URL}/graphql`, domService);

    // === STYLE ===
    // SurveyCreator.StylesManager.applyTheme('darkblue');

    // === CREATOR SETTINGS ===
    initCreatorSettings(SurveyKo);

    // === CUSTOM WIDGETS / COMPONENTS ===
    initCustomWidgets(Survey, `${environment.API_URL}/graphql`, domService);

    // === STYLE ===
    // Survey.StylesManager.applyTheme('darkblue');
  }
}
