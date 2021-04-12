import { ComponentFactoryResolver, Inject, Injectable } from '@angular/core';
import * as SurveyKo from 'survey-knockout';
import * as Survey from 'survey-angular';
import { initCreatorSettings } from '../survey/creator';
import { initCustomWidgets } from '../survey/init';
import { DomService } from './dom.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    @Inject('environment') environment,
    private domService: DomService,
    public dialog: MatDialog,
  ) {
    // === CUSTOM WIDGETS / COMPONENTS ===
    initCustomWidgets(SurveyKo, `${environment.API_URL}/graphql`, domService, dialog);

    // === STYLE ===
    // SurveyCreator.StylesManager.applyTheme('darkblue');

    // === CREATOR SETTINGS ===
    initCreatorSettings(SurveyKo);

    // === CUSTOM WIDGETS / COMPONENTS ===
    initCustomWidgets(Survey, `${environment.API_URL}/graphql`, domService, dialog);

    // === STYLE ===
    // Survey.StylesManager.applyTheme('darkblue');
  }
}
