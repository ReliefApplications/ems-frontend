import { Inject, Injectable } from '@angular/core';
import * as SurveyKo from 'survey-knockout';
import * as Survey from 'survey-angular';
import { initCreatorSettings } from '../survey/creator';
import { initCustomWidgets } from '../survey/init';
import { DomService } from './dom.service';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { FormBuilder } from '@angular/forms';
import { SafeAuthService } from './auth.service';

/**
 * Shared survey service.
 * Initializes the additional code we made on top of the default logic of the library.
 * Must be initialized at some point in the applications.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeFormService {
  /**
   * Shared survey service.
   * Initializes the additional code we made on top of the default logic of the library.
   * Must be initialized at some point in the applications.
   *
   * @param environment Current environment
   * @param domService Shared DOM service
   * @param dialog Material dialog service
   * @param apollo Apollo client
   * @param formBuilder Angular form builder
   * @param authService Shared authentication service
   */
  constructor(
    @Inject('environment') environment: any,
    public domService: DomService,
    public dialog: MatDialog,
    public apollo: Apollo,
    public formBuilder: FormBuilder,
    public authService: SafeAuthService
  ) {
    // === CUSTOM WIDGETS / COMPONENTS ===
    initCustomWidgets(
      SurveyKo,
      domService,
      dialog,
      apollo,
      formBuilder,
      authService,
      environment
    );
    // === CREATOR SETTINGS ===
    initCreatorSettings(SurveyKo);
    // === CUSTOM WIDGETS / COMPONENTS ===
    initCustomWidgets(
      Survey,
      domService,
      dialog,
      apollo,
      formBuilder,
      authService,
      environment
    );
  }
}
