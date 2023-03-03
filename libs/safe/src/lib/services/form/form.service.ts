import { Inject, Injectable } from '@angular/core';
import * as SurveyKo from 'survey-knockout';
import * as Survey from 'survey-angular';
import { initCreatorSettings } from '../../survey/creator';
import { initCustomSurvey } from '../../survey/init';
import { DomService } from '../dom/dom.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Apollo } from 'apollo-angular';
import { UntypedFormBuilder } from '@angular/forms';
import { SafeAuthService } from '../auth/auth.service';
import { SafeReferenceDataService } from '../reference-data/reference-data.service';

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
   * @param referenceDataService Reference data service
   */
  constructor(
    @Inject('environment') environment: any,
    public domService: DomService,
    public dialog: MatDialog,
    public apollo: Apollo,
    public formBuilder: UntypedFormBuilder,
    public authService: SafeAuthService,
    public referenceDataService: SafeReferenceDataService
  ) {
    // === CUSTOM WIDGETS / COMPONENTS ===
    initCustomSurvey(
      SurveyKo,
      domService,
      dialog,
      apollo,
      formBuilder,
      authService,
      environment,
      referenceDataService
    );
    // === CREATOR SETTINGS ===
    initCreatorSettings(SurveyKo);
    // === CUSTOM WIDGETS / COMPONENTS ===
    initCustomSurvey(
      Survey,
      domService,
      dialog,
      apollo,
      formBuilder,
      authService,
      environment,
      referenceDataService
    );
  }
}
