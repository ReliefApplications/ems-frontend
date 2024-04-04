// This is needed for compilation of some packages with strict option enabled.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../typings/extract-files/index.d.ts" />

import { Apollo } from 'apollo-angular';
import { DomService } from '../services/dom/dom.service';
import { AuthService } from '../services/auth/auth.service';
import { ReferenceDataService } from '../services/reference-data/reference-data.service';
import addCustomFunctions from './custom-functions';
import * as TextWidget from './widgets/text-widget';
import * as CommentWidget from './widgets/comment-widget';
import * as DropdownWidget from './widgets/dropdown-widget';
import * as TagboxWidget from './widgets/tagbox-widget';
import * as Matrices from './components/matrices';
import * as OtherProperties from './global-properties/others';
// import * as ChoicesByUrlProperties from './global-properties/choicesByUrl';
import * as ReferenceDataProperties from './global-properties/reference-data';
import * as TooltipProperty from './global-properties/tooltip';
import { initLocalization } from './localization';
import { Injector, NgZone } from '@angular/core';
import {
  ComponentCollection,
  CustomWidgetCollection,
  ElementFactory,
} from 'survey-core';
import { AngularComponentFactory } from 'survey-angular-ui';
import {
  CustomPropertyGridComponentTypes,
  CustomPropertyGridEditors,
} from './components/utils/components.enum';
import { TranslateService } from '@ngx-translate/core';
import {
  CustomQuestionTypes,
  InitCustomQuestionComponent,
} from './custom-question-types';

/**
 * Executes all init methods of custom SurveyJS.
 *
 * @param environment injected environment
 * @param injector Parent instance angular injector containing all needed services and directives
 * @param customQuestions List of custom questions to load
 * @param ngZone Angular Service to execute code inside Angular environment
 * @param document Document
 */
export const initCustomSurvey = (
  environment: any,
  injector: Injector,
  customQuestions: Array<CustomQuestionTypes>,
  ngZone: NgZone,
  document: Document
): void => {
  const domService = injector.get(DomService);
  const apollo = injector.get(Apollo);
  const authService = injector.get(AuthService);
  const referenceDataService = injector.get(ReferenceDataService);
  const translateService = injector.get(TranslateService);

  CustomWidgetCollection.Instance.clear();
  ComponentCollection.Instance.clear();

  TagboxWidget.init(domService, CustomWidgetCollection.Instance, document);
  TextWidget.init(
    domService,
    translateService,
    CustomWidgetCollection.Instance,
    document
  );
  DropdownWidget.init(domService, CustomWidgetCollection.Instance, document);
  Matrices.init(domService, referenceDataService);

  if (customQuestions) {
    // Register all custom property grid component types
    const registeredTypes = AngularComponentFactory.Instance.getAllTypes();
    const registeredElements = ElementFactory.Instance.getAllTypes();
    Object.keys(CustomPropertyGridComponentTypes).forEach((propertyKey) => {
      const propertyType =
        CustomPropertyGridComponentTypes[
        propertyKey as keyof typeof CustomPropertyGridComponentTypes
        ];
      // Register the component in the Angular factory(the class with the @Component decorator)
      if (!registeredTypes.includes(propertyType)) {
        AngularComponentFactory.Instance.registerComponent(
          `${propertyType}-question`,
          CustomPropertyGridEditors[propertyType].component
        );
      }
      // Register the related question model in the element factory
      if (!registeredElements.includes(propertyType)) {
        ElementFactory.Instance.registerElement(propertyType, (name) => {
          return new CustomPropertyGridEditors[propertyType].model(name);
        });
      }
    });
    CommentWidget.init(CustomWidgetCollection.Instance, document);
    // load components (same as widgets, but with less configuration options)
    customQuestions.forEach((questionType) => {
      const initQuestionComponent = InitCustomQuestionComponent[questionType];
      if (initQuestionComponent) {
        initQuestionComponent({
          injector,
          instance: ComponentCollection.Instance,
          ngZone,
          document,
        });
      }
    });
  }

  // load global properties
  ReferenceDataProperties.init(referenceDataService);
  TooltipProperty.init();
  OtherProperties.init(environment);

  // enables POST requests for choicesByUrl
  // ChoicesByUrlProperties.init();

  // set localization
  initLocalization();
  // load internal functions
  addCustomFunctions({
    authService,
    apollo,
  });
};
