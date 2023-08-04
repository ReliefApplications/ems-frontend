// This is needed for compilation of some packages with strict option enabled.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../typings/extract-files/index.d.ts" />

import { Apollo } from 'apollo-angular';
import { UntypedFormBuilder } from '@angular/forms';
import { DomService } from '../services/dom/dom.service';
import { SafeAuthService } from '../services/auth/auth.service';
import { SafeReferenceDataService } from '../services/reference-data/reference-data.service';
import addCustomFunctions from '../utils/custom-functions';
import * as ResourceComponent from './components/resource';
import * as ResourcesComponent from './components/resources';
import * as OwnerComponent from './components/owner';
import * as UsersComponent from './components/users';
import * as GeospatialComponent from './components/geospatial';
import * as TextWidget from './widgets/text-widget';
import * as CommentWidget from './widgets/comment-widget';
import * as DropdownWidget from './widgets/dropdown-widget';
import * as TagboxWidget from './widgets/tagbox-widget';
import * as OtherProperties from './global-properties/others';
import * as ReferenceDataProperties from './global-properties/reference-data';
import * as TooltipProperty from './global-properties/tooltip';
import { initLocalization } from './localization';
import { Dialog } from '@angular/cdk/dialog';
import { NgZone } from '@angular/core';

/**
 * Executes all init methods of custom SurveyJS.
 *
 * @param Survey Survey instance
 * @param domService Shared DOM service, used to inject components on the go
 * @param dialog dialog service
 * @param apollo apollo service
 * @param formBuilder form builder service
 * @param authService custom auth service
 * @param environment injected environment
 * @param referenceDataService Reference data service
 * @param containsCustomQuestions If survey contains custom questions or not
 * @param ngZone Angular Service to execute code inside Angular environment
 */
export const initCustomSurvey = (
  Survey: any,
  domService: DomService,
  dialog: Dialog,
  apollo: Apollo,
  formBuilder: UntypedFormBuilder,
  authService: SafeAuthService,
  environment: any,
  referenceDataService: SafeReferenceDataService,
  containsCustomQuestions: boolean,
  ngZone: NgZone
): void => {
  // If the survey created does not contain custom questions, we destroy previously set custom questions if so
  if (!containsCustomQuestions) {
    Survey.CustomWidgetCollection.Instance.clear();
    Survey.ComponentCollection.Instance.clear();
  }

  TagboxWidget.init(domService, Survey.CustomWidgetCollection.Instance);
  TextWidget.init(domService, Survey.CustomWidgetCollection.Instance);
  DropdownWidget.init(domService, Survey.CustomWidgetCollection.Instance);

  if (containsCustomQuestions) {
    CommentWidget.init(Survey.CustomWidgetCollection.Instance);
    // load components (same as widgets, but with less configuration options)
    ResourceComponent.init(
      domService,
      apollo,
      dialog,
      formBuilder,
      Survey.ComponentCollection.Instance,
      ngZone
    );
    ResourcesComponent.init(
      domService,
      apollo,
      dialog,
      formBuilder,
      Survey.ComponentCollection.Instance,
      ngZone
    );
    OwnerComponent.init(
      domService,
      apollo,
      Survey.ComponentCollection.Instance
    );
    UsersComponent.init(
      domService,
      apollo,
      Survey.ComponentCollection.Instance
    );
    GeospatialComponent.init(domService, Survey.ComponentCollection.Instance);
  }

  // load global properties
  ReferenceDataProperties.init(domService, referenceDataService);
  TooltipProperty.init();
  OtherProperties.init(environment);
  // set localization
  initLocalization();
  // load internal functions
  addCustomFunctions(authService);
};
