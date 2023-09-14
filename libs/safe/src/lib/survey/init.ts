// This is needed for compilation of some packages with strict option enabled.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../typings/extract-files/index.d.ts" />

import { Apollo } from 'apollo-angular';
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
import * as ChoicesByUrlProperties from './global-properties/choicesByUrl';
import * as ReferenceDataProperties from './global-properties/reference-data';
import * as TooltipProperty from './global-properties/tooltip';
import { initLocalization } from './localization';
import { Injector, NgZone } from '@angular/core';
import { ComponentCollection, CustomWidgetCollection } from 'survey-core';
import { AngularComponentFactory } from 'survey-angular-ui';
import {
  CustomPropertyGridComponentTypes,
  CustomPropertyGridEditors,
} from './components/utils/custom-components.enum';

/**
 * Executes all init methods of custom SurveyJS.
 *
 * @param environment injected environment
 * @param injector Parent instance angular injector containing all needed services and directives
 * @param containsCustomQuestions If survey contains custom questions or not
 * @param ngZone Angular Service to execute code inside Angular environment
 */
export const initCustomSurvey = (
  environment: any,
  injector: Injector,
  containsCustomQuestions: boolean,
  ngZone: NgZone
): void => {
  const domService = injector.get(DomService);
  const apollo = injector.get(Apollo);
  const authService = injector.get(SafeAuthService);
  const referenceDataService = injector.get(SafeReferenceDataService);

  // If the survey created does not contain custom questions, we destroy previously set custom questions if so
  if (!containsCustomQuestions) {
    CustomWidgetCollection.Instance.clear();
    ComponentCollection.Instance.clear();
  }

  TagboxWidget.init(domService, CustomWidgetCollection.Instance);
  TextWidget.init(domService, CustomWidgetCollection.Instance);
  DropdownWidget.init(domService, CustomWidgetCollection.Instance);

  if (containsCustomQuestions) {
    // Register all custom property grid component types
    const registeredTypes = AngularComponentFactory.Instance.getAllTypes();
    Object.keys(CustomPropertyGridComponentTypes).forEach((propertyKey) => {
      const propertyType =
        CustomPropertyGridComponentTypes[
          propertyKey as keyof typeof CustomPropertyGridComponentTypes
        ];
      if (!registeredTypes.includes(propertyType)) {
        AngularComponentFactory.Instance.registerComponent(
          `${propertyType}-question`,
          CustomPropertyGridEditors[propertyType]
        );
      }
    });
    CommentWidget.init(CustomWidgetCollection.Instance);
    // load components (same as widgets, but with less configuration options)
    ResourceComponent.init(injector, ComponentCollection.Instance, ngZone);
    ResourcesComponent.init(injector, ComponentCollection.Instance, ngZone);
    OwnerComponent.init(domService, apollo, ComponentCollection.Instance);
    UsersComponent.init(domService, apollo, ComponentCollection.Instance);
    GeospatialComponent.init(domService, ComponentCollection.Instance);
  }

  // load global properties
  ReferenceDataProperties.init(domService, referenceDataService);
  TooltipProperty.init();
  OtherProperties.init(environment);

  // enables POST requests for choicesByUrl
  ChoicesByUrlProperties.init();

  // set localization
  initLocalization();
  // load internal functions
  addCustomFunctions(authService);
};
