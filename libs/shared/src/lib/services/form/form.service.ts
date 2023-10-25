import { Inject, Injectable, Injector, NgZone } from '@angular/core';
import { initCreatorSettings } from '../../survey/creator';
import { initCustomSurvey } from '../../survey/init';
import { DomService } from '../dom/dom.service';
import { Dialog } from '@angular/cdk/dialog';
import { Apollo } from 'apollo-angular';
import { AuthService } from '../auth/auth.service';
import { ReferenceDataService } from '../reference-data/reference-data.service';
import { DOCUMENT } from '@angular/common';

/**
 * Shared survey service.
 * Initializes the additional code we made on top of the default logic of the library.
 * Must be initialized at some point in the applications.
 */
@Injectable({ providedIn: 'root' })
export class FormService {
  private environment: any;

  /**
   * Shared survey service.
   * Initializes the additional code we made on top of the default logic of the library.
   * Must be initialized at some point in the applications.
   *
   * @param environment Current environment
   * @param domService Shared DOM service
   * @param dialog Dialog service
   * @param apollo Apollo client
   * @param authService Shared authentication service
   * @param referenceDataService Reference data service
   * @param ngZone Angular Service to execute code inside Angular environment
   * @param injector Angular injector from where to fetch the needed services
   * @param document Document
   */
  constructor(
    @Inject('environment') environment: any,
    public domService: DomService,
    public dialog: Dialog,
    public apollo: Apollo,
    public authService: AuthService,
    public referenceDataService: ReferenceDataService,
    public ngZone: NgZone,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.environment = environment;
  }

  /**
   * Initialize form builder in Angular.
   * Initialize custom widgets / components we added on top of the form builder library.
   *
   * @param additionalQuestions Object narrowing the question types that the survey has to have
   * @param additionalQuestions.customQuestions If the survey creator should contain custom questions
   */
  initialize(
    additionalQuestions: { customQuestions: boolean } = {
      customQuestions: true,
    }
  ) {
    initCustomSurvey(
      this.environment,
      this.injector,
      additionalQuestions.customQuestions,
      this.ngZone,
      this.document
    );
    // === CREATOR SETTINGS ===
    initCreatorSettings();
  }
}
