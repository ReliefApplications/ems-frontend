// This is needed for compilation of some packages with strict option enabled.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../typings/extract-files/index.d.ts" />

import { Apollo } from 'apollo-angular';
import { AuthService } from '../services/auth/auth.service';
import { DomService } from '../services/dom/dom.service';
import { ReferenceDataService } from '../services/reference-data/reference-data.service';
import addCustomFunctions from '../utils/custom-functions';
import * as EditorComponent from './components/editor';
import * as GeospatialComponent from './components/geospatial';
import * as OwnerComponent from './components/owner';
import * as ResourceComponent from './components/resource';
import * as ResourcesComponent from './components/resources';
import * as UsersComponent from './components/users';
import * as CsApiDocsProperties from './global-properties/cs-api-docs';
import * as OtherProperties from './global-properties/others';
import * as CommentWidget from './widgets/comment-widget';
import * as DropdownWidget from './widgets/dropdown-widget';
import * as TagboxWidget from './widgets/tagbox-widget';
import * as TextWidget from './widgets/text-widget';
import * as FileWidget from './widgets/file-widget';
// import * as ChoicesByUrlProperties from './global-properties/choicesByUrl';
import { Injector, NgZone } from '@angular/core';
import { AngularComponentFactory } from 'survey-angular-ui';
import {
  ComponentCollection,
  CustomWidgetCollection,
  ElementFactory,
} from 'survey-core';
import {
  CustomPropertyGridComponentTypes,
  CustomPropertyGridEditors,
} from './components/utils/components.enum';
import * as ChoicesByGraphQLProperties from './global-properties/choices-by-graphql';
import * as PopupWidthProperty from './global-properties/popup-width';
import * as ReferenceDataProperties from './global-properties/reference-data';
import * as TooltipProperty from './global-properties/tooltip';
import { initLocalization } from './localization';

/** Name of the custom components we add to the survey */
const CUSTOM_COMPONENTS = [
  'resource',
  'resources',
  'owner',
  'users',
  'geospatial',
  'editor',
];

/**
 * Executes all init methods of custom SurveyJS.
 *
 * @param environment injected environment
 * @param injector Parent instance angular injector containing all needed services and directives
 * @param containsCustomQuestions If survey contains custom questions or not
 * @param ngZone Angular Service to execute code inside Angular environment
 * @param document Document
 */
export const initCustomSurvey = (
  environment: any,
  injector: Injector,
  containsCustomQuestions: boolean,
  ngZone: NgZone,
  document: Document
): void => {
  const domService = injector.get(DomService);
  const apollo = injector.get(Apollo);
  const authService = injector.get(AuthService);
  const referenceDataService = injector.get(ReferenceDataService);

  // If the survey created does not contain custom questions, we destroy previously set custom questions if so
  if (!containsCustomQuestions) {
    CustomWidgetCollection.Instance.clear();

    // Save default items to be restored later
    const defaultItems = ComponentCollection.Instance.items.filter(
      (i) => !CUSTOM_COMPONENTS.includes(i.name)
    );

    // Clear all items
    ComponentCollection.Instance.clear();

    // Add default items back
    defaultItems.forEach((item) => ComponentCollection.Instance.add(item.json));
  }

  TagboxWidget.init(domService, CustomWidgetCollection.Instance, document);
  TextWidget.init(domService, CustomWidgetCollection.Instance, document);
  DropdownWidget.init(domService, CustomWidgetCollection.Instance, document);
  FileWidget.init(injector, CustomWidgetCollection.Instance);

  if (containsCustomQuestions) {
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
    ResourceComponent.init(
      injector,
      ComponentCollection.Instance,
      ngZone,
      document
    );
    ResourcesComponent.init(
      injector,
      ComponentCollection.Instance,
      ngZone,
      document
    );
    OwnerComponent.init(apollo, ComponentCollection.Instance);
    UsersComponent.init(ComponentCollection.Instance, domService);
    GeospatialComponent.init(domService, ComponentCollection.Instance);
    EditorComponent.init(injector, ComponentCollection.Instance);
  }

  // load global properties
  ChoicesByGraphQLProperties.init();
  ReferenceDataProperties.init(referenceDataService);
  TooltipProperty.init();
  PopupWidthProperty.init();
  OtherProperties.init(environment);
  if (environment.csApiUrl) {
    CsApiDocsProperties.init();
  }
  // enables POST requests for choicesByUrl
  // ChoicesByUrlProperties.init();

  // set localization
  initLocalization();
  // load internal functions
  addCustomFunctions(authService);
};
