import { Inject, Injectable } from '@angular/core';
import * as SurveyKo from 'survey-knockout';
import * as Survey from 'survey-angular';
import { initCreatorSettings } from '../survey/creator';
import { initCustomWidgets } from '../survey/init';
import { DomService } from './dom.service';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { FormBuilder } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class SafeFormService {

  constructor(
    @Inject('environment') environment: any,
    public domService: DomService,
    public dialog: MatDialog,
    public apollo: Apollo,
    public formBuilder: FormBuilder
  ) {
    // === CUSTOM WIDGETS / COMPONENTS ===
    initCustomWidgets(SurveyKo, domService, dialog, apollo, formBuilder);

    // === CREATOR SETTINGS ===
    initCreatorSettings(SurveyKo);

    // === CUSTOM WIDGETS / COMPONENTS ===
    initCustomWidgets(Survey, domService, dialog, apollo, formBuilder);
  }
}
